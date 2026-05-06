import { useEffect, useState } from 'react';
import { Plus, Search, Filter, Loader2 } from 'lucide-react';
import { Sidebar } from '../components/dashboard/Sidebar';
import { StatsPanel } from '../components/dashboard/StatsPanel';
import { ProjectCard } from '../components/dashboard/ProjectCard';
import { NewProjectDrawer } from '../components/dashboard/NewProjectDrawer';
import { useProjectStore } from '../hooks/useProjectStore';

export function DashboardPage() {
  const { 
    projects, 
    storyboards, 
    isLoading, 
    fetchProjects, 
    fetchStoryboards,
    addProject, 
    removeProject 
  } = useProjectStore();
  
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);
  
  useEffect(() => {
    projects.forEach((project) => {
      fetchStoryboards(project.id);
    });
  }, [projects, fetchStoryboards]);
  
  const totalStoryboards = storyboards.length;
  
  const filteredProjects = projects.filter((project) =>
    project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    project.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  const handleCreateProject = async (title: string, description?: string) => {
    await addProject(title, description);
  };
  
  const handleDeleteProject = async (id: string) => {
    if (confirm('确定要删除这个项目吗？此操作不可恢复。')) {
      await removeProject(id);
    }
  };
  
  return (
    <div className="min-h-screen bg-dark">
      <Sidebar />
      
      <main className="ml-64 min-h-screen">
        <div className="p-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-display font-bold text-white mb-2">工作台</h1>
              <p className="text-dark-300">管理您的视听策划项目</p>
            </div>
            
            <button
              onClick={() => setIsDrawerOpen(true)}
              className="btn-primary flex items-center gap-2"
            >
              <Plus className="w-5 h-5" />
              新建项目
            </button>
          </div>
          
          <StatsPanel projectCount={projects.length} storyboardCount={totalStoryboards} />
          
          <div className="mb-6 flex items-center gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-dark-300" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="input-field pl-12"
                placeholder="搜索项目..."
              />
            </div>
            
            <button className="btn-secondary flex items-center gap-2">
              <Filter className="w-5 h-5" />
              筛选
            </button>
          </div>
          
          {isLoading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="w-8 h-8 text-primary animate-spin" />
            </div>
          ) : filteredProjects.length === 0 ? (
            <div className="text-center py-20">
              <div className="w-20 h-20 rounded-full bg-dark-50 flex items-center justify-center mx-auto mb-4">
                <svg className="w-10 h-10 text-dark-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">
                {searchQuery ? '未找到匹配的项目' : '还没有项目'}
              </h3>
              <p className="text-dark-300 mb-6">
                {searchQuery ? '尝试其他搜索关键词' : '创建您的第一个视听策划项目'}
              </p>
              {!searchQuery && (
                <button
                  onClick={() => setIsDrawerOpen(true)}
                  className="btn-primary inline-flex items-center gap-2"
                >
                  <Plus className="w-5 h-5" />
                  新建项目
                </button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredProjects.map((project) => (
                <ProjectCard
                  key={project.id}
                  project={project}
                  onDelete={handleDeleteProject}
                />
              ))}
            </div>
          )}
        </div>
      </main>
      
      <NewProjectDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        onSubmit={handleCreateProject}
      />
    </div>
  );
}
