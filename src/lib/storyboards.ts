import { supabase } from '../lib/supabase';
import type { Storyboard, CreateStoryboardInput } from '../types';

const isDemoMode = () => {
  const url = import.meta.env.VITE_SUPABASE_URL || '';
  return url.includes('your-project-id') || url === '';
};

const DEMO_STORYBOARDS: Record<string, Storyboard[]> = {
  'demo-project-1': [
    {
      id: 'demo-storyboard-1',
      project_id: 'demo-project-1',
      scene_desc: '大雨中的城市夜景，霓虹灯倒映在湿漉漉的街道上',
      camera_move: 'FPV穿梭航拍',
      aesthetic_style: '赛博蜀都美学',
      subject_tags: ['霓虹灯牌', '雨中街道', '城市天际线'],
      final_prompt: 'Cinematic shot, 大雨中的城市夜景，霓虹灯倒映在湿漉漉的街道上, FPV drone shot, high-speed穿梭 through the scene, dynamic camera movement, immersive first-person view, Cyber-Shu aesthetic, neon lights reflecting on wet surfaces, traditional architecture meets futuristic holograms, purple and cyan color palette, rain-slicked streets, 霓虹灯牌, 雨中街道, 城市天际线, 8K resolution, ultra HD, professional cinematography, film grain, anamorphic lens flare, color graded',
      created_at: '2024-01-15T11:00:00Z',
    },
    {
      id: 'demo-storyboard-2',
      project_id: 'demo-project-1',
      scene_desc: '高楼林立的都市夜景，无人机从地面升起',
      camera_move: '升降镜头',
      aesthetic_style: '未来科技',
      subject_tags: ['现代摩天楼', '无人机编队'],
      final_prompt: 'Cinematic shot, 高楼林立的都市夜景，无人机从地面升起, crane shot, vertical movement, rising/falling perspective, dramatic reveal, futuristic sci-fi, holographic elements, blue and purple lighting, sleek metallic surfaces, advanced technology, 现代摩天楼, 无人机编队, 8K resolution, ultra HD, professional cinematography, film grain, anamorphic lens flare, color graded',
      created_at: '2024-01-15T11:30:00Z',
    },
  ],
  'demo-project-2': [
    {
      id: 'demo-storyboard-3',
      project_id: 'demo-project-2',
      scene_desc: '山峦云海间的日出，金色阳光穿透云层',
      camera_move: '大范围延时摄影',
      aesthetic_style: '梦幻柔焦',
      subject_tags: ['自然景观', '日出'],
      final_prompt: 'Cinematic shot, 山峦云海间的日出，金色阳光穿透云层, hyperlapse, time-lapse movement, smooth tracking shot, time flowing, dreamy soft focus, lens flare, shallow depth of field, ethereal glow, pastel tones, romantic atmosphere, 自然景观, 日出, 8K resolution, ultra HD, professional cinematography, film grain, anamorphic lens flare, color graded',
      created_at: '2024-01-14T09:00:00Z',
    },
  ],
};

let demoStoryboardIdCounter = 4;

export async function getStoryboards(projectId: string): Promise<Storyboard[]> {
  if (isDemoMode()) {
    return DEMO_STORYBOARDS[projectId] || [];
  }
  
  const { data, error } = await supabase
    .from('storyboards')
    .select('*')
    .eq('project_id', projectId)
    .order('created_at', { ascending: false });
  
  if (error) throw error;
  return data || [];
}

export async function getStoryboard(id: string): Promise<Storyboard | null> {
  if (isDemoMode()) {
    for (const storyboards of Object.values(DEMO_STORYBOARDS)) {
      const found = storyboards.find((s) => s.id === id);
      if (found) return found;
    }
    return null;
  }
  
  const { data, error } = await supabase
    .from('storyboards')
    .select('*')
    .eq('id', id)
    .single();
  
  if (error) throw error;
  return data;
}

export async function createStoryboard(input: CreateStoryboardInput): Promise<Storyboard> {
  if (isDemoMode()) {
    const newStoryboard: Storyboard = {
      id: `demo-storyboard-${demoStoryboardIdCounter++}`,
      ...input,
      created_at: new Date().toISOString(),
    };
    
    if (!DEMO_STORYBOARDS[input.project_id]) {
      DEMO_STORYBOARDS[input.project_id] = [];
    }
    DEMO_STORYBOARDS[input.project_id].unshift(newStoryboard);
    return newStoryboard;
  }
  
  const { data, error } = await supabase
    .from('storyboards')
    .insert(input)
    .select()
    .single();
  
  if (error) throw error;
  return data;
}

export async function updateStoryboard(id: string, input: Partial<CreateStoryboardInput>): Promise<Storyboard> {
  if (isDemoMode()) {
    for (const storyboards of Object.values(DEMO_STORYBOARDS)) {
      const index = storyboards.findIndex((s) => s.id === id);
      if (index !== -1) {
        storyboards[index] = { ...storyboards[index], ...input };
        return storyboards[index];
      }
    }
    throw new Error('Storyboard not found');
  }
  
  const { data, error } = await supabase
    .from('storyboards')
    .update(input)
    .eq('id', id)
    .select()
    .single();
  
  if (error) throw error;
  return data;
}

export async function deleteStoryboard(id: string): Promise<void> {
  if (isDemoMode()) {
    for (const storyboards of Object.values(DEMO_STORYBOARDS)) {
      const index = storyboards.findIndex((s) => s.id === id);
      if (index !== -1) {
        storyboards.splice(index, 1);
        return;
      }
    }
    return;
  }
  
  const { error } = await supabase
    .from('storyboards')
    .delete()
    .eq('id', id);
  
  if (error) throw error;
}
