import { Switch, Route, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";

// Import pages
import Home from "@/pages/Home";
import Menu from "@/pages/Menu";
import Events from "@/pages/Events";
import EventDetails from "@/pages/EventDetails";
import Reserve from "@/pages/Reserve";
import Gallery from "@/pages/Gallery";
import Contact from "@/pages/Contact";
import Privacy from "@/pages/Privacy";
import Terms from "@/pages/Terms";
import Landing from "@/pages/Landing";
import Setup from "@/pages/Setup";
import NotFound from "@/pages/not-found";

// Admin pages
import AdminDashboard from "@/pages/admin/Dashboard";
import AdminSettings from "@/pages/admin/Settings";
import AdminMenuManager from "@/pages/admin/MenuManager";
import AdminEventsManager from "@/pages/admin/EventsManager";
import AdminReservationsViewer from "@/pages/admin/ReservationsViewer";
import AdminPromotionsManager from "@/pages/admin/PromotionsManager";
import AdminLandingManager from "@/pages/admin/LandingManager";
import AdminGalleryManager from "@/pages/admin/GalleryManager";
import AdminLogin from "@/pages/admin/Login";
import AdminUserManager from "@/pages/admin/UserManager";
import AdminAuditLog from "@/pages/admin/AuditLog";
import ProtectedRoute from "@/components/admin/ProtectedRoute";

import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import SideBanner from "@/components/SideBanner";
import type { Promotions } from "@shared/schema";

function PromotionalWrapper({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();
  const { data: promotions } = useQuery<Promotions>({
    queryKey: ['/api/promotions']
  });

  // Check if we should redirect to landing page
  useEffect(() => {
    if (promotions?.landing.enabled && promotions.landing.redirectAllRoutes) {
      // Check if user has bypassed landing (clicked Enter Website)
      const bypassLanding = sessionStorage.getItem('bypassLanding');
      if (bypassLanding) {
        return;
      }
      
      const now = new Date().toISOString();
      const start = promotions.landing.start;
      const end = promotions.landing.end;
      
      const shouldRedirect = (!start || now >= start) && (!end || now <= end);
      
      if (shouldRedirect && !location.startsWith('/admin') && location !== '/landing') {
        window.location.href = '/landing';
      }
    }
  }, [promotions, location]);

  // Don't show navigation/footer on landing page or admin routes
  const isLandingPage = location === '/landing';
  const isAdminRoute = location.startsWith('/admin');
  const showLayout = !isLandingPage && !isAdminRoute;

  return (
    <>
      {showLayout && <Navigation />}
      <SideBanner />
      {children}
      {showLayout && <Footer />}
    </>
  );
}

function Router() {
  return (
    <Switch>
      {/* Public Routes */}
      <Route path="/" component={Home} />
      <Route path="/menu" component={Menu} />
      <Route path="/events" component={Events} />
      <Route path="/events/:slug" component={EventDetails} />
      <Route path="/reserve" component={Reserve} />
      <Route path="/gallery" component={Gallery} />
      <Route path="/contact" component={Contact} />
      <Route path="/privacy" component={Privacy} />
      <Route path="/terms" component={Terms} />
      <Route path="/landing" component={Landing} />
      <Route path="/setup" component={Setup} />
      
      {/* Admin Routes */}
      <Route path="/admin/login" component={AdminLogin} />
      <Route path="/admin">
        <ProtectedRoute>
          <AdminDashboard />
        </ProtectedRoute>
      </Route>
      <Route path="/admin/settings">
        <ProtectedRoute>
          <AdminSettings />
        </ProtectedRoute>
      </Route>
      <Route path="/admin/menu">
        <ProtectedRoute>
          <AdminMenuManager />
        </ProtectedRoute>
      </Route>
      <Route path="/admin/events">
        <ProtectedRoute>
          <AdminEventsManager />
        </ProtectedRoute>
      </Route>
      <Route path="/admin/reservations">
        <ProtectedRoute>
          <AdminReservationsViewer />
        </ProtectedRoute>
      </Route>
      <Route path="/admin/promotions">
        <ProtectedRoute>
          <AdminPromotionsManager />
        </ProtectedRoute>
      </Route>
      <Route path="/admin/landing">
        <ProtectedRoute>
          <AdminLandingManager />
        </ProtectedRoute>
      </Route>
      <Route path="/admin/gallery">
        <ProtectedRoute>
          <AdminGalleryManager />
        </ProtectedRoute>
      </Route>
      <Route path="/admin/users">
        <ProtectedRoute>
          <AdminUserManager />
        </ProtectedRoute>
      </Route>
      <Route path="/admin/audit">
        <ProtectedRoute>
          <AdminAuditLog />
        </ProtectedRoute>
      </Route>
      
      {/* Fallback to 404 */}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster theme="dark" position="top-right" />
        <PromotionalWrapper>
          <Router />
        </PromotionalWrapper>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
