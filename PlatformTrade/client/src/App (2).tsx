import { useEffect } from "react";
import { Switch, Route, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider, useAuth } from "@/context/AuthContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import LandingPage from "@/pages/LandingPage";
import HomePage from "@/pages/HomePage";
import LoginPage from "@/pages/LoginPage";
import RegistrationPage from "@/pages/RegistrationPage";
import GiftCardsPage from "@/pages/GiftCardsPage";
import CryptoPage from "@/pages/CryptoPage";
import GadgetsPage from "@/pages/GadgetsPage";
import GadgetDetailPage from "@/pages/GadgetDetailPage";
import AdminMessagesPage from "@/pages/AdminMessagesPage";
import AdminTradesPage from "@/pages/AdminTradesPage";
import AdminPostItemPage from "@/pages/AdminPostItemPage";
import AdminUpdateRatesPage from "@/pages/AdminUpdateRatesPage";
import UserMessageModal from "@/components/UserMessageModal";
import NotFound from "@/pages/not-found";

function ProtectedAdminRoute({ component: Component }: { component: () => JSX.Element | null }): JSX.Element | null {
  const { user, isLoading } = useAuth();
  const [, navigate] = useLocation();

  useEffect(() => {
    if (!isLoading && !user?.isAdmin) {
      navigate("/login", { replace: true });
    }
  }, [isLoading, user, navigate]);

  if (isLoading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  if (!user?.isAdmin) {
    return <div className="flex items-center justify-center min-h-screen">Redirecting...</div>;
  }

  return <Component />;
}

function Router() {
  return (
    <Switch>
      <Route path="/" component={HomePage} />
      <Route path="/home" component={HomePage} />
      <Route path="/login" component={LoginPage} />
      <Route path="/register" component={RegistrationPage} />
      <Route path="/gift-cards" component={GiftCardsPage} />
      <Route path="/crypto" component={CryptoPage} />
      <Route path="/gadgets" component={GadgetsPage} />
      <Route path="/gadgets/:id" component={GadgetDetailPage} />
      <Route path="/admin">
        <ProtectedAdminRoute component={AdminTradesPage} />
      </Route>
      <Route path="/admin/messages">
        <ProtectedAdminRoute component={AdminMessagesPage} />
      </Route>
      <Route path="/admin/trades">
        <ProtectedAdminRoute component={AdminTradesPage} />
      </Route>
      <Route path="/admin/post-item">
        <ProtectedAdminRoute component={AdminPostItemPage} />
      </Route>
      <Route path="/admin/update-rates">
        <ProtectedAdminRoute component={AdminUpdateRatesPage} />
      </Route>
      <Route component={NotFound} />
    </Switch>
  );
}

function AppContent() {
  const { user } = useAuth();
  const [location] = useLocation();
  const isAuthPage = location === "/login" || location === "/register";
  const isAdminPage = location.startsWith("/admin");

  return (
    <div className="min-h-screen flex flex-col">
      {!isAuthPage && !isAdminPage && <Navbar />}
      <main className="flex-1">
        <Router />
      </main>
      {!isAuthPage && !isAdminPage && <Footer />}
      {!isAuthPage && user && !user.isAdmin && <UserMessageModal />}
      {!isAuthPage && !user && <WhatsAppButton />}
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AuthProvider>
          <AppContent />
          <Toaster />
        </AuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
