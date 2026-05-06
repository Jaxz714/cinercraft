import { useState } from 'react';
import { ChevronDown, Info, X, Plus } from 'lucide-react';
import type { CameraMoveType, AestheticStyleType, CameraMoveType as CameraMove, AestheticStyleType as AestheticStyle } from '../../types';
import { CAMERA_MOVE_OPTIONS, AESTHETIC_STYLE_OPTIONS } from '../../types';

interface ParamPanelProps {
  sceneDesc: string;
  setSceneDesc: (value: string) => void;
  cameraMove: CameraMoveType;
  setCameraMove: (value: CameraMoveType) => void;
  aestheticStyle: AestheticStyleType;
  setAestheticStyle: (value: AestheticStyleType) => void;
  subjectTags: string[];
  setSubjectTags: (value: string[]) => void;
  onGenerate: () => void;
  isLoading: boolean;
}

function SelectField({ 
  label, 
  value, 
  onChange, 
  options,
  placeholder 
}: { 
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: { value: string; label: string; description: string }[];
  placeholder: string;
}) {
  const [isOpen, setIsOpen] = useState(false);
  
  const selectedOption = options.find((o) => o.value === value);
  
  return (
    <div className="relative">
      <label className="block text-sm font-medium text-dark-300 mb-2">{label}</label>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="input-field text-left flex items-center justify-between"
      >
        <span className={selectedOption ? 'text-white' : 'text-dark-300'}>
          {selectedOption?.label || placeholder}
        </span>
        <ChevronDown className={`w-5 h-5 text-dark-300 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      
      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-2 py-2 rounded-lg bg-dark-50 border border-dark-100 shadow-xl z-10 max-h-64 overflow-y-auto scrollbar-thin">
          {options.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => {
                onChange(option.value);
                setIsOpen(false);
              }}
              className={`w-full px-4 py-3 text-left hover:bg-dark-100 transition-colors ${
                value === option.value ? 'bg-primary/10 text-primary' : 'text-white'
              }`}
            >
              <div className="font-medium">{option.label}</div>
              <div className="text-xs text-dark-300 mt-0.5">{option.description}</div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function TagInput({
  label,
  value,
  onChange,
  placeholder,
  suggestions,
}: {
  label: string;
  value: string[];
  onChange: (value: string[]) => void;
  placeholder: string;
  suggestions?: string[];
}) {
  const [inputValue, setInputValue] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  
  const filteredSuggestions = suggestions?.filter(
    (s) => s.toLowerCase().includes(inputValue.toLowerCase()) && !value.includes(s)
  );
  
  const handleAddTag = (tag: string) => {
    if (tag.trim() && !value.includes(tag.trim())) {
      onChange([...value, tag.trim()]);
      setInputValue('');
    }
  };
  
  const handleRemoveTag = (tag: string) => {
    onChange(value.filter((t) => t !== tag));
  };
  
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddTag(inputValue);
    }
  };
  
  return (
    <div>
      <label className="block text-sm font-medium text-dark-300 mb-2">{label}</label>
      <div className="input-field p-2 flex flex-wrap gap-2 min-h-[48px]">
        {value.map((tag) => (
          <span key={tag} className="tag active flex items-center gap-1">
            {tag}
            <button
              type="button"
              onClick={() => handleRemoveTag(tag)}
              className="hover:text-white"
            >
              <X className="w-3 h-3" />
            </button>
          </span>
        ))}
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => setShowSuggestions(true)}
          onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
          className="flex-1 min-w-[120px] bg-transparent border-none outline-none text-white placeholder-dark-300"
          placeholder={value.length === 0 ? placeholder : '添加更多...'}
        />
      </div>
      
      {showSuggestions && filteredSuggestions && filteredSuggestions.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-2">
          {filteredSuggestions.slice(0, 6).map((suggestion) => (
            <button
              key={suggestion}
              type="button"
              onClick={() => handleAddTag(suggestion)}
              className="tag hover:border-primary/30 hover:text-primary transition-colors"
            >
              <Plus className="w-3 h-3 mr-1" />
              {suggestion}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export function ParamPanel({
  sceneDesc,
  setSceneDesc,
  cameraMove,
  setCameraMove,
  aestheticStyle,
  setAestheticStyle,
  subjectTags,
  setSubjectTags,
  onGenerate,
  isLoading,
}: ParamPanelProps) {
  const subjectSuggestions = [
    '4K超高清转播车',
    '大型广电地标建筑',
    '无人机编队',
    '城市天际线',
    '霓虹灯牌',
    '雨中街道',
    '高速列车',
    '古建筑',
    '现代摩天楼',
    '人群',
    '车辆',
    '自然景观',
  ];
  
  return (
    <div className="h-full flex flex-col">
      <div className="p-6 border-b border-dark-100">
        <h2 className="text-xl font-display font-bold text-white flex items-center gap-2">
          参数配置
          <Info className="w-4 h-4 text-dark-300" />
        </h2>
        <p className="text-sm text-dark-300 mt-1">配置您的镜头参数，AI 将生成专业提示词</p>
      </div>
      
      <div className="flex-1 p-6 space-y-6 overflow-y-auto scrollbar-thin">
        <div>
          <label className="block text-sm font-medium text-dark-300 mb-2">
            场景描述 <span className="text-red-400">*</span>
          </label>
          <textarea
            value={sceneDesc}
            onChange={(e) => setSceneDesc(e.target.value)}
            className="input-field min-h-[120px] resize-none"
            placeholder="描述您想要的画面场景，例如：大雨中的城市夜景，霓虹灯倒映在湿漉漉的街道上..."
            maxLength={500}
          />
          <p className="text-xs text-dark-400 mt-1">{sceneDesc.length}/500</p>
        </div>
        
        <SelectField
          label="运镜模式"
          value={cameraMove}
          onChange={(v) => setCameraMove(v as CameraMove)}
          options={CAMERA_MOVE_OPTIONS}
          placeholder="选择运镜方式"
        />
        
        <SelectField
          label="美学风格"
          value={aestheticStyle}
          onChange={(v) => setAestheticStyle(v as AestheticStyle)}
          options={AESTHETIC_STYLE_OPTIONS}
          placeholder="选择美学风格"
        />
        
        <TagInput
          label="主体标签"
          value={subjectTags}
          onChange={setSubjectTags}
          placeholder="输入主体元素..."
          suggestions={subjectSuggestions}
        />
      </div>
      
      <div className="p-6 border-t border-dark-100">
        <button
          onClick={onGenerate}
          disabled={isLoading || !sceneDesc.trim()}
          className="btn-primary w-full flex items-center justify-center gap-2"
        >
          {isLoading ? (
            <>
              <svg className="w-5 h-5 animate-spin" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              生成中...
            </>
          ) : (
            <>
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              生成镜头指令
            </>
          )}
        </button>
      </div>
    </div>
  );
}
