# CineCraft - 智能视听策划引擎

> 面向自媒体人、导演和影视专业学生的「一站式运镜与分镜策划工作站」

![CineCraft Logo](https://via.placeholder.com/120x120)

## 功能特色

- **智能提示词生成**：将模糊的画面创意转化为专业的摄影机运动指令
- **专业运镜模式**：支持 FPV 航拍、大范围延时摄影、环绕飞行等多种专业运镜
- **独特美学风格**：赛博蜀都美学、冷峻工业风、梦幻柔焦等多种视觉风格
- **导演视角笔记**：自动生成专业的导演指导建议
- **项目管理**：管理和组织您的所有视频策划项目

## 技术栈

- **前端框架**: React 18 + Next.js 风格架构
- **构建工具**: Vite 6
- **状态管理**: Zustand
- **样式方案**: Tailwind CSS 3
- **图标库**: Lucide React
- **数据库**: Supabase (支持演示模式)

## 快速开始

### 演示模式

无需配置数据库即可体验完整功能：

```bash
npm install
npm run dev
```

访问 `http://localhost:5173`，点击「快速体验演示模式」即可登录。

### 配置 Supabase (可选)

1. 在 [Supabase](https://supabase.com) 创建项目
2. 复制 `.env.example` 为 `.env.local`
3. 填入您的 Supabase 配置：

```env
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

4. 在 Supabase SQL 编辑器中运行建表脚本

## 项目结构

```
src/
├── components/          # 组件目录
│   ├── auth/           # 认证相关组件
│   ├── dashboard/      # 工作台组件
│   └── storyboard/     # 分镜工作区组件
├── pages/             # 页面组件
├── hooks/             # 自定义 Hooks
├── lib/               # 工具函数和 API
├── types/             # TypeScript 类型定义
└── App.tsx            # 应用入口
```

## 核心功能

### 1. 现代化登录系统
- 邮箱/密码登录与注册
- 玻璃态设计风格
- 演示模式支持

### 2. 工作台大盘
- 项目列表管理
- 数据统计面板
- 新建项目功能

### 3. 智能分镜工作区
- 场景描述输入
- 运镜模式选择 (6种)
- 美学风格选择 (6种)
- 主体标签输入
- AI 提示词生成
- 导演视角笔记

## 运镜模式

| 模式 | 描述 |
|------|------|
| 推拉摇移 | 经典摄影机运动 |
| FPV穿梭航拍 | 第一人称无人机穿梭 |
| 大范围延时摄影 | 移动延时摄影 |
| 环绕飞行 | 360度环绕拍摄 |
| 跟踪跟拍 | 跟随主体移动 |
| 升降镜头 | 垂直升降运动 |

## 美学风格

| 风格 | 描述 |
|------|------|
| 赛博蜀都美学 | 霓虹灯光 + 传统建筑 |
| 冷峻工业风 | 金属质感机械美学 |
| 梦幻柔焦 | 柔和光晕浪漫氛围 |
| 纪实粗粝 | 手持感真实质感 |
| 电影胶片 | 颗粒感复古色调 |
| 未来科技 | 全息投影科幻感 |

## 部署

### GitHub Pages

项目已配置 GitHub Actions 自动部署：

1. 创建 GitHub 仓库
2. 推送代码到 `main` 分支
3. 在仓库设置中启用 GitHub Pages (gh-pages 分支)

### 手动部署

```bash
npm run build
# 将 dist 目录部署到任意静态托管服务
```

## 许可证

MIT License

## 贡献

欢迎提交 Issue 和 Pull Request！

---

**CineCraft** - 让创意触手可及 🎬
