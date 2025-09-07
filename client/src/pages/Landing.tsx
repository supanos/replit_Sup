import { useQuery } from "@tanstack/react-query";
import { Link, useLocation } from "wouter";
import { Calendar, Clock, ArrowRight, Star } from "lucide-react";
import { useState, useEffect } from "react";
import type { Promotions, LandingContent } from "@shared/schema";

export default function Landing() {
  const [countdown, setCountdown] = useState(20);
  const [, navigate] = useLocation();
  
  const { data: promotions } = useQuery<Promotions>({
    queryKey: ['/api/promotions']
  });

  const { data: landingContent } = useQuery<LandingContent>({
    queryKey: ['/api/landing']
  });

  // Auto redirect after 20 seconds
  useEffect(() => {
    if (!landingContent?.popup.autoRedirect) return;
    
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          // Set flag to bypass landing redirect
          sessionStorage.setItem('bypassLanding', 'true');
          navigate('/');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [landingContent, navigate]);

  const handleEnterSite = () => {
    // Set flag to bypass landing redirect
    sessionStorage.setItem('bypassLanding', 'true');
    navigate('/');
  };

  if (!landingContent) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `linear-gradient(rgba(11, 27, 43, 0.8), rgba(11, 27, 43, 0.8)), url('${landingContent.hero.backgroundImage}')`
          }}
        />
        
        <div className="relative z-10 text-center max-w-5xl mx-auto px-4">
          {/* Logo */}
          <div className="mb-8">
            <h1 className="font-anton text-6xl sm:text-7xl lg:text-8xl text-brand-gold mb-4 text-shadow">
              {landingContent.hero.title}
            </h1>
            <div className="h-1 w-32 bg-brand-gold mx-auto"></div>
          </div>

          {/* Special Promotion */}
          {landingContent.specialOffer.enabled && (
            <div className="bg-brand-gold text-brand-navy px-8 py-4 rounded-full font-bold text-xl mb-8 inline-block">
              <span className="text-2xl mr-2 font-emoji">{landingContent.specialOffer.badge}</span>
              {landingContent.specialOffer.title}
            </div>
          )}

          <h2 className="font-anton text-4xl sm:text-5xl lg:text-6xl mb-6 text-white leading-tight">
            {landingContent.hero.subtitle}
          </h2>
          
          <p className="text-xl sm:text-2xl mb-8 text-gray-200 max-w-3xl mx-auto">
            {landingContent.hero.description}
          </p>

          {/* Features */}
          <div className="grid md:grid-cols-3 gap-8 mb-12 max-w-4xl mx-auto">
            {landingContent.features.map((feature, index) => (
              <div key={index} className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-brand-gold/30">
                <div className="text-brand-gold text-4xl mb-4 font-emoji">{feature.icon}</div>
                <h3 className="font-medium text-lg mb-2 tracking-wide">{feature.title}</h3>
                <p className="text-gray-300">{feature.description}</p>
              </div>
            ))}
          </div>

          {/* Call to Action */}
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Link href={landingContent.hero.ctaLink}>
              <button className="bg-brand-gold text-brand-navy px-10 py-5 rounded-xl font-bold text-xl hover:bg-yellow-400 transition-colors shadow-2xl flex items-center justify-center" data-testid="reserve-now-cta">
                <Calendar className="w-6 h-6 mr-3" />
                {landingContent.hero.ctaText}
              </button>
            </Link>
            <Link href="/events">
              <button className="bg-transparent border-3 border-brand-gold text-brand-gold px-10 py-5 rounded-xl font-bold text-xl hover:bg-brand-gold hover:text-brand-navy transition-colors flex items-center justify-center" data-testid="view-events-cta">
                View All Events
                <ArrowRight className="w-6 h-6 ml-3" />
              </button>
            </Link>
          </div>

          {/* Limited Time Notice */}
          <div className="mt-12 bg-red-600/90 backdrop-blur-sm rounded-xl p-4 max-w-2xl mx-auto border border-red-400">
            <div className="flex items-center justify-center">
              <Clock className="w-5 h-5 mr-2" />
              <span className="font-bold">Limited Time Event - September 1-15, 2025</span>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Info Section */}
      <section className="py-16 bg-brand-navy">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h3 className="font-bold text-2xl text-brand-gold mb-8 tracking-wide">WHY CHOOSE SUPANOS?</h3>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div className="flex items-start text-left">
                <div className="text-brand-gold text-2xl mr-4 mt-1 font-emoji">🎯</div>
                <div>
                  <h4 className="font-medium text-base mb-2">Prime Location</h4>
                  <p className="text-gray-300">Right in the heart of downtown with easy parking and transit access</p>
                </div>
              </div>
              <div className="flex items-start text-left">
                <div className="text-brand-gold text-2xl mr-4 mt-1 font-emoji">👥</div>
                <div>
                  <h4 className="font-medium text-base mb-2">Best Crowd</h4>
                  <p className="text-gray-300">Join the most passionate sports fans in the city for every big game</p>
                </div>
              </div>
            </div>
            
            <div className="space-y-6">
              <div className="flex items-start text-left">
                <div className="text-brand-gold text-2xl mr-4 mt-1 font-emoji">🍔</div>
                <div>
                  <h4 className="font-medium text-base mb-2">Amazing Food</h4>
                  <p className="text-gray-300">Gourmet pub food that rivals the best restaurants in town</p>
                </div>
              </div>
              <div className="flex items-start text-left">
                <div className="text-brand-gold text-2xl mr-4 mt-1 font-emoji">⭐</div>
                <div>
                  <h4 className="font-medium text-base mb-2">Award Winning</h4>
                  <p className="text-gray-300">Voted "Best Sports Bar" three years running by City Weekly</p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-12">
            <button 
              onClick={handleEnterSite}
              className="bg-brand-gold text-brand-navy px-8 py-4 rounded-xl font-bold text-lg hover:bg-yellow-400 transition-colors shadow-lg" 
              data-testid="enter-site-button"
            >
              Enter Main Site
            </button>
            
            {landingContent?.popup.autoRedirect && (
              <div className="mt-4">
                <p className="text-gray-300 text-sm">
                  Redirecting automatically in <span className="text-brand-gold font-bold">{countdown}</span> seconds
                </p>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
