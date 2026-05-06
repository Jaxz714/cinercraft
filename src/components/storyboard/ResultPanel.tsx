import { useState, useEffect } from 'react';
import { Copy, Check, Download, Save, Sparkles } from 'lucide-react';
import { generateDirectorNotes } from '../../lib/promptGenerator';
import type { CameraMoveType, AestheticStyleType } from '../../types';

interface ResultPanelProps {
  prompt: string;
  sceneDesc: string;
  cameraMove: CameraMoveType;
  aestheticStyle: AestheticStyleType;
  onSave: () => void;
  isSaving: boolean;
}

export function ResultPanel({
  prompt,
  sceneDesc,
  cameraMove,
  aestheticStyle,
  onSave,
  isSaving,
}: ResultPanelProps) {
  const [copied, setCopied] = useState(false);
  const [displayedPrompt, setDisplayedPrompt] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  
  useEffect(() => {
    if (prompt) {
      setIsTyping(true);
      setDisplayedPrompt('');
      
      let index = 0;
      const interval = setInterval(() => {
        if (index < prompt.length) {
          setDisplayedPrompt(prompt.slice(0, index + 1));
          index++;
        } else {
          setIsTyping(false);
          clearInterval(interval);
        }
      }, 10);
      
      return () => clearInterval(interval);
    }
  }, [prompt]);
  
  const handleCopy = async () => {
    await navigator.clipboard.writeText(prompt);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  
  const handleDownload = () => {
    const notes = generateDirectorNotes(sceneDesc, cameraMove, aestheticStyle);
    const content = `# CineCraft 镜头指令\n\n## AI 生成提示词\n\n${prompt}\n\n${notes}`;
    
    const blob = new Blob([content], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `cinecraft-prompt-${Date.now()}.md`;
    a.click();
    URL.revokeObjectURL(url);
  };
  
  const directorNotes = prompt ? generateDirectorNotes(sceneDesc, cameraMove, aestheticStyle) : '';
  
  return (
    <div className="h-full flex flex-col">
      <div className="p-6 border-b border-dark-100">
        <h2 className="text-xl font-display font-bold text-white flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-primary" />
          生成结果
        </h2>
        <p className="text-sm text-dark-300 mt-1">AI 生成的专业镜头指令</p>
      </div>
      
      <div className="flex-1 overflow-y-auto scrollbar-thin">
        {!prompt ? (
          <div className="h-full flex items-center justify-center p-6">
            <div className="text-center">
              <div className="w-20 h-20 rounded-full bg-dark-50 flex items-center justify-center mx-auto mb-4">
                <svg className="w-10 h-10 text-dark-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">等待生成</h3>
              <p className="text-dark-300">配置左侧参数后点击"生成镜头指令"</p>
            </div>
          </div>
        ) : (
          <div className="p-6 space-y-6">
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-medium text-dark-300">AI 提示词</h3>
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleCopy}
                    className="p-2 rounded-lg hover:bg-dark-100 transition-colors text-dark-300 hover:text-white"
                    title="复制"
                  >
                    {copied ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
                  </button>
                  <button
                    onClick={handleDownload}
                    className="p-2 rounded-lg hover:bg-dark-100 transition-colors text-dark-300 hover:text-white"
                    title="下载"
                  >
                    <Download className="w-4 h-4" />
                  </button>
                </div>
              </div>
              
              <div className="relative">
                <div className="absolute top-3 left-3 text-xs text-dark-400 font-mono">PROMPT</div>
                <div className="p-4 pt-8 rounded-xl bg-dark-50 border border-dark-100 font-mono text-sm text-dark-200 leading-relaxed">
                  {displayedPrompt}
                  {isTyping && <span className="animate-pulse text-primary">|</span>}
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="text-sm font-medium text-dark-300 mb-3">导演视角笔记</h3>
              <div className="p-4 rounded-xl bg-dark-50 border border-dark-100 text-sm text-dark-200 whitespace-pre-wrap leading-relaxed">
                {directorNotes}
              </div>
            </div>
            
            <div className="pt-4 border-t border-dark-100">
              <button
                onClick={onSave}
                disabled={isSaving}
                className="btn-secondary w-full flex items-center justify-center gap-2"
              >
                {isSaving ? (
                  <>
                    <svg className="w-5 h-5 animate-spin" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    保存中...
                  </>
                ) : (
                  <>
                    <Save className="w-5 h-5" />
                    保存到项目
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
