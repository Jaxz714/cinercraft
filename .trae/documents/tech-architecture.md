## 1. 架构设计

```mermaid
flowchart TB
    subgraph Frontend["前端层 (Next.js + React)"]
        UI["UI 组件"]
        State["状态管理 (React Context)"]
        Auth["认证模块"]
    end
    
    subgraph Backend["后端服务 (Supabase)"]
        AuthAPI["认证 API"]
        DBAPI["数据库 API"]
        Storage["文件存储"]
    end
    
    subgraph Data["数据层 (PostgreSQL)"]
        Users["users 表"]
        Projects["projects 表"]
        Storyboards["storyboards 表"]
    end
    
    UI --> State
    State --> Auth
    Auth --> AuthAPI
    State --> DBAPI
    DBAPI --> Users
    DBAPI --> Projects
    DBAPI --> Storyboards
    Storage --> Storyboards
```

## 2. 技术说明

- **前端框架**：Next.js 14 (App Router) + React 18
- **样式方案**：Tailwind CSS 3 + CSS Variables
- **UI 组件**：自定义组件 + Radix UI 原语
- **状态管理**：React Context + useReducer
- **认证服务**：Supabase Auth
- **数据库**：Supabase PostgreSQL
- **文件存储**：Supabase Storage
- **初始化工具**：create-next-app

## 3. 路由定义

| 路由 | 用途 | 权限 |
|------|------|------|
| `/` | 重定向到登录页或工作台 | 公开 |
| `/login` | 登录/注册页面 | 公开 |
| `/dashboard` | 工作台大盘 | 需登录 |
| `/project/[id]` | 分镜工作区 | 需登录 |
| `/project/[id]/storyboard/[sid]` | 单个分镜详情 | 需登录 |

## 4. API 定义

### 4.1 认证 API (Supabase Auth)

```typescript
interface AuthUser {
  id: string;
  email: string;
  created_at: string;
}

interface AuthResponse {
  user: AuthUser | null;
  session: Session | null;
  error: Error | null;
}

// 登录
async function signIn(email: string, password: string): Promise<AuthResponse>;

// 注册
async function signUp(email: string, password: string): Promise<AuthResponse>;

// 登出
async function signOut(): Promise<void>;

// 获取当前用户
async function getCurrentUser(): Promise<AuthUser | null>;
```

### 4.2 项目 API

```typescript
interface Project {
  id: string;
  user_id: string;
  title: string;
  description?: string;
  thumbnail_url?: string;
  created_at: string;
  updated_at: string;
}

interface CreateProjectInput {
  title: string;
  description?: string;
  thumbnail_url?: string;
}

// 获取用户所有项目
async function getProjects(): Promise<Project[]>;

// 创建新项目
async function createProject(input: CreateProjectInput): Promise<Project>;

// 获取单个项目
async function getProject(id: string): Promise<Project | null>;

// 更新项目
async function updateProject(id: string, input: Partial<CreateProjectInput>): Promise<Project>;

// 删除项目
async function deleteProject(id: string): Promise<void>;
```

### 4.3 分镜 API

```typescript
interface Storyboard {
  id: string;
  project_id: string;
  scene_desc: string;
  camera_move: string;
  aesthetic_style: string;
  subject_tags: string[];
  final_prompt: string;
  image_url?: string;
  created_at: string;
}

interface CreateStoryboardInput {
  project_id: string;
  scene_desc: string;
  camera_move: string;
  aesthetic_style: string;
  subject_tags: string[];
  final_prompt: string;
  image_url?: string;
}

// 获取项目的所有分镜
async function getStoryboards(projectId: string): Promise<Storyboard[]>;

// 创建分镜
async function createStoryboard(input: CreateStoryboardInput): Promise<Storyboard>;

// 更新分镜
async function updateStoryboard(id: string, input: Partial<CreateStoryboardInput>): Promise<Storyboard>;

// 删除分镜
async function deleteStoryboard(id: string): Promise<void>;
```

## 5. 数据模型

### 5.1 数据模型定义

```mermaid
erDiagram
    users ||--o{ projects : "创建"
    projects ||--o{ storyboards : "包含"
    
    users {
        uuid id PK "用户唯一标识"
        string email "用户邮箱"
        string password_hash "密码哈希"
        timestamp created_at "创建时间"
    }
    
    projects {
        uuid id PK "项目ID"
        uuid user_id FK "关联用户ID"
        string title "项目名称"
        text description "项目描述"
        string thumbnail_url "封面图URL"
        timestamp created_at "创建时间"
        timestamp updated_at "更新时间"
    }
    
    storyboards {
        uuid id PK "分镜ID"
        uuid project_id FK "关联项目ID"
        text scene_desc "场景描述"
        string camera_move "运镜方式"
        string aesthetic_style "美学风格"
        jsonb subject_tags "主体标签"
        text final_prompt "最终提示词"
        string image_url "分镜图片URL"
        timestamp created_at "创建时间"
    }
```

### 5.2 数据定义语言 (DDL)

```sql
-- 启用 UUID 扩展
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 用户表 (由 Supabase Auth 自动管理)
-- projects 表
CREATE TABLE IF NOT EXISTS projects (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    thumbnail_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- storyboards 表
CREATE TABLE IF NOT EXISTS storyboards (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    scene_desc TEXT NOT NULL,
    camera_move VARCHAR(100) NOT NULL,
    aesthetic_style VARCHAR(100) NOT NULL,
    subject_tags JSONB DEFAULT '[]'::jsonb,
    final_prompt TEXT NOT NULL,
    image_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 创建索引
CREATE INDEX idx_projects_user_id ON projects(user_id);
CREATE INDEX idx_storyboards_project_id ON storyboards(project_id);
CREATE INDEX idx_storyboards_created_at ON storyboards(created_at DESC);

-- 更新时间触发器
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_projects_updated_at
    BEFORE UPDATE ON projects
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- RLS (Row Level Security) 策略
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE storyboards ENABLE ROW LEVEL SECURITY;

-- 用户只能访问自己的项目
CREATE POLICY "Users can view their own projects"
    ON projects FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own projects"
    ON projects FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own projects"
    ON projects FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own projects"
    ON projects FOR DELETE
    USING (auth.uid() = user_id);

-- 用户只能访问自己项目下的分镜
CREATE POLICY "Users can view storyboards in their projects"
    ON storyboards FOR SELECT
    USING (EXISTS (
        SELECT 1 FROM projects
        WHERE projects.id = storyboards.project_id
        AND projects.user_id = auth.uid()
    ));

CREATE POLICY "Users can create storyboards in their projects"
    ON storyboards FOR INSERT
    WITH CHECK (EXISTS (
        SELECT 1 FROM projects
        WHERE projects.id = storyboards.project_id
        AND projects.user_id = auth.uid()
    ));

CREATE POLICY "Users can update storyboards in their projects"
    ON storyboards FOR UPDATE
    USING (EXISTS (
        SELECT 1 FROM projects
        WHERE projects.id = storyboards.project_id
        AND projects.user_id = auth.uid()
    ));

CREATE POLICY "Users can delete storyboards in their projects"
    ON storyboards FOR DELETE
    USING (EXISTS (
        SELECT 1 FROM projects
        WHERE projects.id = storyboards.project_id
        AND projects.user_id = auth.uid()
    ));
```

## 6. 环境配置

### 6.1 环境变量

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# 应用配置
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 6.2 项目结构

```
cinecraft/
├── app/
│   ├── (auth)/
│   │   └── login/
│   │       └── page.tsx
│   ├── (dashboard)/
│   │   ├── dashboard/
│   │   │   └── page.tsx
│   │   └── project/
│   │       └── [id]/
│   │           └── page.tsx
│   ├── layout.tsx
│   ├── globals.css
│   └── page.tsx
├── components/
│   ├── ui/
│   │   ├── button.tsx
│   │   ├── input.tsx
│   │   ├── select.tsx
│   │   └── card.tsx
│   ├── auth/
│   │   └── login-form.tsx
│   ├── dashboard/
│   │   ├── sidebar.tsx
│   │   ├── project-card.tsx
│   │   └── new-project-drawer.tsx
│   └── storyboard/
│       ├── param-panel.tsx
│       ├── result-panel.tsx
│       └── prompt-display.tsx
├── lib/
│   ├── supabase/
│   │   ├── client.ts
│   │   └── auth.ts
│   ├── api/
│   │   ├── projects.ts
│   │   └── storyboards.ts
│   └── prompt/
│       └── generator.ts
├── hooks/
│   ├── use-auth.ts
│   └── use-projects.ts
├── types/
│   └── index.ts
├── .env.local
├── tailwind.config.ts
├── next.config.js
└── package.json
```

## 7. 提示词生成逻辑

### 7.1 提示词模板结构

```typescript
interface PromptTemplate {
  base: string;
  cameraMove: Record<string, string>;
  aestheticStyle: Record<string, string>;
  quality: string;
}

const promptTemplate: PromptTemplate = {
  base: "Cinematic shot, {scene_desc}",
  cameraMove: {
    "推拉摇移": "smooth dolly movement, push in slowly",
    "FPV穿梭航拍": "FPV drone shot, high-speed穿梭 through the scene, dynamic camera movement",
    "大范围延时摄影": "hyperlapse, time-lapse movement, smooth tracking shot",
    "环绕飞行": "360° orbit shot, circling around the subject",
    "跟踪跟拍": "tracking shot, following the subject, steady cam movement",
    "升降镜头": "crane shot, vertical movement, rising/falling perspective"
  },
  aestheticStyle: {
    "赛博蜀都美学": "Cyber-Shu aesthetic, neon lights reflecting on wet surfaces, traditional architecture meets futuristic holograms, purple and cyan color palette",
    "冷峻工业风": "industrial brutalism, cold steel textures, harsh lighting, desaturated colors, mechanical atmosphere",
    "梦幻柔焦": "dreamy soft focus, lens flare, shallow depth of field, ethereal glow, pastel tones",
    "纪实粗粝": "documentary style, handheld camera shake, natural lighting, raw and gritty texture",
    "电影胶片": "analog film grain, warm vintage tones, Kodak Portra 400 look, cinematic color grading",
    "未来科技": "futuristic sci-fi, holographic elements, blue and purple lighting, sleek metallic surfaces"
  },
  quality: "8K resolution, ultra HD, professional cinematography, film grain, anamorphic lens"
};

function generatePrompt(
  sceneDesc: string,
  cameraMove: string,
  aestheticStyle: string,
  subjectTags: string[]
): string {
  const parts = [
    promptTemplate.base.replace("{scene_desc}", sceneDesc),
    promptTemplate.cameraMove[cameraMove],
    promptTemplate.aestheticStyle[aestheticStyle],
    subjectTags.join(", "),
    promptTemplate.quality
  ];
  
  return parts.filter(Boolean).join(", ");
}
```
