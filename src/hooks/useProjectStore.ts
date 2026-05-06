import { create } from 'zustand';
import type { Project, Storyboard } from '../types';
import { getProjects, createProject, deleteProject } from '../lib/projects';
import { getStoryboards, createStoryboard, deleteStoryboard } from '../lib/storyboards';

interface ProjectState {
  projects: Project[];
  currentProject: Project | null;
  storyboards: Storyboard[];
  isLoading: boolean;
  error: string | null;
  
  fetchProjects: () => Promise<void>;
  setCurrentProject: (project: Project | null) => void;
  addProject: (title: string, description?: string) => Promise<Project>;
  removeProject: (id: string) => Promise<void>;
  
  fetchStoryboards: (projectId: string) => Promise<void>;
  addStoryboard: (input: Parameters<typeof createStoryboard>[0]) => Promise<Storyboard>;
  removeStoryboard: (id: string) => Promise<void>;
  
  setError: (error: string | null) => void;
}

export const useProjectStore = create<ProjectState>((set, get) => ({
  projects: [],
  currentProject: null,
  storyboards: [],
  isLoading: false,
  error: null,
  
  fetchProjects: async () => {
    set({ isLoading: true, error: null });
    try {
      const projects = await getProjects();
      set({ projects, isLoading: false });
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false });
    }
  },
  
  setCurrentProject: (project) => set({ currentProject: project }),
  
  addProject: async (title, description) => {
    const project = await createProject({ title, description });
    set((state) => ({ projects: [project, ...state.projects] }));
    return project;
  },
  
  removeProject: async (id) => {
    await deleteProject(id);
    set((state) => ({
      projects: state.projects.filter((p) => p.id !== id),
      currentProject: state.currentProject?.id === id ? null : state.currentProject,
    }));
  },
  
  fetchStoryboards: async (projectId) => {
    set({ isLoading: true, error: null });
    try {
      const storyboards = await getStoryboards(projectId);
      set({ storyboards, isLoading: false });
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false });
    }
  },
  
  addStoryboard: async (input) => {
    const storyboard = await createStoryboard(input);
    set((state) => ({ storyboards: [storyboard, ...state.storyboards] }));
    return storyboard;
  },
  
  removeStoryboard: async (id) => {
    await deleteStoryboard(id);
    set((state) => ({
      storyboards: state.storyboards.filter((s) => s.id !== id),
    }));
  },
  
  setError: (error) => set({ error }),
}));
