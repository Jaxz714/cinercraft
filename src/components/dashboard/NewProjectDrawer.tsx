import { useState } from 'react';
import { X, Plus, Loader2 } from 'lucide-react';

interface NewProjectDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (title: string, description?: string) => Promise<void>;
}

export function NewProjectDrawer({ isOpen, onClose, onSubmit }: NewProjectDrawerProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!title.trim()) {
      setError('请输入项目名称');
      return;
    }
    
    setIsLoading(true);
    
    try {
      await onSubmit(title.trim(), description.trim() || undefined);
      setTitle('');
      setDescription('');
      onClose();
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleClose = () => {
    setTitle('');
    setDescription('');
    setError('');
    onClose();
  };
  
  if (!isOpen) return null;
  
  return (
    <>
      <div 
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
        onClick={handleClose}
      />
      
      <div className="fixed right-0 top-0 h-full w-full max-w-md bg-dark-50 border-l border-dark-100 z-50 animate-slide-in-right">
        <div className="h-full flex flex-col">
          <div className="h-16 flex items-center justify-between px-6 border-b border-dark-100">
            <h2 className="text-xl font-display font-bold text-white">新建项目</h2>
            <button
              onClick={handleClose}
              className="p-2 rounded-lg hover:bg-dark-100 transition-colors text-dark-300 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          
          <form onSubmit={handleSubmit} className="flex-1 p-6 space-y-6">
            <div>
              <label className="block text-sm font-medium text-dark-300 mb-2">
                项目名称 <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="input-field"
                placeholder="输入项目名称..."
                maxLength={100}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-dark-300 mb-2">
                项目描述
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="input-field min-h-[120px] resize-none"
                placeholder="简单描述这个项目的创意方向..."
                maxLength={500}
              />
              <p className="text-xs text-dark-400 mt-1">{description.length}/500</p>
            </div>
            
            {error && (
              <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
                {error}
              </div>
            )}
            
            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={handleClose}
                className="btn-secondary flex-1"
              >
                取消
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="btn-primary flex-1 flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    创建中...
                  </>
                ) : (
                  <>
                    <Plus className="w-5 h-5" />
                    创建项目
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
