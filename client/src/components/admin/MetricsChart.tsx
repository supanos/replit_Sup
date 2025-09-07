import React from 'react';
import { BarChart3, TrendingUp } from 'lucide-react';

interface MetricsChartProps {
  title: string;
  subtitle?: string;
  data: Array<{
    label: string;
    value: number;
    color?: string;
  }>;
  type?: 'bar' | 'line';
  className?: string;
}

export default function MetricsChart({ 
  title, 
  subtitle, 
  data, 
  type = 'bar', 
  className 
}: MetricsChartProps) {
  const maxValue = Math.max(...data.map(item => item.value));
  
  return (
    <div className={`bg-white rounded-2xl shadow-sm border border-slate-200 ${className || ''}`}>
      <div className="p-6 border-b border-slate-100">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-slate-900 flex items-center">
              <BarChart3 className="h-5 w-5 mr-2 text-slate-700" />
              {title}
            </h3>
            {subtitle && (
              <p className="text-sm text-slate-500 mt-1">{subtitle}</p>
            )}
          </div>
          <div className="flex items-center space-x-2 bg-emerald-50 px-3 py-1 rounded-full">
            <TrendingUp className="h-4 w-4 text-emerald-600" />
            <span className="text-sm font-medium text-emerald-700">+12.5%</span>
          </div>
        </div>
      </div>
      
      <div className="p-6">
        {type === 'bar' && (
          <div className="space-y-4">
            {data.map((item, index) => (
              <div key={index} className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-slate-700">{item.label}</span>
                  <span className="text-sm font-bold text-slate-900">{item.value}</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden">
                  <div 
                    className={`h-full rounded-full transition-all duration-1000 ease-out ${
                      item.color || 'bg-gradient-to-r from-blue-400 to-blue-600'
                    }`}
                    style={{ 
                      width: `${(item.value / maxValue) * 100}%`,
                      background: item.color || 'linear-gradient(90deg, #60a5fa 0%, #2563eb 100%)'
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        )}
        
        {type === 'line' && (
          <div className="h-32 flex items-end space-x-2">
            {data.map((item, index) => (
              <div key={index} className="flex-1 flex flex-col items-center space-y-2">
                <div 
                  className="w-full bg-gradient-to-t from-blue-400 to-blue-600 rounded-t-lg transition-all duration-1000 ease-out"
                  style={{ 
                    height: `${(item.value / maxValue) * 100}%`,
                    minHeight: '8px'
                  }}
                />
                <span className="text-xs text-slate-500 font-medium">{item.label}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}