import { useNavigate } from 'react-router-dom';
import { Calendar, MoreVertical, Trash2 } from 'lucide-react';
import type { Project } from '../../types';
import { useState } from 'react';

interface ProjectCardProps {
  project: Project;
  onDelete: (id: string) => void;
}

export function ProjectCard({ project, onDelete }: ProjectCardProps) {
  const navigate = useNavigate();
  const [showMenu, setShowMenu] = useState(false);
  
  const handleClick = () => {
    navigate(`/project/${project.id}`);
  };
  
  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDelete(project.id);
    setShowMenu(false);
  };
  
  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };
  
  return (
    <div 
      className="project-card group"
      onClick={handleClick}
    >
      <div className="aspect-video bg-dark-100 relative overflow-hidden">
        {project.thumbnail_url ? (
          <img 
            src={project.thumbnail_url} 
            alt={project.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-dark-100 to-dark">
            <svg className="w-16 h-16 text-dark-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
          </div>
        )}
        
        <div className="absolute inset-0 bg-gradient-to-t from-dark via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
        
        <button
          onClick={(e) => {
            e.stopPropagation();
            setShowMenu(!showMenu);
          }}
          className="absolute top-3 right-3 p-2 rounded-lg bg-dark/80 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-dark"
        >
          <MoreVertical className="w-4 h-4 text-white" />
        </button>
        
        {showMenu && (
          <div 
            className="absolute top-12 right-3 w-40 py-2 rounded-lg bg-dark-50 border border-dark-100 shadow-xl z-10"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={handleDelete}
              className="w-full px-4 py-2 text-left text-sm text-red-400 hover:bg-red-500/10 flex items-center gap-2"
            >
              <Trash2 className="w-4 h-4" />
              删除项目
            </button>
          </div>
        )}
      </div>
      
      <div className="p-4">
        <h3 className="font-semibold text-white mb-2 truncate">{project.title}</h3>
        {project.description && (
          <p className="text-sm text-dark-300 line-clamp-2 mb-3">{project.description}</p>
        )}
        <div className="flex items-center gap-2 text-xs text-dark-400">
          <Calendar className="w-3.5 h-3.5" />
          {formatDate(project.created_at)}
        </div>
      </div>
    </div>
  );
}
