import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  description?: string;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  progress?: number; // 0-100 for circular progress
  color?: 'blue' | 'green' | 'orange' | 'purple';
  className?: string;
}

const colorSchemes = {
  blue: {
    bg: 'bg-blue-500',
    text: 'text-blue-600',
    light: 'bg-blue-50',
    progress: '#3b82f6'
  },
  green: {
    bg: 'bg-emerald-500',
    text: 'text-emerald-600',
    light: 'bg-emerald-50',
    progress: '#10b981'
  },
  orange: {
    bg: 'bg-orange-500',
    text: 'text-orange-600',
    light: 'bg-orange-50',
    progress: '#f97316'
  },
  purple: {
    bg: 'bg-purple-500',
    text: 'text-purple-600',
    light: 'bg-purple-50',
    progress: '#8b5cf6'
  }
};

export default function StatsCard({ 
  title, 
  value, 
  icon: Icon, 
  description, 
  trend, 
  progress = 0,
  color = 'blue',
  className 
}: StatsCardProps) {
  const scheme = colorSchemes[color];
  const circumference = 2 * Math.PI * 40; // radius 40
  const strokeDasharray = circumference;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <div className={cn("bg-white rounded-2xl p-6 shadow-sm border border-slate-200 hover:shadow-md transition-shadow", className)}>
      <div className="flex items-center justify-between mb-4">
        <div className={cn("p-3 rounded-xl", scheme.light)}>
          <Icon className={cn("h-6 w-6", scheme.text)} />
        </div>
        
        {progress > 0 && (
          <div className="relative w-16 h-16">
            <svg className="w-16 h-16 transform -rotate-90" viewBox="0 0 100 100">
              <circle
                cx="50"
                cy="50"
                r="40"
                stroke="#e5e7eb"
                strokeWidth="8"
                fill="none"
              />
              <circle
                cx="50"
                cy="50"
                r="40"
                stroke={scheme.progress}
                strokeWidth="8"
                fill="none"
                strokeDasharray={strokeDasharray}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                className="transition-all duration-1000 ease-out"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-sm font-bold text-slate-700">{progress}%</span>
            </div>
          </div>
        )}
      </div>
      
      <div className="space-y-1">
        <p className="text-sm font-medium text-slate-600">{title}</p>
        <p className="text-3xl font-bold text-slate-900">{value}</p>
        
        <div className="flex items-center justify-between">
          {description && (
            <p className="text-sm text-slate-500">{description}</p>
          )}
          
          {trend && (
            <div className={cn(
              "text-sm font-semibold flex items-center space-x-1",
              trend.isPositive ? "text-emerald-600" : "text-red-500"
            )}>
              <span>{trend.isPositive ? '↗' : '↘'}</span>
              <span>{trend.isPositive ? '+' : ''}{trend.value}%</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}