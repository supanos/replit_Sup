import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Calendar, Clock, Users, Phone, Mail, Filter, Download } from "lucide-react";
import type { Reservation } from "@shared/schema";
import { Button } from "@/components/ui/button";
import AdminLayout from "@/components/admin/AdminLayout";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function AdminReservationsViewer() {
  const [dateFilter, setDateFilter] = useState<string>('all');
  const [groupFilter, setGroupFilter] = useState<string>('all');

  const { data: reservations, isLoading } = useQuery<Reservation[]>({
    queryKey: ['/api/reservations']
  });

  // Filter reservations
  const filteredReservations = reservations?.filter(reservation => {
    const reservationDate = new Date(reservation.datetime);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);
    
    let dateMatch = true;
    switch (dateFilter) {
      case 'today':
        dateMatch = reservationDate.toDateString() === today.toDateString();
        break;
      case 'tomorrow':
        dateMatch = reservationDate.toDateString() === tomorrow.toDateString();
        break;
      case 'this-week':
        const weekStart = new Date(today);
        weekStart.setDate(today.getDate() - today.getDay());
        const weekEnd = new Date(weekStart);
        weekEnd.setDate(weekStart.getDate() + 6);
        dateMatch = reservationDate >= weekStart && reservationDate <= weekEnd;
        break;
      case 'upcoming':
        dateMatch = reservationDate >= today;
        break;
    }

    let groupMatch = true;
    switch (groupFilter) {
      case 'group':
        groupMatch = reservation.isGroupEvent === true;
        break;
      case 'regular':
        groupMatch = !reservation.isGroupEvent;
        break;
    }

    return dateMatch && groupMatch;
  }) || [];

  // Sort by datetime
  const sortedReservations = filteredReservations.sort((a, b) => 
    new Date(a.datetime).getTime() - new Date(b.datetime).getTime()
  );

  const exportToCsv = () => {
    if (!sortedReservations.length) return;

    const headers = ['Name', 'Email', 'Phone', 'Party Size', 'Date', 'Time', 'Group Event', 'Notes', 'Created At'];
    const csvContent = [
      headers.join(','),
      ...sortedReservations.map(reservation => [
        `"${reservation.name}"`,
        `"${reservation.email}"`,
        `"${reservation.phone}"`,
        reservation.partySize,
        new Date(reservation.datetime).toLocaleDateString(),
        new Date(reservation.datetime).toLocaleTimeString(),
        reservation.isGroupEvent ? 'Yes' : 'No',
        `"${reservation.notes || ''}"`,
        new Date(reservation.createdAt).toLocaleDateString()
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `reservations-${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-xl">Loading reservations...</div>
      </div>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
      {/* Admin Header */}
      <div className="bg-brand-navy shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <h1 className="font-anton text-2xl text-brand-gold">RESERVATIONS</h1>
            </div>
            <a href="/admin" className="bg-brand-gold text-brand-navy px-4 py-2 rounded-lg font-semibold hover:bg-yellow-400 transition-colors">
              Back to Dashboard
            </a>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filters and Export */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-gray-500" />
                <span className="text-sm font-medium">Filters:</span>
              </div>
              
              <Select value={dateFilter} onValueChange={setDateFilter}>
                <SelectTrigger className="w-40" data-testid="date-filter">
                  <SelectValue placeholder="Date range" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All dates</SelectItem>
                  <SelectItem value="today">Today</SelectItem>
                  <SelectItem value="tomorrow">Tomorrow</SelectItem>
                  <SelectItem value="this-week">This week</SelectItem>
                  <SelectItem value="upcoming">Upcoming</SelectItem>
                </SelectContent>
              </Select>

              <Select value={groupFilter} onValueChange={setGroupFilter}>
                <SelectTrigger className="w-40" data-testid="group-filter">
                  <SelectValue placeholder="Group type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All types</SelectItem>
                  <SelectItem value="regular">Regular</SelectItem>
                  <SelectItem value="group">Group events</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button 
              onClick={exportToCsv}
              className="bg-green-600 hover:bg-green-700"
              disabled={!sortedReservations.length}
              data-testid="export-csv-button"
            >
              <Download className="w-4 h-4 mr-2" />
              Export CSV
            </Button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Reservations</p>
                <p className="text-3xl font-bold text-gray-900" data-testid="total-reservations">
                  {sortedReservations.length}
                </p>
              </div>
              <Calendar className="w-8 h-8 text-blue-600" />
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Group Events</p>
                <p className="text-3xl font-bold text-gray-900" data-testid="group-reservations">
                  {sortedReservations.filter(r => r.isGroupEvent).length}
                </p>
              </div>
              <Users className="w-8 h-8 text-green-600" />
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Guests</p>
                <p className="text-3xl font-bold text-gray-900" data-testid="total-guests">
                  {sortedReservations.reduce((acc, r) => acc + parseInt(r.partySize), 0)}
                </p>
              </div>
              <Users className="w-8 h-8 text-purple-600" />
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Today's Reservations</p>
                <p className="text-3xl font-bold text-gray-900" data-testid="today-reservations">
                  {reservations?.filter(r => 
                    new Date(r.datetime).toDateString() === new Date().toDateString()
                  ).length || 0}
                </p>
              </div>
              <Clock className="w-8 h-8 text-orange-600" />
            </div>
          </div>
        </div>

        {/* Reservations List */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Reservations ({sortedReservations.length})
          </h2>

          {sortedReservations.length > 0 ? (
            <div className="space-y-4">
              {sortedReservations.map((reservation) => (
                <div 
                  key={reservation.id} 
                  className="border border-gray-200 rounded-lg p-6 hover:bg-gray-50 transition-colors"
                  data-testid={`reservation-${reservation.id}`}
                >
                  <div className="grid lg:grid-cols-4 gap-4">
                    {/* Customer Info */}
                    <div>
                      <h3 className="font-semibold text-lg text-gray-900 mb-1">
                        {reservation.name}
                        {reservation.isGroupEvent && (
                          <span className="ml-2 bg-brand-gold text-brand-navy px-2 py-1 rounded-full text-xs font-bold">
                            GROUP
                          </span>
                        )}
                      </h3>
                      <div className="space-y-1 text-sm text-gray-600">
                        <div className="flex items-center">
                          <Mail className="w-4 h-4 mr-2" />
                          <a href={`mailto:${reservation.email}`} className="hover:text-brand-gold">
                            {reservation.email}
                          </a>
                        </div>
                        <div className="flex items-center">
                          <Phone className="w-4 h-4 mr-2" />
                          <a href={`tel:${reservation.phone}`} className="hover:text-brand-gold">
                            {reservation.phone}
                          </a>
                        </div>
                      </div>
                    </div>

                    {/* Reservation Details */}
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">Reservation Details</h4>
                      <div className="space-y-1 text-sm text-gray-600">
                        <div className="flex items-center">
                          <Users className="w-4 h-4 mr-2" />
                          <span>Party of {reservation.partySize}</span>
                        </div>
                        <div className="flex items-center">
                          <Calendar className="w-4 h-4 mr-2" />
                          <span>{new Date(reservation.datetime).toLocaleDateString()}</span>
                        </div>
                        <div className="flex items-center">
                          <Clock className="w-4 h-4 mr-2" />
                          <span>{new Date(reservation.datetime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                        </div>
                      </div>
                    </div>

                    {/* Special Notes */}
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">Special Requests</h4>
                      <p className="text-sm text-gray-600">
                        {reservation.notes || 'No special requests'}
                      </p>
                    </div>

                    {/* Metadata */}
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">Created</h4>
                      <p className="text-sm text-gray-600">
                        {new Date(reservation.createdAt).toLocaleDateString()} at{' '}
                        {new Date(reservation.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-gray-500">
              <Calendar className="w-16 h-16 mx-auto mb-4 text-gray-300" />
              <h3 className="text-lg font-semibold mb-2">No Reservations Found</h3>
              <p>No reservations match your current filters.</p>
            </div>
          )}
        </div>
      </div>
      </div>
    </AdminLayout>
  );
}
