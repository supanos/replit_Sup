import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Search, Filter, Download, Clock, User, Activity } from "lucide-react";
import AdminLayout from "@/components/admin/AdminLayout";
import { formatDistanceToNow } from "date-fns";

interface AuditLogEntry {
  id: string;
  timestamp: Date;
  user: string;
  action: string;
  resource: string;
  details: string;
  ipAddress: string;
  userAgent: string;
  status: 'success' | 'error' | 'warning';
}

// Mock data for demonstration - in real app this would come from backend
const mockAuditLogs: AuditLogEntry[] = [
  {
    id: "1",
    timestamp: new Date(Date.now() - 10 * 60 * 1000),
    user: "Supanos",
    action: "USER_CREATED",
    resource: "User Management",
    details: "Created new user: testuser",
    ipAddress: "192.168.1.1",
    userAgent: "Mozilla/5.0...",
    status: "success"
  },
  {
    id: "2",
    timestamp: new Date(Date.now() - 30 * 60 * 1000),
    user: "Supanos",
    action: "LOGIN",
    resource: "Authentication",
    details: "Successful admin login",
    ipAddress: "192.168.1.1",
    userAgent: "Mozilla/5.0...",
    status: "success"
  },
  {
    id: "3",
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
    user: "Supanos",
    action: "SETTINGS_UPDATED",
    resource: "Site Settings",
    details: "Updated restaurant name and address",
    ipAddress: "192.168.1.1",
    userAgent: "Mozilla/5.0...",
    status: "success"
  },
  {
    id: "4",
    timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000),
    user: "Supanos",
    action: "MENU_ITEM_CREATED",
    resource: "Menu Management",
    details: "Added new menu item: Buffalo Wings",
    ipAddress: "192.168.1.1",
    userAgent: "Mozilla/5.0...",
    status: "success"
  },
  {
    id: "5",
    timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000),
    user: "System",
    action: "BACKUP_FAILED",
    resource: "System",
    details: "Automatic backup failed - disk space",
    ipAddress: "127.0.0.1",
    userAgent: "System",
    status: "error"
  }
];

export default function AdminAuditLog() {
  const [logs, setLogs] = useState<AuditLogEntry[]>(mockAuditLogs);
  const [filteredLogs, setFilteredLogs] = useState<AuditLogEntry[]>(mockAuditLogs);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [userFilter, setUserFilter] = useState<string>("all");

  useEffect(() => {
    let filtered = logs;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(log => 
        log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.details.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.resource.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter(log => log.status === statusFilter);
    }

    // User filter
    if (userFilter !== "all") {
      filtered = filtered.filter(log => log.user === userFilter);
    }

    setFilteredLogs(filtered);
  }, [logs, searchTerm, statusFilter, userFilter]);

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'success':
        return 'bg-green-100 text-green-800';
      case 'error':
        return 'bg-red-100 text-red-800';
      case 'warning':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getActionIcon = (action: string) => {
    if (action.includes('LOGIN') || action.includes('LOGOUT')) {
      return <User className="w-4 h-4" />;
    }
    if (action.includes('CREATED') || action.includes('UPDATED') || action.includes('DELETED')) {
      return <Activity className="w-4 h-4" />;
    }
    return <Clock className="w-4 h-4" />;
  };

  const uniqueUsers = Array.from(new Set(logs.map(log => log.user)));

  const exportLogs = () => {
    const csvContent = [
      "Timestamp,User,Action,Resource,Details,Status,IP Address",
      ...filteredLogs.map(log => 
        `"${log.timestamp.toISOString()}","${log.user}","${log.action}","${log.resource}","${log.details}","${log.status}","${log.ipAddress}"`
      )
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `audit-log-${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Audit Log</h1>
            <p className="text-muted-foreground">System activity and security logs</p>
          </div>
          <Button onClick={exportLogs} data-testid="button-export-logs">
            <Download className="w-4 h-4 mr-2" />
            Export CSV
          </Button>
        </div>

        {/* Filters */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="w-5 h-5" />
              Filters
            </CardTitle>
            <CardDescription>Filter audit logs by various criteria</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Search</label>
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search actions, details..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                    data-testid="input-search-logs"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Status</label>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger data-testid="select-status-filter">
                    <SelectValue placeholder="All statuses" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    <SelectItem value="success">Success</SelectItem>
                    <SelectItem value="error">Error</SelectItem>
                    <SelectItem value="warning">Warning</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">User</label>
                <Select value={userFilter} onValueChange={setUserFilter}>
                  <SelectTrigger data-testid="select-user-filter">
                    <SelectValue placeholder="All users" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Users</SelectItem>
                    {uniqueUsers.map(user => (
                      <SelectItem key={user} value={user}>{user}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Audit Log Table */}
        <Card>
          <CardHeader>
            <CardTitle>Activity Log</CardTitle>
            <CardDescription>
              Showing {filteredLogs.length} of {logs.length} log entries
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Time</TableHead>
                    <TableHead>User</TableHead>
                    <TableHead>Action</TableHead>
                    <TableHead>Resource</TableHead>
                    <TableHead>Details</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>IP Address</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredLogs.map((log) => (
                    <TableRow key={log.id}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4 text-muted-foreground" />
                          <div>
                            <div className="font-medium">
                              {log.timestamp.toLocaleTimeString()}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              {formatDistanceToNow(log.timestamp, { addSuffix: true })}
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <User className="w-4 h-4" />
                          <span className="font-medium">{log.user}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {getActionIcon(log.action)}
                          <span className="font-mono text-sm">{log.action}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm">{log.resource}</span>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm">{log.details}</span>
                      </TableCell>
                      <TableCell>
                        <Badge className={getStatusBadgeColor(log.status)}>
                          {log.status.toUpperCase()}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <span className="font-mono text-sm">{log.ipAddress}</span>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              
              {filteredLogs.length === 0 && (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">No log entries found matching your filters.</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}