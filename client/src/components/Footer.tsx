import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Facebook, Instagram, Twitter, Star } from "lucide-react";
import type { SiteSettings } from "@shared/schema";

export default function Footer() {
  const { data: settings } = useQuery<SiteSettings>({
    queryKey: ['/api/settings']
  });

  return (
    <footer className="bg-brand-navy border-t border-brand-gold/20 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {/* Logo & Description */}
          <div className="lg:col-span-2">
            <h3 className="font-anton text-3xl text-brand-gold mb-4">SUPANOS</h3>
            <p className="text-gray-300 mb-6 max-w-md">
              {settings?.footer?.description || 'The premier sports bar experience with live games, craft beers, and delicious food. Where every game matters and every guest is family.'}
            </p>
            <div className="flex space-x-4">
              {settings?.socials?.facebook && (
                <a 
                  href={settings.socials.facebook} 
                  className="text-brand-gold hover:text-yellow-400 text-2xl transition-colors" 
                  aria-label="Facebook"
                  data-testid="social-facebook"
                >
                  <Facebook className="w-6 h-6" />
                </a>
              )}
              {settings?.socials?.instagram && (
                <a 
                  href={settings.socials.instagram} 
                  className="text-brand-gold hover:text-yellow-400 text-2xl transition-colors" 
                  aria-label="Instagram"
                  data-testid="social-instagram"
                >
                  <Instagram className="w-6 h-6" />
                </a>
              )}
              {settings?.socials?.twitter && (
                <a 
                  href={settings.socials.twitter} 
                  className="text-brand-gold hover:text-yellow-400 text-2xl transition-colors" 
                  aria-label="Twitter"
                  data-testid="social-twitter"
                >
                  <Twitter className="w-6 h-6" />
                </a>
              )}
              {settings?.socials?.yelp && (
                <a 
                  href={settings.socials.yelp} 
                  className="text-brand-gold hover:text-yellow-400 text-2xl transition-colors" 
                  aria-label="Yelp"
                  data-testid="social-yelp"
                >
                  <Star className="w-6 h-6" />
                </a>
              )}
            </div>
          </div>
          
          {/* Quick Links */}
          <div>
            <h4 className="font-anton text-xl text-white mb-4">QUICK LINKS</h4>
            <ul className="space-y-2 text-gray-300">
              {settings?.footer?.links?.length ? 
                settings.footer.links.map((link, index) => (
                  <li key={index}>
                    <Link href={link.url} className="hover:text-brand-gold transition-colors" data-testid={`footer-${link.title.toLowerCase()}`}>
                      {link.title}
                    </Link>
                  </li>
                )) : (
                  <>
                    <li><Link href="/menu" className="hover:text-brand-gold transition-colors" data-testid="footer-menu">Menu</Link></li>
                    <li><Link href="/events" className="hover:text-brand-gold transition-colors" data-testid="footer-events">Events</Link></li>
                    <li><Link href="/gallery" className="hover:text-brand-gold transition-colors" data-testid="footer-gallery">Gallery</Link></li>
                    <li><Link href="/reserve" className="hover:text-brand-gold transition-colors" data-testid="footer-reservations">Reservations</Link></li>
                    <li><Link href="/contact" className="hover:text-brand-gold transition-colors" data-testid="footer-contact">Contact</Link></li>
                  </>
                )
              }
            </ul>
          </div>
          
          {/* Contact Info */}
          <div>
            <h4 className="font-anton text-xl text-white mb-4">CONTACT</h4>
            <div className="space-y-2 text-gray-300">
              <p data-testid="footer-address">{settings?.address}</p>
              <p>
                <a 
                  href={`tel:${settings?.phone?.replace(/\D/g, '')}`} 
                  className="hover:text-brand-gold transition-colors"
                  data-testid="footer-phone"
                >
                  {settings?.phone}
                </a>
              </p>
              <p>
                <a 
                  href={`mailto:${settings?.email}`} 
                  className="hover:text-brand-gold transition-colors"
                  data-testid="footer-email"
                >
                  {settings?.email}
                </a>
              </p>
            </div>
          </div>
        </div>
        
        {/* Bottom Bar */}
        <div className="border-t border-brand-gold/20 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm">
            {settings?.footer?.copyright || '© 2025 Supono\'s Sports Bar. All rights reserved.'}
          </p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <Link 
              href="/privacy" 
              className="text-gray-400 hover:text-brand-gold text-sm transition-colors"
              data-testid="footer-privacy"
            >
              Privacy Policy
            </Link>
            <Link 
              href="/terms" 
              className="text-gray-400 hover:text-brand-gold text-sm transition-colors"
              data-testid="footer-terms"
            >
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
