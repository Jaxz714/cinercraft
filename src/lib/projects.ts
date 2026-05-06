import { supabase } from '../lib/supabase';
import type { Project, CreateProjectInput } from '../types';

const isDemoMode = () => {
  const url = import.meta.env.VITE_SUPABASE_URL || '';
  return url.includes('your-project-id') || url === '';
};

const DEMO_PROJECTS: Project[] = [
  {
    id: 'demo-project-1',
    user_id: 'demo-user-id',
    title: '城市夜景短片',
    description: '赛博朋克风格的城市夜景拍摄计划',
    created_at: '2024-01-15T10:30:00Z',
    updated_at: '2024-01-15T10:30:00Z',
  },
  {
    id: 'demo-project-2',
    user_id: 'demo-user-id',
    title: '自然风光纪录片',
    description: '延时摄影展示大自然的壮美',
    created_at: '2024-01-14T08:15:00Z',
    updated_at: '2024-01-14T08:15:00Z',
  },
  {
    id: 'demo-project-3',
    user_id: 'demo-user-id',
    title: '产品宣传片',
    description: '科技产品的专业视觉呈现',
    created_at: '2024-01-13T14:45:00Z',
    updated_at: '2024-01-13T14:45:00Z',
  },
];

let demoProjectIdCounter = 4;

export async function getProjects(): Promise<Project[]> {
  if (isDemoMode()) {
    return [...DEMO_PROJECTS];
  }
  
  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .order('updated_at', { ascending: false });
  
  if (error) throw error;
  return data || [];
}

export async function getProject(id: string): Promise<Project | null> {
  if (isDemoMode()) {
    return DEMO_PROJECTS.find((p) => p.id === id) || null;
  }
  
  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .eq('id', id)
    .single();
  
  if (error) throw error;
  return data;
}

export async function createProject(input: CreateProjectInput): Promise<Project> {
  if (isDemoMode()) {
    const newProject: Project = {
      id: `demo-project-${demoProjectIdCounter++}`,
      user_id: 'demo-user-id',
      title: input.title,
      description: input.description,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    DEMO_PROJECTS.push(newProject);
    return newProject;
  }
  
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) throw new Error('User not authenticated');
  
  const { data, error } = await supabase
    .from('projects')
    .insert({
      ...input,
      user_id: user.id,
    })
    .select()
    .single();
  
  if (error) throw error;
  return data;
}

export async function updateProject(id: string, input: Partial<CreateProjectInput>): Promise<Project> {
  if (isDemoMode()) {
    const index = DEMO_PROJECTS.findIndex((p) => p.id === id);
    if (index !== -1) {
      DEMO_PROJECTS[index] = {
        ...DEMO_PROJECTS[index],
        ...input,
        updated_at: new Date().toISOString(),
      };
      return DEMO_PROJECTS[index];
    }
    throw new Error('Project not found');
  }
  
  const { data, error } = await supabase
    .from('projects')
    .update(input)
    .eq('id', id)
    .select()
    .single();
  
  if (error) throw error;
  return data;
}

export async function deleteProject(id: string): Promise<void> {
  if (isDemoMode()) {
    const index = DEMO_PROJECTS.findIndex((p) => p.id === id);
    if (index !== -1) {
      DEMO_PROJECTS.splice(index, 1);
    }
    return;
  }
  
  const { error } = await supabase
    .from('projects')
    .delete()
    .eq('id', id);
  
  if (error) throw error;
}
