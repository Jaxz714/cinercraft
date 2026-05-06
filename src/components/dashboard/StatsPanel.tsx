import { Film, Clock, Sparkles, TrendingUp } from 'lucide-react';

interface StatCardProps {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  trend?: string;
  color: 'primary' | 'accent' | 'green' | 'purple';
}

function StatCard({ icon, label, value, trend, color }: StatCardProps) {
  const colorClasses = {
    primary: 'from-primary/20 to-primary/5 border-primary/20',
    accent: 'from-accent/20 to-accent/5 border-accent/20',
    green: 'from-green-500/20 to-green-500/5 border-green-500/20',
    purple: 'from-purple-500/20 to-purple-500/5 border-purple-500/20',
  };
  
  const iconColorClasses = {
    primary: 'text-primary',
    accent: 'text-accent',
    green: 'text-green-400',
    purple: 'text-purple-400',
  };
  
  return (
    <div className={`stat-card bg-gradient-to-br ${colorClasses[color]} relative overflow-hidden`}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-dark-300 text-sm mb-1">{label}</p>
          <p className="text-3xl font-display font-bold text-white">{value}</p>
          {trend && (
            <p className="text-sm text-green-400 mt-2 flex items-center gap-1">
              <TrendingUp className="w-4 h-4" />
              {trend}
            </p>
          )}
        </div>
        <div className={`p-3 rounded-xl bg-dark/50 ${iconColorClasses[color]}`}>
          {icon}
        </div>
      </div>
    </div>
  );
}

interface StatsPanelProps {
  projectCount: number;
  storyboardCount: number;
}

export function StatsPanel({ projectCount, storyboardCount }: StatsPanelProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      <StatCard
        icon={<Film className="w-6 h-6" />}
        label="项目总数"
        value={projectCount}
        color="primary"
      />
      <StatCard
        icon={<Sparkles className="w-6 h-6" />}
        label="生成镜头数"
        value={storyboardCount}
        trend="+12 本周"
        color="accent"
      />
      <StatCard
        icon={<Clock className="w-6 h-6" />}
        label="创作时长"
        value="48h"
        color="purple"
      />
      <StatCard
        icon={<TrendingUp className="w-6 h-6" />}
        label="效率提升"
        value="85%"
        trend="+23%"
        color="green"
      />
    </div>
  );
}
