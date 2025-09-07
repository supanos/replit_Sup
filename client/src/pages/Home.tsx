import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Calendar, Clock, Tv, ArrowRight, ChevronDown } from "lucide-react";
import type { Game, Event, MenuItem, SiteSettings, Promotions } from "@shared/schema";
import Badge from "@/components/Badge";
import MatchListToday from "@/components/MatchListToday";
import LandingPopup from "@/components/LandingPopup";

export default function Home() {
  const { data: todaysGames, isLoading: gamesLoading } = useQuery<Game[]>({
    queryKey: ['/api/games/today']
  });
  
  const { data: events } = useQuery<Event[]>({
    queryKey: ['/api/events']
  });

  const { data: menuItems } = useQuery<MenuItem[]>({
    queryKey: ['/api/menu/items']
  });

  const { data: settings } = useQuery<SiteSettings>({
    queryKey: ['/api/settings']
  });

  const { data: promotions } = useQuery<Promotions>({
    queryKey: ['/api/promotions']
  });

  // Get next 3 upcoming events
  const upcomingEvents = events?.slice(0, 3) || [];
  
  // Get featured menu items (first 3)
  const featuredItems = menuItems?.slice(0, 3) || [];

  return (
    <div className="min-h-screen">
      <LandingPopup />
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `linear-gradient(rgba(11, 27, 43, 0.7), rgba(11, 27, 43, 0.7)), url('${settings?.hero?.backgroundImage || 'https://images.unsplash.com/photo-1574391884720-bfb65e72b3e5?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&h=1080'}')`
          }}
        />
        
        <div className="relative z-10 text-center max-w-4xl mx-auto px-4">
          <h1 className="font-anton text-5xl sm:text-6xl lg:text-7xl mb-6 text-white leading-tight text-shadow">
            {settings?.hero?.title?.split(' AT ')[0] || 'TONIGHT\'S GAMES'}<br />
            <span className="text-brand-gold">AT {settings?.name || 'SUPANOS'}</span>
          </h1>
          <p className="text-xl sm:text-2xl mb-8 text-gray-200 max-w-2xl mx-auto">
            {settings?.hero?.subtitle || 'Experience every touchdown, every goal, every victory with the best crowd in town'}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/events">
              <button className="bg-brand-gold text-brand-navy px-8 py-4 rounded-xl font-bold text-lg hover:bg-yellow-400 transition-colors shadow-2xl flex items-center justify-center min-w-[180px]" data-testid="hero-events-cta">
                <Calendar className="w-5 h-5 mr-2" />
                Tonight's Events
              </button>
            </Link>
            <button 
              onClick={() => {
                const happyHourSection = document.getElementById('happy-hour');
                if (happyHourSection) {
                  happyHourSection.scrollIntoView({ behavior: 'smooth' });
                } else {
                  // If Happy Hour section is not visible, scroll to menu
                  window.location.href = '/menu';
                }
              }}
              className="bg-transparent border-2 border-brand-gold text-brand-gold px-8 py-4 rounded-xl font-bold text-lg hover:bg-brand-gold hover:text-brand-navy transition-colors shadow-2xl flex items-center justify-center min-w-[180px]" 
              data-testid="hero-happy-hour-cta"
            >
              <Clock className="w-5 h-5 mr-2" />
              Happy Hour
            </button>
          </div>
        </div>
        
        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <ChevronDown className="text-brand-gold text-2xl w-8 h-8" />
        </div>
      </section>

      {/* Today's Games Section */}
      <section id="todays-games" className="py-16 bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="font-bold text-3xl sm:text-4xl text-white mb-4 tracking-wide">TODAY'S MATCHES</h2>
            <p className="text-xl text-gray-300">Catch all the action on our big screens</p>
          </div>
          
          <MatchListToday />
        </div>
      </section>

      {/* Happy Hour Section */}
      {promotions?.happyHour?.enabled && (
        <section id="happy-hour" className="py-16 bg-brand-gray">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-gradient-to-r from-brand-navy to-gray-800 rounded-2xl p-8 lg:p-12 shadow-2xl relative overflow-hidden">
              <div className="relative z-10 text-center">
                <div className="inline-block bg-brand-gold text-brand-navy px-6 py-2 rounded-full font-bold text-lg mb-6">
                  <Clock className="inline w-5 h-5 mr-2" />
                  {promotions.happyHour.subtitle}
                </div>
                <h2 className="font-bold text-3xl sm:text-4xl text-white mb-6 tracking-wide">
                  {promotions.happyHour.title}
                </h2>
                <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
                  {promotions.happyHour.description}
                </p>
                
                <div className="grid gap-6 md:grid-cols-3 max-w-4xl mx-auto mb-8">
                  {promotions.happyHour.offers.map((offer, index) => (
                    <div key={index} className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-brand-gold/30">
                      <div className="text-brand-gold text-3xl mb-2">{offer.icon}</div>
                      <h3 className="font-semibold text-base mb-2">{offer.title}</h3>
                      <p className="text-gray-300">{offer.description}</p>
                    </div>
                  ))}
                </div>
                
                <Link href="/menu">
                  <button className="bg-brand-gold text-brand-navy px-8 py-4 rounded-xl font-bold text-lg hover:bg-yellow-400 transition-colors shadow-lg" data-testid="happy-hour-menu-cta">
                    View Full Menu
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Upcoming Events Section */}
      <section id="events" className="py-16 bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="font-bold text-3xl sm:text-4xl text-white mb-4 tracking-wide">UPCOMING EVENTS</h2>
            <p className="text-xl text-gray-300">Don't miss the action at Supono's</p>
          </div>
          
          {upcomingEvents.length ? (
            <div className="grid gap-8 lg:grid-cols-3">
              {upcomingEvents.map((event) => (
                <div key={event.id} className="bg-brand-navy rounded-xl overflow-hidden shadow-2xl border border-brand-gold/20" data-testid={`event-card-${event.id}`}>
                  {event.image && (
                    <img 
                      src={event.image} 
                      alt={event.title} 
                      className="w-full h-48 object-cover"
                    />
                  )}
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-3">
                      {event.tags?.length && (
                        <Badge variant="popular">{event.tags[0]}</Badge>
                      )}
                      <span className="text-brand-gold text-sm">
                        {new Date(event.start).toLocaleDateString()}
                      </span>
                    </div>
                    <h3 className="font-semibold text-xl mb-3 text-white">{event.title}</h3>
                    <p className="text-gray-100 mb-4 line-clamp-3">{event.description}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-brand-gold font-semibold">
                        {new Date(event.start).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        {event.end && ` - ${new Date(event.end).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`}
                      </span>
                      <Link href={`/events/${event.slug}`}>
                        <button className="text-brand-gold hover:text-yellow-400 font-semibold transition-colors flex items-center" data-testid={`event-learn-more-${event.id}`}>
                          Learn More <ArrowRight className="w-4 h-4 ml-1" />
                        </button>
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center text-gray-400">
              <p>No upcoming events scheduled. Check back soon!</p>
            </div>
          )}
          
          <div className="text-center mt-12">
            <Link href="/events">
              <button className="bg-brand-gold text-brand-navy px-8 py-4 rounded-xl font-bold text-lg hover:bg-yellow-400 transition-colors shadow-lg" data-testid="all-events-cta">
                View All Events
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Menu Section */}
      <section id="menu" className="py-16 bg-brand-gray text-brand-navy">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="font-anton text-4xl sm:text-5xl mb-4">FEATURED MENU</h2>
            <p className="text-xl text-gray-600">Game day favorites and crowd pleasers</p>
          </div>
          
          {featuredItems.length ? (
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {featuredItems.map((item) => (
                <div key={item.id} className="bg-white rounded-xl overflow-hidden shadow-xl" data-testid={`menu-item-${item.id}`}>
                  {item.image && (
                    <img 
                      src={item.image} 
                      alt={item.name} 
                      className="w-full h-48 object-cover"
                    />
                  )}
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-anton text-xl">{item.name}</h3>
                      {item.badges?.length && (
                        <Badge variant={item.badges[0] as any}>{item.badges[0]}</Badge>
                      )}
                    </div>
                    <p className="text-gray-600 mb-4">{item.description}</p>
                    <div className="flex items-center justify-between">
                      <span className="font-anton text-2xl text-brand-gold">${item.price}</span>
                      {item.allergens?.length && (
                        <span className="text-sm text-gray-500">Contains: {item.allergens.join(', ')}</span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center text-gray-600">
              <p>Menu items coming soon!</p>
            </div>
          )}
          
          <div className="text-center mt-12">
            <Link href="/menu">
              <button className="bg-brand-navy text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-gray-800 transition-colors shadow-lg" data-testid="full-menu-cta">
                View Full Menu
              </button>
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}
