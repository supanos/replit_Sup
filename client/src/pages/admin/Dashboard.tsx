import React from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Settings, Menu, Calendar, Users, Megaphone, BarChart3, Clock, DollarSign, FileEdit, Activity, Database, AlertTriangle } from "lucide-react";
import type { Reservation, Event, MenuItem, MenuCategory } from "@shared/schema";
import AdminLayout from "@/components/admin/AdminLayout";
import StatsCard from "@/components/admin/StatsCard";
import MetricsChart from "@/components/admin/MetricsChart";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function AdminDashboard() {
  const { data: reservations, isLoading: reservationsLoading } = useQuery<Reservation[]>({
    queryKey: ['/api/reservations']
  });

  const { data: events, isLoading: eventsLoading } = useQuery<Event[]>({
    queryKey: ['/api/events']
  });

  const { data: menuItems, isLoading: menuLoading } = useQuery<MenuItem[]>({
    queryKey: ['/api/menu/items']
  });

  const { data: categories, isLoading: categoriesLoading } = useQuery<MenuCategory[]>({
    queryKey: ['/api/menu/categories']
  });

  // Get today's reservations
  const today = new Date().toISOString().split('T')[0];
  const todaysReservations = reservations?.filter(r => 
    r.datetime.startsWith(today)
  ) || [];

  // Get upcoming events (next 7 days)
  const nextWeek = new Date();
  nextWeek.setDate(nextWeek.getDate() + 7);
  const upcomingEvents = events?.filter(e => 
    new Date(e.start) <= nextWeek
  ) || [];

  const isLoading = reservationsLoading || eventsLoading || menuLoading || categoriesLoading;

  const recentActivity = [
    { action: "Menu item added", item: "Buffalo Wings", time: "2 hours ago", type: "create" },
    { action: "Event updated", item: "NFL Playoff Party", time: "4 hours ago", type: "update" },
    { action: "Reservation made", item: "Table for 6", time: "6 hours ago", type: "create" },
    { action: "Settings changed", item: "Business hours", time: "1 day ago", type: "update" },
    { action: "Promotion activated", item: "Happy Hour", time: "2 days ago", type: "create" }
  ];

  const quickActions = [
    { title: "Add Menu Item", href: "/admin/menu", icon: Menu },
    { title: "Create Event", href: "/admin/events", icon: Calendar },
    { title: "View Reservations", href: "/admin/reservations", icon: Users },
    { title: "Edit Landing Page", href: "/admin/landing", icon: FileEdit }
  ];

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-muted-foreground">Loading dashboard...</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-8">
        {/* Page Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Dashboard</h1>
            <p className="mt-2 text-slate-600">
              Welcome back! Here's what's happening at Supano's.
            </p>
          </div>
          <div className="flex items-center space-x-3">
            <div className="bg-white rounded-xl px-4 py-2 border border-slate-200 shadow-sm">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                <span className="text-sm font-medium text-slate-700">Live Data</span>
              </div>
            </div>
            <Button 
              className="bg-slate-900 hover:bg-slate-800 text-white rounded-xl px-6 py-3 font-medium shadow-lg" 
              data-testid="export-backup-button"
            >
              <Database className="h-4 w-4 mr-2" />
              Export Data
            </Button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatsCard
            title="Today's Reservations"
            value={todaysReservations.length}
            icon={Clock}
            description="Bookings for today"
            trend={{ value: 12, isPositive: true }}
            progress={Math.min(100, (todaysReservations.length / 20) * 100)}
            color="blue"
          />
          <StatsCard
            title="Active Events"
            value={upcomingEvents.length}
            icon={Calendar}
            description="Next 7 days"
            progress={Math.min(100, (upcomingEvents.length / 10) * 100)}
            color="orange"
          />
          <StatsCard
            title="Menu Items"
            value={menuItems?.length || 0}
            icon={Menu}
            description="Active items"
            progress={92}
            color="purple"
          />
          <StatsCard
            title="Total Capacity"
            value="120"
            icon={Users}
            description="Seating capacity"
            progress={Math.min(100, (todaysReservations.length / 15) * 100)}
            color="green"
          />
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <MetricsChart
            title="Weekly Reservations"
            subtitle="Booking trends over the week"
            data={[
              { label: 'Mon', value: 15, color: 'linear-gradient(90deg, #3b82f6 0%, #1d4ed8 100%)' },
              { label: 'Tue', value: 12, color: 'linear-gradient(90deg, #3b82f6 0%, #1d4ed8 100%)' },
              { label: 'Wed', value: 18, color: 'linear-gradient(90deg, #3b82f6 0%, #1d4ed8 100%)' },
              { label: 'Thu', value: 25, color: 'linear-gradient(90deg, #3b82f6 0%, #1d4ed8 100%)' },
              { label: 'Fri', value: 42, color: 'linear-gradient(90deg, #3b82f6 0%, #1d4ed8 100%)' },
              { label: 'Sat', value: 56, color: 'linear-gradient(90deg, #3b82f6 0%, #1d4ed8 100%)' },
              { label: 'Sun', value: 48, color: 'linear-gradient(90deg, #3b82f6 0%, #1d4ed8 100%)' }
            ]}
            type="bar"
          />
          
          <MetricsChart
            title="Event Attendance"
            subtitle="Popular event types"
            data={[
              { label: 'Game Nights', value: 85 },
              { label: 'Live Music', value: 72 },
              { label: 'Trivia Night', value: 45 },
              { label: 'Happy Hour', value: 95 },
              { label: 'Private Events', value: 38 }
            ]}
            type="bar"
          />
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Activity */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200">
              <div className="p-6 border-b border-slate-100">
                <h3 className="text-lg font-bold text-slate-900 flex items-center">
                  <Activity className="h-5 w-5 mr-2 text-slate-700" />
                  Recent Activity
                </h3>
                <p className="text-sm text-slate-500 mt-1">Latest changes across the system</p>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  {recentActivity.map((activity, index) => (
                    <div key={index} className="flex items-center justify-between py-4 border-b border-slate-100 last:border-0">
                      <div className="flex items-center space-x-4">
                        <div className={cn(
                          "w-10 h-10 rounded-full flex items-center justify-center",
                          activity.type === 'create' ? 'bg-emerald-100' : 
                          activity.type === 'update' ? 'bg-blue-100' : 'bg-slate-100'
                        )}>
                          <div 
                            className={cn(
                              "w-3 h-3 rounded-full",
                              activity.type === 'create' ? 'bg-emerald-500' : 
                              activity.type === 'update' ? 'bg-blue-500' : 'bg-slate-500'
                            )}
                          />
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-slate-900">{activity.action}</p>
                          <p className="text-sm text-slate-600">{activity.item}</p>
                        </div>
                      </div>
                      <span className="text-xs text-slate-400 bg-slate-50 px-3 py-1 rounded-full">{activity.time}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
          
          {/* Right Sidebar */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200">
              <div className="p-6 border-b border-slate-100">
                <h3 className="text-lg font-bold text-slate-900">Quick Actions</h3>
                <p className="text-sm text-slate-500 mt-1">Common management tasks</p>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-1 gap-3">
                  {quickActions.map((action, index) => {
                    const Icon = action.icon;
                    const colors = [
                      'from-blue-500 to-blue-600',
                      'from-emerald-500 to-emerald-600', 
                      'from-orange-500 to-orange-600',
                      'from-purple-500 to-purple-600'
                    ];
                    return (
                      <Link key={index} href={action.href}>
                        <div 
                          className={`group bg-gradient-to-r ${colors[index % colors.length]} p-4 rounded-xl text-white hover:shadow-lg transition-all cursor-pointer`}
                          data-testid={`quick-${action.title.toLowerCase().replace(/\s+/g, '-')}`}
                        >
                          <div className="flex items-center space-x-3">
                            <Icon className="h-5 w-5" />
                            <span className="font-medium">{action.title}</span>
                          </div>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </div>
            </div>
            
            {/* Upcoming Events */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200">
              <div className="p-6 border-b border-slate-100">
                <h3 className="text-lg font-bold text-slate-900">Upcoming Events</h3>
                <p className="text-sm text-slate-500 mt-1">This week's scheduled events</p>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  {upcomingEvents.slice(0, 4).map((event, index) => (
                    <div key={event.id} className="flex items-center space-x-4 p-3 bg-slate-50 rounded-xl">
                      <div className="w-12 h-12 bg-gradient-to-br from-orange-400 to-orange-600 rounded-xl flex items-center justify-center">
                        <Calendar className="h-6 w-6 text-white" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-semibold text-slate-900">{event.title}</p>
                        <p className="text-xs text-slate-500">
                          {new Date(event.start).toLocaleDateString('tr-TR', { 
                            month: 'short', 
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-emerald-500 rounded-full" />
                        <span className="text-xs font-medium text-emerald-600">Active</span>
                      </div>
                    </div>
                  )) || (
                    <div className="text-center py-8">
                      <Calendar className="h-12 w-12 text-slate-400 mx-auto mb-3" />
                      <p className="text-sm text-slate-500">No upcoming events</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}