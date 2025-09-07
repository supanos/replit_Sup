import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { useLocation } from "wouter";
import type { LandingContent } from "@shared/schema";

export default function LandingPopup() {
  const [isOpen, setIsOpen] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const [, setLocation] = useLocation();

  const { data: landingContent } = useQuery<LandingContent>({
    queryKey: ["/api/landing"],
  });

  useEffect(() => {
    // Only show popup if enabled in settings
    if (landingContent?.popup?.enabled && !sessionStorage.getItem('landingPopupShown')) {
      setTimeLeft(landingContent.popup.duration);
      setIsOpen(true);
      sessionStorage.setItem('landingPopupShown', 'true');
    }
  }, [landingContent]);

  useEffect(() => {
    if (!isOpen || timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          // Time's up - redirect if auto redirect is enabled
          if (landingContent?.popup?.autoRedirect) {
            setIsOpen(false);
            // Optional: redirect to specific page
            // setLocation('/');
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isOpen, timeLeft, landingContent, setLocation]);

  const handleClose = () => {
    setIsOpen(false);
  };

  if (!landingContent?.popup?.enabled || !isOpen) {
    return null;
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="max-w-4xl w-full h-[90vh] p-0 overflow-hidden">
        {/* Close Button and Timer */}
        <div className="absolute top-4 right-4 z-50 flex items-center gap-2">
          {timeLeft > 0 && landingContent.popup.autoRedirect && (
            <div className="bg-black/50 text-white px-3 py-1 rounded-full text-sm font-medium">
              {timeLeft}s
            </div>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClose}
            className="bg-black/50 hover:bg-black/70 text-white h-8 w-8 p-0"
            data-testid="close-landing-popup"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Landing Content */}
        <div className="h-full overflow-y-auto">
          <div
            className="min-h-full relative flex items-center justify-center bg-cover bg-center bg-no-repeat"
            style={{
              backgroundImage: landingContent.hero.backgroundImage
                ? `linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)), url(${landingContent.hero.backgroundImage})`
                : 'linear-gradient(135deg, #0B1B2B 0%, #1a365d 100%)',
            }}
          >
            {/* Hero Section */}
            <div className="relative z-10 text-center text-white px-6 py-12 max-w-4xl mx-auto">
              <h1 className="font-anton text-6xl md:text-8xl mb-4 text-brand-gold drop-shadow-2xl">
                {landingContent.hero.title}
              </h1>
              
              <h2 className="text-2xl md:text-4xl font-bold mb-6 drop-shadow-lg">
                {landingContent.hero.subtitle}
              </h2>
              
              <p className="text-lg md:text-xl mb-8 max-w-2xl mx-auto leading-relaxed opacity-90">
                {landingContent.hero.description}
              </p>

              <Button 
                size="lg"
                className="bg-brand-gold hover:bg-brand-gold/90 text-brand-navy font-bold text-lg px-8 py-3 rounded-full shadow-xl transform hover:scale-105 transition-all duration-300"
                onClick={() => {
                  setIsOpen(false);
                  if (landingContent.hero.ctaLink) {
                    if (landingContent.hero.ctaLink.startsWith('http')) {
                      window.open(landingContent.hero.ctaLink, '_blank');
                    } else {
                      setLocation(landingContent.hero.ctaLink);
                    }
                  }
                }}
                data-testid="popup-cta-button"
              >
                {landingContent.hero.ctaText}
              </Button>
            </div>

            {/* Features Section (if has features) */}
            {landingContent.features && landingContent.features.length > 0 && (
              <div className="absolute bottom-0 left-0 right-0 bg-black/30 backdrop-blur-sm p-6">
                <div className="max-w-6xl mx-auto">
                  <div className="grid md:grid-cols-3 gap-6 text-center text-white">
                    {landingContent.features.slice(0, 3).map((feature, index) => (
                      <div key={index} className="space-y-2">
                        <div className="text-3xl mb-2">{feature.icon}</div>
                        <h3 className="font-bold text-lg">{feature.title}</h3>
                        <p className="text-sm opacity-90">{feature.description}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Special Offer Badge */}
            {landingContent.specialOffer?.enabled && (
              <div className="absolute top-6 left-6 bg-brand-gold text-brand-navy px-4 py-2 rounded-full font-bold text-sm animate-pulse">
                {landingContent.specialOffer.badge || "SPECIAL OFFER"}
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}