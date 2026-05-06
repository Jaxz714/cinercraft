export interface User {
  id: string;
  email: string;
  created_at: string;
}

export interface Project {
  id: string;
  user_id: string;
  title: string;
  description?: string;
  thumbnail_url?: string;
  created_at: string;
  updated_at: string;
}

export interface Storyboard {
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

export interface CreateProjectInput {
  title: string;
  description?: string;
  thumbnail_url?: string;
}

export interface CreateStoryboardInput {
  project_id: string;
  scene_desc: string;
  camera_move: string;
  aesthetic_style: string;
  subject_tags: string[];
  final_prompt: string;
  image_url?: string;
}

export type CameraMoveType = 
  | "推拉摇移"
  | "FPV穿梭航拍"
  | "大范围延时摄影"
  | "环绕飞行"
  | "跟踪跟拍"
  | "升降镜头";

export type AestheticStyleType = 
  | "赛博蜀都美学"
  | "冷峻工业风"
  | "梦幻柔焦"
  | "纪实粗粝"
  | "电影胶片"
  | "未来科技";

export const CAMERA_MOVE_OPTIONS: { value: CameraMoveType; label: string; description: string }[] = [
  { value: "推拉摇移", label: "推拉摇移", description: "经典摄影机运动，推近/拉远/摇摄/移动" },
  { value: "FPV穿梭航拍", label: "FPV穿梭航拍", description: "第一人称视角无人机穿梭镜头" },
  { value: "大范围延时摄影", label: "大范围延时摄影", description: "移动延时，展现时间流逝" },
  { value: "环绕飞行", label: "环绕飞行", description: "360度环绕主体拍摄" },
  { value: "跟踪跟拍", label: "跟踪跟拍", description: "跟随主体移动的镜头" },
  { value: "升降镜头", label: "升降镜头", description: "垂直方向的升降运动" },
];

export const AESTHETIC_STYLE_OPTIONS: { value: AestheticStyleType; label: string; description: string }[] = [
  { value: "赛博蜀都美学", label: "赛博蜀都美学 (Cyber-Shu)", description: "霓虹灯光 + 传统建筑融合" },
  { value: "冷峻工业风", label: "冷峻工业风", description: "金属质感，冷色调，机械美学" },
  { value: "梦幻柔焦", label: "梦幻柔焦", description: "柔和光晕，浅景深，浪漫氛围" },
  { value: "纪实粗粝", label: "纪实粗粝", description: "手持感，自然光，真实质感" },
  { value: "电影胶片", label: "电影胶片", description: "颗粒感，暖色调，经典电影感" },
  { value: "未来科技", label: "未来科技", description: "全息投影，蓝紫光效，科幻感" },
];
