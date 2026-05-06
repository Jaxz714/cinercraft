import { NavLink, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  FolderOpen, 
  Settings, 
  LogOut, 
  ChevronLeft,
  ChevronRight,
  Film
} from 'lucide-react';
import { useAuthStore } from '../../hooks/useAuth';
import { useState } from 'react';

export function Sidebar() {
  const navigate = useNavigate();
  const { user, signOut } = useAuthStore();
  const [collapsed, setCollapsed] = useState(false);
  
  const handleSignOut = async () => {
    await signOut();
    navigate('/login');
  };
  
  const navItems = [
    { to: '/dashboard', icon: LayoutDashboard, label: '工作台' },
    { to: '/projects', icon: FolderOpen, label: '项目列表' },
  ];
  
  return (
    <aside 
      className={`
        fixed left-0 top-0 h-full bg-dark-50 border-r border-dark-100 
        flex flex-col transition-all duration-300 z-50
        ${collapsed ? 'w-20' : 'w-64'}
      `}
    >
      <div className="h-16 flex items-center justify-between px-4 border-b border-dark-100">
        {!collapsed && (
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center">
              <Film className="w-5 h-5 text-dark" />
            </div>
            <span className="text-xl font-display font-bold text-white">CineCraft</span>
          </div>
        )}
        
        {collapsed && (
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center mx-auto">
            <Film className="w-5 h-5 text-dark" />
          </div>
        )}
        
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="absolute -right-3 top-20 w-6 h-6 rounded-full bg-dark-100 border border-dark-200 
                     flex items-center justify-center text-dark-300 hover:text-white transition-colors"
        >
          {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>
      
      <nav className="flex-1 py-4 px-3 space-y-1">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) => `
              sidebar-link ${isActive ? 'active' : ''}
              ${collapsed ? 'justify-center px-0' : ''}
            `}
          >
            <item.icon className="w-5 h-5 flex-shrink-0" />
            {!collapsed && <span>{item.label}</span>}
          </NavLink>
        ))}
      </nav>
      
      <div className="p-3 border-t border-dark-100">
        {!collapsed && user && (
          <div className="mb-3 px-3 py-2 rounded-lg bg-dark/50">
            <p className="text-sm text-dark-300 truncate">{user.email}</p>
          </div>
        )}
        
        <button
          onClick={handleSignOut}
          className={`
            sidebar-link w-full text-red-400 hover:text-red-300 hover:bg-red-500/10
            ${collapsed ? 'justify-center px-0' : ''}
          `}
        >
          <LogOut className="w-5 h-5 flex-shrink-0" />
          {!collapsed && <span>退出登录</span>}
        </button>
      </div>
    </aside>
  );
}
