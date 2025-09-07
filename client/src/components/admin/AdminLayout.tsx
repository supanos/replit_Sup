import React, { useState } from 'react';
import { Link, useLocation } from 'wouter';
import { 
  LayoutDashboard, 
  Menu, 
  Calendar, 
  Megaphone, 
  Images,
  Users, 
  Settings, 
  FileText,
  UserCheck,
  ChevronLeft,
  ChevronRight,
  Moon,
  Sun,
  FileEdit,
  LogOut
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useLogout, useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

interface AdminLayoutProps {
  children: React.ReactNode;
}

const sidebarItems = [
  { icon: LayoutDashboard, label: 'Dashboard', href: '/admin', exact: true },
  { icon: Menu, label: 'Menu', href: '/admin/menu' },
  { icon: Calendar, label: 'Events', href: '/admin/events' },
  { icon: FileEdit, label: 'Landing Page', href: '/admin/landing' },
  { icon: Megaphone, label: 'Promotions', href: '/admin/promotions' },
  { icon: Users, label: 'Reservations', href: '/admin/reservations' },
  { icon: Settings, label: 'Settings', href: '/admin/settings' }
];

export default function AdminLayout({ children }: AdminLayoutProps) {
  const [location] = useLocation();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const { user } = useAuth();
  const logoutMutation = useLogout();
  const { toast } = useToast();
  const isActive = (href: string, exact?: boolean) => {
    if (exact) {
      return location === href;
    }
    return location.startsWith(href);
  };

  const getBreadcrumbs = () => {
    const pathSegments = location.split('/').filter(Boolean);
    if (pathSegments.length <= 1) return ['Dashboard'];
    
    return pathSegments.map((segment, index) => {
      if (segment === 'admin') return 'Admin';
      return segment.charAt(0).toUpperCase() + segment.slice(1);
    });
  };

  const handleLogout = async () => {
    try {
      await logoutMutation.mutateAsync();
      toast({
        title: "Logged out",
        description: "You have been successfully logged out",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to logout",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Sidebar */}
      <aside 
        className={cn(
          "fixed left-0 top-0 z-40 h-screen transition-all duration-300 ease-in-out",
          sidebarCollapsed ? "w-16" : "w-64"
        )}
        style={{ background: 'linear-gradient(180deg, #1e293b 0%, #334155 100%)' }}
      >
        <div className="flex h-full flex-col">
          {/* Logo/Brand */}
          <div className="flex h-16 items-center justify-between px-4 border-b border-slate-700">
            {!sidebarCollapsed && (
              <Link href="/admin">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center">
                    <span className="text-white font-bold text-sm">S</span>
                  </div>
                  <h1 className="text-lg font-bold text-white">Supano's</h1>
                </div>
              </Link>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              className="ml-auto hover:bg-slate-700 text-slate-300 hover:text-white"
              data-testid="sidebar-toggle"
            >
              {sidebarCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
            </Button>
          </div>
          
          {/* Navigation */}
          <nav className="flex-1 space-y-2 p-4">
            {sidebarItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.href, item.exact);
              
              return (
                <Link key={item.href} href={item.href}>
                  <div
                    className={cn(
                      "flex items-center rounded-xl px-4 py-3 text-sm font-medium transition-all duration-200 relative group",
                      active 
                        ? "bg-orange-500 text-white shadow-lg" 
                        : "text-slate-300 hover:bg-slate-700 hover:text-white"
                    )}
                    data-testid={`nav-${item.label.toLowerCase().replace(' ', '-')}`}
                  >
                    <Icon className={cn("h-5 w-5", sidebarCollapsed ? "mx-auto" : "mr-3")} />
                    {!sidebarCollapsed && <span>{item.label}</span>}
                    {active && !sidebarCollapsed && (
                      <div className="absolute right-3">
                        <div className="w-2 h-2 bg-white rounded-full opacity-80" />
                      </div>
                    )}
                  </div>
                </Link>
              );
            })}
          </nav>
          
          {/* Footer */}
          <div className="p-4 space-y-4 border-t border-slate-700">
            {!sidebarCollapsed && user && (
              <div className="p-4 rounded-xl bg-slate-800 border border-slate-600">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold">{user.username.charAt(0).toUpperCase()}</span>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-white">{user.username}</p>
                    <p className="text-xs text-slate-400">Administrator</p>
                  </div>
                </div>
              </div>
            )}
            
            <div className="space-y-2">
              {!sidebarCollapsed && (
                <Link href="/">
                  <Button 
                    variant="ghost"
                    className="w-full justify-start text-slate-300 hover:bg-slate-700 hover:text-white" 
                    data-testid="view-site-button"
                  >
                    <Settings className="h-4 w-4 mr-3" />
                    View Site
                  </Button>
                </Link>
              )}
              <Button
                variant="ghost"
                className="w-full justify-start text-slate-300 hover:bg-slate-700 hover:text-white"
                onClick={handleLogout}
                disabled={logoutMutation.isPending}
                data-testid="button-logout"
              >
                <LogOut className="h-4 w-4" />
                {!sidebarCollapsed && <span className="ml-3">Logout</span>}
              </Button>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className={cn("transition-all duration-300 bg-slate-50", sidebarCollapsed ? "ml-16" : "ml-64")}>
        {/* Top Bar */}
        <header className="bg-white border-b border-slate-200 shadow-sm">
          <div className="flex h-16 items-center justify-between px-6">
            {/* Breadcrumbs */}
            <div className="flex items-center space-x-2">
              {getBreadcrumbs().map((crumb, index) => (
                <div key={index} className="flex items-center space-x-2">
                  {index > 0 && <span className="text-slate-400">/</span>}
                  <span 
                    className={cn(
                      "text-sm",
                      index === getBreadcrumbs().length - 1 
                        ? "font-semibold text-slate-900" 
                        : "text-slate-500"
                    )}
                  >
                    {crumb}
                  </span>
                </div>
              ))}
            </div>
            
            {/* Top Actions */}
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full" />
                <span className="text-sm text-slate-600">System Online</span>
              </div>
              {user && (
                <div className="flex items-center space-x-3 px-3 py-1 bg-slate-100 rounded-lg">
                  <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-xs font-bold">{user.username.charAt(0).toUpperCase()}</span>
                  </div>
                  <span className="text-sm font-medium text-slate-700">{user.username}</span>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-6">
          {children}
        </main>
      </div>
    </div>
  );
}