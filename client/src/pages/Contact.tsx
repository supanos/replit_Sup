import { useQuery } from "@tanstack/react-query";
import { MapPin, Phone, Mail, Clock, Car, Building, Navigation } from "lucide-react";
import type { SiteSettings } from "@shared/schema";

export default function Contact() {
  const { data: settings } = useQuery<SiteSettings>({
    queryKey: ['/api/settings']
  });

  return (
    <div className="min-h-screen bg-gray-900 text-white py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="font-anton text-4xl sm:text-5xl mb-4">FIND US</h1>
          <p className="text-xl text-gray-300">Visit Supono's for the ultimate sports experience</p>
        </div>
        
        <div className="grid lg:grid-cols-2 gap-12">
          {/* Contact Info */}
          <div className="space-y-8">
            <div className="bg-brand-navy rounded-xl p-8 shadow-2xl border border-brand-gold/20">
              <h2 className="font-anton text-2xl text-brand-gold mb-6">CONTACT INFO</h2>
              
              <div className="space-y-6">
                <div className="flex items-center" data-testid="contact-address">
                  <div className="text-brand-gold text-xl mr-4">
                    <MapPin className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-white font-semibold">{settings?.address || "123 Stadium Drive"}</p>
                    <p className="text-gray-300">Downtown, State 12345</p>
                  </div>
                </div>
                
                <div className="flex items-center" data-testid="contact-phone">
                  <div className="text-brand-gold text-xl mr-4">
                    <Phone className="w-6 h-6" />
                  </div>
                  <div>
                    <a 
                      href={`tel:${settings?.phone?.replace(/\D/g, '')}`} 
                      className="text-white hover:text-brand-gold transition-colors font-semibold"
                    >
                      {settings?.phone || "(555) SPORT-BAR"}
                    </a>
                  </div>
                </div>
                
                <div className="flex items-center" data-testid="contact-email">
                  <div className="text-brand-gold text-xl mr-4">
                    <Mail className="w-6 h-6" />
                  </div>
                  <div>
                    <a 
                      href={`mailto:${settings?.email}`} 
                      className="text-white hover:text-brand-gold transition-colors font-semibold"
                    >
                      {settings?.email || "info@suponos.com"}
                    </a>
                  </div>
                </div>
              </div>
              
              <div className="mt-8">
                <a 
                  href={`tel:${settings?.phone?.replace(/\D/g, '')}`} 
                  className="w-full bg-brand-gold text-brand-navy py-3 rounded-xl font-bold text-lg hover:bg-yellow-400 transition-colors shadow-lg flex items-center justify-center"
                  data-testid="call-now-button"
                >
                  <Phone className="w-5 h-5 mr-2" />
                  Call Now
                </a>
              </div>
            </div>
            
            <div className="bg-brand-navy rounded-xl p-8 shadow-2xl border border-brand-gold/20">
              <h2 className="font-anton text-2xl text-brand-gold mb-6">HOURS</h2>
              
              <div className="space-y-3" data-testid="business-hours">
                {settings?.hours?.length ? (
                  settings.hours.map((hour, index) => (
                    <div key={index} className="flex justify-between">
                      <span className="text-white font-semibold">{hour.day}</span>
                      <span className="text-gray-300">
                        {hour.closed ? 'Closed' : `${hour.open} - ${hour.close}`}
                      </span>
                    </div>
                  ))
                ) : (
                  <>
                    <div className="flex justify-between">
                      <span className="text-white font-semibold">Monday - Thursday</span>
                      <span className="text-gray-300">11:00 AM - 11:00 PM</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-white font-semibold">Friday - Saturday</span>
                      <span className="text-gray-300">11:00 AM - 1:00 AM</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-white font-semibold">Sunday</span>
                      <span className="text-gray-300">11:00 AM - 10:00 PM</span>
                    </div>
                  </>
                )}
              </div>
            </div>
            
            <div className="bg-brand-navy rounded-xl p-8 shadow-2xl border border-brand-gold/20">
              <h2 className="font-anton text-2xl text-brand-gold mb-6">PARKING</h2>
              <div className="space-y-4 text-gray-300">
                <div className="flex items-start" data-testid="parking-free">
                  <Car className="w-5 h-5 text-brand-gold mr-3 mt-1 flex-shrink-0" />
                  <p>Free parking available in our lot behind the building</p>
                </div>
                <div className="flex items-start" data-testid="parking-street">
                  <Navigation className="w-5 h-5 text-brand-gold mr-3 mt-1 flex-shrink-0" />
                  <p>Street parking available on Stadium Drive and Oak Street</p>
                </div>
                <div className="flex items-start" data-testid="parking-garage">
                  <Building className="w-5 h-5 text-brand-gold mr-3 mt-1 flex-shrink-0" />
                  <p>Validated parking available at Downtown Garage (2 blocks)</p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Map Placeholder */}
          <div className="bg-brand-navy rounded-xl overflow-hidden shadow-2xl border border-brand-gold/20 h-full min-h-[500px]">
            <div className="h-full flex items-center justify-center text-center p-8">
              <div>
                <div className="text-brand-gold text-6xl mb-4">
                  <MapPin className="w-16 h-16 mx-auto" />
                </div>
                <h3 className="font-anton text-2xl text-white mb-4">INTERACTIVE MAP</h3>
                <p className="text-gray-300 mb-6">Get directions to Supono's Sports Bar</p>
                <a 
                  href={`https://maps.google.com/?q=${encodeURIComponent(settings?.address || '123 Stadium Drive, Downtown, State 12345')}`}
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-block bg-brand-gold text-brand-navy px-6 py-3 rounded-xl font-bold hover:bg-yellow-400 transition-colors"
                  data-testid="open-maps-link"
                >
                  Open in Maps
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Additional Info Section */}
        <div className="mt-16">
          <div className="bg-gradient-to-r from-brand-navy to-gray-800 rounded-2xl p-8 lg:p-12 text-center">
            <h2 className="font-anton text-3xl text-brand-gold mb-6">VISIT US TODAY</h2>
            <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
              Whether you're catching the big game, enjoying happy hour with friends, or celebrating a special occasion, 
              Supono's Sports Bar is your home away from home.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a 
                href="/reserve" 
                className="bg-brand-gold text-brand-navy px-8 py-4 rounded-xl font-bold text-lg hover:bg-yellow-400 transition-colors shadow-lg"
                data-testid="reserve-table-cta"
              >
                Reserve Your Table
              </a>
              <a 
                href="/menu" 
                className="bg-transparent border-2 border-brand-gold text-brand-gold px-8 py-4 rounded-xl font-bold text-lg hover:bg-brand-gold hover:text-brand-navy transition-colors"
                data-testid="view-menu-cta"
              >
                View Our Menu
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
