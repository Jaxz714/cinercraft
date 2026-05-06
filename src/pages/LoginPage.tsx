import { LoginForm } from '../components/auth/LoginForm';

export function LoginPage() {
  return (
    <div className="min-h-screen flex">
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=1920&q=80')`,
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-dark via-dark/80 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-dark via-transparent to-dark/50" />
        
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute w-96 h-96 bg-primary/20 rounded-full blur-3xl -top-48 -left-48 animate-float" />
          <div className="absolute w-64 h-64 bg-accent/20 rounded-full blur-3xl bottom-20 right-20 animate-float" style={{ animationDelay: '2s' }} />
        </div>
        
        <div className="relative z-10 flex flex-col justify-center px-16">
          <div className="animate-fade-in">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                <svg className="w-7 h-7 text-dark" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
              </div>
              <span className="text-3xl font-display font-bold text-white">CineCraft</span>
            </div>
            
            <h1 className="text-5xl font-display font-bold text-white mb-6 leading-tight">
              智能视听<br />
              <span className="text-gradient">策划引擎</span>
            </h1>
            
            <p className="text-xl text-dark-300 mb-8 max-w-md">
              将模糊的画面创意转化为专业的摄影机运动指令和视觉分镜
            </p>
            
            <div className="flex flex-wrap gap-3">
              <span className="tag">FPV 航拍</span>
              <span className="tag">赛博美学</span>
              <span className="tag">专业运镜</span>
              <span className="tag">AI 生成</span>
            </div>
          </div>
        </div>
        
        <div className="absolute bottom-8 left-16 text-dark-300 text-sm">
          © 2024 CineCraft. 专业视听策划工具
        </div>
      </div>
      
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-dark">
        <div className="w-full max-w-md">
          <div className="lg:hidden text-center mb-8">
            <div className="inline-flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                <svg className="w-6 h-6 text-dark" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
              </div>
              <span className="text-2xl font-display font-bold text-white">CineCraft</span>
            </div>
          </div>
          
          <LoginForm />
        </div>
      </div>
    </div>
  );
}
