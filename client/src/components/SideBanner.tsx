import { useQuery } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { Link } from "wouter";
import type { Promotions } from "@shared/schema";

export default function SideBanner() {
  const [isDismissed, setIsDismissed] = useState(false);
  const { data: promotions } = useQuery<Promotions>({
    queryKey: ['/api/promotions']
  });

  // Check localStorage for dismissal status on mount, but reset if banner is enabled
  useEffect(() => {
    if (promotions?.sideBanner.enabled) {
      // Reset dismissal when banner is enabled again from admin
      localStorage.removeItem('sideBannerDismissed');
      setIsDismissed(false);
    } else {
      const dismissed = localStorage.getItem('sideBannerDismissed');
      setIsDismissed(dismissed === 'true');
    }
  }, [promotions?.sideBanner.enabled]);

  const dismissBanner = () => {
    setIsDismissed(true);
    localStorage.setItem('sideBannerDismissed', 'true');
  };

  // Don't show banner if dismissed, not enabled, or outside date range
  if (!promotions?.sideBanner.enabled || isDismissed) {
    return null;
  }

  // Check date range if specified
  const now = new Date().toISOString();
  const start = promotions.sideBanner.start;
  const end = promotions.sideBanner.end;
  
  if (start && now < start) return null;
  if (end && now > end) return null;

  const placement = promotions.sideBanner.placement === 'left' ? 'left-4' : 'right-4';

  return (
    <div 
      className={`fixed ${placement} top-1/2 transform -translate-y-1/2 z-50 bg-brand-gold text-brand-navy p-4 rounded-xl shadow-2xl max-w-xs hidden lg:block animate-slide-in-right`}
      data-testid="side-banner"
    >
      <button 
        onClick={dismissBanner} 
        className="absolute top-2 right-2 text-brand-navy hover:text-red-600 transition-colors"
        data-testid="side-banner-dismiss"
        aria-label="Dismiss banner"
      >
        <X className="w-4 h-4" />
      </button>
      <div className="pr-6">
        <div className="mb-3">
          <p className="text-sm font-semibold">{promotions.sideBanner.message}</p>
        </div>
        <Link 
          href={promotions.sideBanner.link} 
          className="inline-block bg-brand-navy text-brand-gold px-3 py-1 rounded-lg text-sm font-semibold hover:bg-gray-800 transition-colors"
          data-testid="side-banner-cta"
        >
          Learn More
        </Link>
      </div>
    </div>
  );
}
