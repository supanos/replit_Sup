import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Menu, X } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { type SiteSettings } from "@shared/schema";

export default function Navigation() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [location] = useLocation();

  const { data: settings } = useQuery<SiteSettings>({
    queryKey: ['/api/settings']
  });

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const isActive = (path: string) => location === path;

  return (
    <nav className="sticky top-0 z-40 bg-brand-navy/95 backdrop-blur-md border-b border-brand-gold/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link href="/" data-testid="logo-link">
              <h1 className="font-anton text-2xl text-brand-gold">{settings?.logoText || 'SUPONO\'S'}</h1>
            </Link>
          </div>
          
          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              <Link 
                href="/" 
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  isActive('/') ? 'text-brand-gold' : 'text-white hover:text-brand-gold'
                }`}
                data-testid="nav-home"
              >
                Home
              </Link>
              <Link 
                href="/menu" 
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  isActive('/menu') ? 'text-brand-gold' : 'text-white hover:text-brand-gold'
                }`}
                data-testid="nav-menu"
              >
                Menu
              </Link>
              <Link 
                href="/events" 
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  isActive('/events') ? 'text-brand-gold' : 'text-white hover:text-brand-gold'
                }`}
                data-testid="nav-events"
              >
                Events
              </Link>
              <Link 
                href="/gallery" 
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  isActive('/gallery') ? 'text-brand-gold' : 'text-white hover:text-brand-gold'
                }`}
                data-testid="nav-gallery"
              >
                Gallery
              </Link>
              <Link 
                href="/contact" 
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  isActive('/contact') ? 'text-brand-gold' : 'text-white hover:text-brand-gold'
                }`}
                data-testid="nav-contact"
              >
                Contact
              </Link>
            </div>
          </div>
          
          {/* CTA Button */}
          <div className="hidden md:block">
            <Link 
              href="/reserve" 
              className="bg-brand-gold text-brand-navy px-6 py-2 rounded-xl font-semibold hover:bg-yellow-400 transition-colors shadow-lg"
              data-testid="nav-reserve-cta"
            >
              Reserve Table
            </Link>
          </div>
          
          {/* Mobile menu button */}
          <div className="md:hidden">
            <button 
              onClick={toggleMobileMenu} 
              className="text-white hover:text-brand-gold"
              data-testid="mobile-menu-button"
            >
              {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>
      
      {/* Mobile Navigation */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-brand-navy border-t border-brand-gold/20">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Link 
              href="/" 
              className={`block px-3 py-2 rounded-md text-base font-medium ${
                isActive('/') ? 'text-brand-gold' : 'text-white hover:text-brand-gold'
              }`}
              onClick={() => setIsMobileMenuOpen(false)}
              data-testid="mobile-nav-home"
            >
              Home
            </Link>
            <Link 
              href="/menu" 
              className={`block px-3 py-2 rounded-md text-base font-medium ${
                isActive('/menu') ? 'text-brand-gold' : 'text-white hover:text-brand-gold'
              }`}
              onClick={() => setIsMobileMenuOpen(false)}
              data-testid="mobile-nav-menu"
            >
              Menu
            </Link>
            <Link 
              href="/events" 
              className={`block px-3 py-2 rounded-md text-base font-medium ${
                isActive('/events') ? 'text-brand-gold' : 'text-white hover:text-brand-gold'
              }`}
              onClick={() => setIsMobileMenuOpen(false)}
              data-testid="mobile-nav-events"
            >
              Events
            </Link>
            <Link 
              href="/gallery" 
              className={`block px-3 py-2 rounded-md text-base font-medium ${
                isActive('/gallery') ? 'text-brand-gold' : 'text-white hover:text-brand-gold'
              }`}
              onClick={() => setIsMobileMenuOpen(false)}
              data-testid="mobile-nav-gallery"
            >
              Gallery
            </Link>
            <Link 
              href="/contact" 
              className={`block px-3 py-2 rounded-md text-base font-medium ${
                isActive('/contact') ? 'text-brand-gold' : 'text-white hover:text-brand-gold'
              }`}
              onClick={() => setIsMobileMenuOpen(false)}
              data-testid="mobile-nav-contact"
            >
              Contact
            </Link>
            <Link 
              href="/reserve" 
              className="bg-brand-gold text-brand-navy block px-3 py-2 rounded-md text-base font-medium mt-4"
              onClick={() => setIsMobileMenuOpen(false)}
              data-testid="mobile-nav-reserve"
            >
              Reserve Table
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
