import type { CameraMoveType, AestheticStyleType } from '../types';

interface PromptTemplate {
  base: string;
  cameraMove: Record<string, string>;
  aestheticStyle: Record<string, string>;
  quality: string;
}

const promptTemplate: PromptTemplate = {
  base: "Cinematic shot, {scene_desc}",
  cameraMove: {
    "推拉摇移": "smooth dolly movement, push in slowly, cinematic camera work",
    "FPV穿梭航拍": "FPV drone shot, high-speed穿梭 through the scene, dynamic camera movement, immersive first-person view",
    "大范围延时摄影": "hyperlapse, time-lapse movement, smooth tracking shot, time flowing",
    "环绕飞行": "360° orbit shot, circling around the subject, aerial cinematography",
    "跟踪跟拍": "tracking shot, following the subject, steady cam movement, gimbal stabilized",
    "升降镜头": "crane shot, vertical movement, rising/falling perspective, dramatic reveal"
  },
  aestheticStyle: {
    "赛博蜀都美学": "Cyber-Shu aesthetic, neon lights reflecting on wet surfaces, traditional architecture meets futuristic holograms, purple and cyan color palette, rain-slicked streets",
    "冷峻工业风": "industrial brutalism, cold steel textures, harsh lighting, desaturated colors, mechanical atmosphere, concrete and metal",
    "梦幻柔焦": "dreamy soft focus, lens flare, shallow depth of field, ethereal glow, pastel tones, romantic atmosphere",
    "纪实粗粝": "documentary style, handheld camera shake, natural lighting, raw and gritty texture, authentic feel",
    "电影胶片": "analog film grain, warm vintage tones, Kodak Portra 400 look, cinematic color grading, nostalgic atmosphere",
    "未来科技": "futuristic sci-fi, holographic elements, blue and purple lighting, sleek metallic surfaces, advanced technology"
  },
  quality: "8K resolution, ultra HD, professional cinematography, film grain, anamorphic lens flare, color graded"
};

export function generatePrompt(
  sceneDesc: string,
  cameraMove: CameraMoveType,
  aestheticStyle: AestheticStyleType,
  subjectTags: string[]
): string {
  const parts = [
    promptTemplate.base.replace("{scene_desc}", sceneDesc),
    promptTemplate.cameraMove[cameraMove],
    promptTemplate.aestheticStyle[aestheticStyle],
    subjectTags.length > 0 ? subjectTags.join(", ") : null,
    promptTemplate.quality
  ];
  
  return parts.filter(Boolean).join(", ");
}

export function generateDirectorNotes(
  sceneDesc: string,
  cameraMove: CameraMoveType,
  aestheticStyle: AestheticStyleType
): string {
  const notes: string[] = [];
  
  notes.push(`【场景描述】\n${sceneDesc}`);
  notes.push(`\n【运镜指导】\n${cameraMove}：${promptTemplate.cameraMove[cameraMove]}`);
  notes.push(`\n【美学风格】\n${aestheticStyle}：${promptTemplate.aestheticStyle[aestheticStyle]}`);
  
  notes.push(`\n【导演视角建议】`);
  
  if (cameraMove === "FPV穿梭航拍") {
    notes.push("- 建议使用高速无人机，保持流畅的穿越感");
    notes.push("- 注意安全距离，预留后期裁剪空间");
  } else if (cameraMove === "大范围延时摄影") {
    notes.push("- 建议使用稳定器或滑轨，保持运动轨迹平滑");
    notes.push("- 每帧间隔建议 2-5 秒，根据场景动态调整");
  } else if (cameraMove === "推拉摇移") {
    notes.push("- 建议使用轨道或稳定器，确保运动平滑");
    notes.push("- 控制速度，配合场景情绪变化");
  }
  
  if (aestheticStyle === "赛博蜀都美学") {
    notes.push("- 建议在黄昏或夜间拍摄，强化霓虹效果");
    notes.push("- 可使用烟雾机增加氛围感");
  } else if (aestheticStyle === "电影胶片") {
    notes.push("- 建议后期添加胶片颗粒和色偏");
    notes.push("- 可使用变形宽银幕镜头增加电影感");
  }
  
  return notes.join("\n");
}
