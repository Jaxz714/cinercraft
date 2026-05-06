import { useState } from 'react';
import { Mail, Lock, Eye, EyeOff, Loader2 } from 'lucide-react';
import { signIn, signUp, setDemoUser, clearDemoUser, DEMO_USER } from '../../lib/auth';
import { useAuthStore } from '../../hooks/useAuth';

export function LoginForm() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  
  const setUser = useAuthStore((state) => state.setUser);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!email || !password) {
      setError('请填写所有必填项');
      return;
    }
    
    if (!isLogin && password !== confirmPassword) {
      setError('两次输入的密码不一致');
      return;
    }
    
    if (password.length < 6) {
      setError('密码长度至少为 6 位');
      return;
    }
    
    setIsLoading(true);
    
    try {
      if (isLogin) {
        const { user } = await signIn(email, password);
        if (user) {
          const userData = {
            id: user.id,
            email: user.email || '',
            created_at: user.created_at,
          };
          setDemoUser(userData);
          setUser(userData);
        }
      } else {
        const { user } = await signUp(email, password);
        if (user) {
          const userData = {
            id: user.id,
            email: user.email || '',
            created_at: user.created_at,
          };
          setDemoUser(userData);
          setUser(userData);
        }
      }
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleDemoLogin = async () => {
    setIsLoading(true);
    try {
      await signIn(DEMO_USER.email, 'demo1234');
      setDemoUser(DEMO_USER);
      setUser(DEMO_USER);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="w-full max-w-md">
      <div className="glass-card rounded-2xl p-8">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold font-display text-white mb-2">
            {isLogin ? '欢迎回来' : '创建账户'}
          </h2>
          <p className="text-dark-300">
            {isLogin ? '登录您的 CineCraft 账户' : '注册开始您的创作之旅'}
          </p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-dark-300 mb-2">
              邮箱地址
            </label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-dark-300" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input-field pl-12"
                placeholder="your@email.com"
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-dark-300 mb-2">
              密码
            </label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-dark-300" />
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input-field pl-12 pr-12"
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-dark-300 hover:text-white transition-colors"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>
          
          {!isLogin && (
            <div>
              <label className="block text-sm font-medium text-dark-300 mb-2">
                确认密码
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-dark-300" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="input-field pl-12"
                  placeholder="••••••••"
                />
              </div>
            </div>
          )}
          
          {error && (
            <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
              {error}
            </div>
          )}
          
          <button
            type="submit"
            disabled={isLoading}
            className="btn-primary w-full flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                处理中...
              </>
            ) : (
              isLogin ? '登录' : '注册'
            )}
          </button>
        </form>
        
        <div className="my-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-dark-100"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-dark-50 text-dark-300">或</span>
            </div>
          </div>
        </div>
        
        <button
          onClick={handleDemoLogin}
          disabled={isLoading}
          className="btn-secondary w-full flex items-center justify-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          快速体验演示模式
        </button>
        
        <div className="mt-6 text-center">
          <p className="text-dark-300">
            {isLogin ? '还没有账户？' : '已有账户？'}
            <button
              onClick={() => {
                setIsLogin(!isLogin);
                setError('');
                setConfirmPassword('');
              }}
              className="ml-2 text-primary hover:text-primary-400 transition-colors font-medium"
            >
              {isLogin ? '立即注册' : '立即登录'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
