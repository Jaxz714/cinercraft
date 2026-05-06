import { Clock, Trash2 } from 'lucide-react';
import type { Storyboard } from '../../types';

interface StoryboardListProps {
  storyboards: Storyboard[];
  onSelect: (storyboard: Storyboard) => void;
  onDelete: (id: string) => void;
  selectedId?: string;
}

export function StoryboardList({
  storyboards,
  onSelect,
  onDelete,
  selectedId,
}: StoryboardListProps) {
  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('zh-CN', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };
  
  if (storyboards.length === 0) {
    return (
      <div className="p-4 text-center text-dark-300 text-sm">
        暂无保存的分镜
      </div>
    );
  }
  
  return (
    <div className="space-y-2">
      {storyboards.map((storyboard) => (
        <div
          key={storyboard.id}
          onClick={() => onSelect(storyboard)}
          className={`p-3 rounded-lg cursor-pointer transition-all ${
            selectedId === storyboard.id
              ? 'bg-primary/10 border border-primary/30'
              : 'bg-dark-50 border border-dark-100 hover:border-dark-200'
          }`}
        >
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1 min-w-0">
              <p className="text-sm text-white truncate font-medium">
                {storyboard.scene_desc.slice(0, 50)}...
              </p>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-xs text-dark-300">{storyboard.camera_move}</span>
                <span className="text-xs text-dark-400">•</span>
                <span className="text-xs text-dark-300">{storyboard.aesthetic_style}</span>
              </div>
              <div className="flex items-center gap-1 mt-2 text-xs text-dark-400">
                <Clock className="w-3 h-3" />
                {formatDate(storyboard.created_at)}
              </div>
            </div>
            
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDelete(storyboard.id);
              }}
              className="p-1.5 rounded hover:bg-red-500/10 text-dark-300 hover:text-red-400 transition-colors"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
