import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Loader2, History, ChevronRight } from 'lucide-react';
import { Sidebar } from '../components/dashboard/Sidebar';
import { ParamPanel } from '../components/storyboard/ParamPanel';
import { ResultPanel } from '../components/storyboard/ResultPanel';
import { StoryboardList } from '../components/storyboard/StoryboardList';
import { useProjectStore } from '../hooks/useProjectStore';
import { generatePrompt } from '../lib/promptGenerator';
import type { CameraMoveType, AestheticStyleType, Storyboard } from '../types';

export function ProjectPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const {
    currentProject,
    storyboards,
    isLoading,
    fetchProjects,
    setCurrentProject,
    fetchStoryboards,
    addStoryboard,
    removeStoryboard,
  } = useProjectStore();
  
  const [sceneDesc, setSceneDesc] = useState('');
  const [cameraMove, setCameraMove] = useState<CameraMoveType>('推拉摇移');
  const [aestheticStyle, setAestheticStyle] = useState<AestheticStyleType>('赛博蜀都美学');
  const [subjectTags, setSubjectTags] = useState<string[]>([]);
  const [generatedPrompt, setGeneratedPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [selectedStoryboard, setSelectedStoryboard] = useState<Storyboard | undefined>();
  const [showHistory, setShowHistory] = useState(true);
  
  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);
  
  useEffect(() => {
    if (id) {
      fetchStoryboards(id);
    }
  }, [id, fetchStoryboards]);
  
  useEffect(() => {
    const project = useProjectStore.getState().projects.find((p) => p.id === id);
    if (project) {
      setCurrentProject(project);
    }
  }, [id]);
  
  const handleGenerate = () => {
    if (!sceneDesc.trim()) return;
    
    setIsGenerating(true);
    
    setTimeout(() => {
      const prompt = generatePrompt(sceneDesc, cameraMove, aestheticStyle, subjectTags);
      setGeneratedPrompt(prompt);
      setIsGenerating(false);
    }, 800);
  };
  
  const handleSave = async () => {
    if (!id || !generatedPrompt) return;
    
    setIsSaving(true);
    
    try {
      await addStoryboard({
        project_id: id,
        scene_desc: sceneDesc,
        camera_move: cameraMove,
        aesthetic_style: aestheticStyle,
        subject_tags: subjectTags,
        final_prompt: generatedPrompt,
      });
      
      setSceneDesc('');
      setSubjectTags([]);
      setGeneratedPrompt('');
      setSelectedStoryboard(undefined);
    } catch (error) {
      console.error('Failed to save storyboard:', error);
    } finally {
      setIsSaving(false);
    }
  };
  
  const handleSelectStoryboard = (storyboard: Storyboard) => {
    setSelectedStoryboard(storyboard);
    setSceneDesc(storyboard.scene_desc);
    setCameraMove(storyboard.camera_move as CameraMoveType);
    setAestheticStyle(storyboard.aesthetic_style as AestheticStyleType);
    setSubjectTags(storyboard.subject_tags);
    setGeneratedPrompt(storyboard.final_prompt);
  };
  
  const handleDeleteStoryboard = async (storyboardId: string) => {
    if (confirm('确定要删除这个分镜吗？')) {
      await removeStoryboard(storyboardId);
      if (selectedStoryboard?.id === storyboardId) {
        setSelectedStoryboard(undefined);
      }
    }
  };
  
  if (isLoading && !currentProject) {
    return (
      <div className="min-h-screen bg-dark flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-dark">
      <Sidebar />
      
      <main className="ml-64 min-h-screen">
        <div className="h-16 flex items-center justify-between px-6 border-b border-dark-100 bg-dark-50/50 backdrop-blur-sm sticky top-0 z-30">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/dashboard')}
              className="p-2 rounded-lg hover:bg-dark-100 transition-colors text-dark-300 hover:text-white"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            
            <div>
              <h1 className="text-lg font-display font-bold text-white">
                {currentProject?.title || '加载中...'}
              </h1>
              {currentProject?.description && (
                <p className="text-xs text-dark-300">{currentProject.description}</p>
              )}
            </div>
          </div>
          
          <button
            onClick={() => setShowHistory(!showHistory)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
              showHistory ? 'bg-primary/10 text-primary' : 'bg-dark-100 text-dark-300 hover:text-white'
            }`}
          >
            <History className="w-4 h-4" />
            历史记录
            <ChevronRight className={`w-4 h-4 transition-transform ${showHistory ? 'rotate-90' : ''}`} />
          </button>
        </div>
        
        <div className="flex h-[calc(100vh-4rem)]">
          <div className="flex-1 flex">
            <div className="w-[400px] border-r border-dark-100 bg-dark-50/30">
              <ParamPanel
                sceneDesc={sceneDesc}
                setSceneDesc={setSceneDesc}
                cameraMove={cameraMove}
                setCameraMove={setCameraMove}
                aestheticStyle={aestheticStyle}
                setAestheticStyle={setAestheticStyle}
                subjectTags={subjectTags}
                setSubjectTags={setSubjectTags}
                onGenerate={handleGenerate}
                isLoading={isGenerating}
              />
            </div>
            
            <div className="flex-1 bg-dark">
              <ResultPanel
                prompt={generatedPrompt}
                sceneDesc={sceneDesc}
                cameraMove={cameraMove}
                aestheticStyle={aestheticStyle}
                onSave={handleSave}
                isSaving={isSaving}
              />
            </div>
          </div>
          
          {showHistory && (
            <div className="w-80 border-l border-dark-100 bg-dark-50/30 overflow-y-auto scrollbar-thin">
              <div className="p-4 border-b border-dark-100 sticky top-0 bg-dark-50/95 backdrop-blur-sm">
                <h3 className="text-sm font-medium text-dark-300">已保存分镜 ({storyboards.length})</h3>
              </div>
              <div className="p-4">
                <StoryboardList
                  storyboards={storyboards}
                  onSelect={handleSelectStoryboard}
                  onDelete={handleDeleteStoryboard}
                  selectedId={selectedStoryboard?.id}
                />
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
