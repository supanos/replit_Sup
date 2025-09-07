import { useQuery } from "@tanstack/react-query";
import { useRoute, Link } from "wouter";
import { Calendar, Clock, MapPin, ArrowLeft, Download } from "lucide-react";
import type { Event } from "@shared/schema";
import Badge from "@/components/Badge";

export default function EventDetails() {
  const [match, params] = useRoute('/events/:slug');
  const { data: event, isLoading, error } = useQuery<Event>({
    queryKey: ['/api/events', params?.slug],
    enabled: !!params?.slug
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading event details...</div>
      </div>
    );
  }

  if (error || !event) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center text-white">
          <h2 className="text-2xl font-bold mb-4">Event Not Found</h2>
          <p className="text-gray-400 mb-6">The event you're looking for doesn't exist.</p>
          <Link href="/events">
            <button className="bg-brand-gold text-brand-navy px-6 py-3 rounded-xl font-semibold hover:bg-yellow-400 transition-colors">
              Back to Events
            </button>
          </Link>
        </div>
      </div>
    );
  }

  const generateICSFile = () => {
    const startDate = new Date(event.start).toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
    const endDate = event.end 
      ? new Date(event.end).toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z'
      : new Date(new Date(event.start).getTime() + 2 * 60 * 60 * 1000).toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';

    const icsContent = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//Supono\'s Sports Bar//Event//EN',
      'BEGIN:VEVENT',
      `DTSTART:${startDate}`,
      `DTEND:${endDate}`,
      `SUMMARY:${event.title}`,
      `DESCRIPTION:${event.description || ''}`,
      'LOCATION:Supono\'s Sports Bar, 123 Stadium Drive, Downtown, State 12345',
      `UID:${event.id}@suponos.com`,
      'END:VEVENT',
      'END:VCALENDAR'
    ].join('\r\n');

    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.download = `${event.slug}.ics`;
    link.click();
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Hero Section */}
      <section className="relative h-96 overflow-hidden">
        {event.image ? (
          <div
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{
              backgroundImage: `linear-gradient(rgba(11, 27, 43, 0.7), rgba(11, 27, 43, 0.7)), url('${event.image}')`
            }}
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-brand-navy to-gray-800" />
        )}
        
        <div className="relative z-10 h-full flex items-center">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
            <Link href="/events">
              <button className="flex items-center text-brand-gold hover:text-yellow-400 mb-6 transition-colors" data-testid="back-to-events">
                <ArrowLeft className="w-5 h-5 mr-2" />
                Back to Events
              </button>
            </Link>
            
            <div className="max-w-3xl">
              <div className="flex items-center gap-4 mb-4">
                {event.tags?.map((tag, index) => (
                  <Badge key={index} variant="popular">{tag}</Badge>
                ))}
              </div>
              <h1 className="font-anton text-4xl sm:text-5xl lg:text-6xl mb-4 text-shadow" data-testid="event-title">
                {event.title}
              </h1>
              <div className="flex flex-wrap items-center gap-6 text-lg">
                <div className="flex items-center text-brand-gold">
                  <Calendar className="w-5 h-5 mr-2" />
                  <span data-testid="event-date">
                    {new Date(event.start).toLocaleDateString('en-US', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </span>
                </div>
                <div className="flex items-center text-brand-gold">
                  <Clock className="w-5 h-5 mr-2" />
                  <span data-testid="event-time">
                    {new Date(event.start).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    {event.end && ` - ${new Date(event.end).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Event Details */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2">
              <h2 className="font-anton text-3xl mb-6">Event Details</h2>
              <div className="prose prose-invert max-w-none">
                <p className="text-lg text-gray-300 leading-relaxed" data-testid="event-description">
                  {event.description || 'No description available for this event.'}
                </p>
              </div>
            </div>
            
            <div className="lg:col-span-1">
              <div className="bg-brand-navy rounded-xl p-6 shadow-2xl border border-brand-gold/20">
                <h3 className="font-anton text-xl text-brand-gold mb-6">Quick Actions</h3>
                
                <div className="space-y-4">
                  <button
                    onClick={generateICSFile}
                    className="w-full bg-brand-gold text-brand-navy py-3 px-4 rounded-xl font-semibold hover:bg-yellow-400 transition-colors flex items-center justify-center"
                    data-testid="add-to-calendar-button"
                  >
                    <Download className="w-5 h-5 mr-2" />
                    Add to Calendar
                  </button>
                  
                  <Link href="/reserve" className="block">
                    <button className="w-full bg-transparent border-2 border-brand-gold text-brand-gold py-3 px-4 rounded-xl font-semibold hover:bg-brand-gold hover:text-brand-navy transition-colors" data-testid="reserve-table-button">
                      Reserve Table
                    </button>
                  </Link>
                </div>
                
                <div className="mt-8 pt-6 border-t border-brand-gold/20">
                  <h4 className="font-semibold text-brand-gold mb-3">Location</h4>
                  <div className="flex items-start text-gray-300">
                    <MapPin className="w-5 h-5 mr-2 mt-0.5 flex-shrink-0" />
                    <div>
                      <p>Supono's Sports Bar</p>
                      <p className="text-sm">123 Stadium Drive</p>
                      <p className="text-sm">Downtown, State 12345</p>
                    </div>
                  </div>
                </div>
                
                <div className="mt-6 pt-6 border-t border-brand-gold/20">
                  <h4 className="font-semibold text-brand-gold mb-3">Contact</h4>
                  <p className="text-gray-300 text-sm">
                    Questions about this event?<br />
                    Call us at <a href="tel:+15555767872" className="text-brand-gold hover:text-yellow-400 transition-colors">(555) SPORT-BAR</a>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
