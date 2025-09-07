import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Calendar, Clock, Tag, ArrowRight } from "lucide-react";
import type { Event } from "@shared/schema";
import Badge from "@/components/Badge";

export default function Events() {
  const { data: events, isLoading } = useQuery<Event[]>({
    queryKey: ['/api/events']
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading events...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="font-anton text-4xl sm:text-5xl mb-4">UPCOMING EVENTS</h1>
          <p className="text-xl text-gray-300">Don't miss the action at Supono's</p>
        </div>

        {/* Events List */}
        {events?.length ? (
          <div className="grid gap-8 lg:grid-cols-2 xl:grid-cols-3">
            {events.map((event) => (
              <div key={event.id} className="bg-brand-navy rounded-xl overflow-hidden shadow-2xl border border-brand-gold/20 card-hover" data-testid={`event-card-${event.id}`}>
                {event.image && (
                  <img 
                    src={event.image} 
                    alt={event.title} 
                    className="w-full h-48 object-cover"
                    data-testid={`event-image-${event.id}`}
                  />
                )}
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    {event.tags?.length && (
                      <div className="flex gap-2">
                        {event.tags.slice(0, 2).map((tag, index) => (
                          <Badge key={index} variant="popular">{tag}</Badge>
                        ))}
                      </div>
                    )}
                    <div className="flex items-center text-brand-gold text-sm">
                      <Calendar className="w-4 h-4 mr-1" />
                      <span data-testid={`event-date-${event.id}`}>
                        {new Date(event.start).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  
                  <h3 className="font-anton text-xl mb-3" data-testid={`event-title-${event.id}`}>
                    {event.title}
                  </h3>
                  
                  <p className="text-gray-300 mb-4 line-clamp-3" data-testid={`event-description-${event.id}`}>
                    {event.description}
                  </p>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center text-brand-gold font-semibold">
                      <Clock className="w-4 h-4 mr-1" />
                      <span data-testid={`event-time-${event.id}`}>
                        {new Date(event.start).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        {event.end && ` - ${new Date(event.end).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`}
                      </span>
                    </div>
                    <Link href={`/events/${event.slug}`}>
                      <button className="text-brand-gold hover:text-yellow-400 font-semibold transition-colors flex items-center" data-testid={`event-details-link-${event.id}`}>
                        Details <ArrowRight className="w-4 h-4 ml-1" />
                      </button>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center text-gray-400 py-12">
            <Calendar className="w-16 h-16 mx-auto mb-4 text-gray-600" />
            <h3 className="text-xl font-semibold mb-2">No Events Scheduled</h3>
            <p>Check back soon for upcoming events and special occasions!</p>
          </div>
        )}
      </div>
    </div>
  );
}
