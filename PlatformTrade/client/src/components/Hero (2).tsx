import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import heroImage from "@assets/generated_images/hero_workspace_background.png";
import { Shield, Clock, Users } from "lucide-react";

export default function Hero() {
  return (
    <div className="relative min-h-[500px] md:min-h-[600px] flex items-center justify-center overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${heroImage})` }}
      />
      <div className="absolute inset-0 bg-gradient-to-r from-background/95 via-background/80 to-background/70" />
      
      <div className="relative z-10 max-w-7xl mx-auto px-4 py-24 text-center">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6" data-testid="text-hero-title">
          Trade Gift Cards, Crypto & Gadgets
        </h1>
        <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto" data-testid="text-hero-subtitle">
          Fast, secure, and trusted by thousands. Get the best rates for your gift cards, 
          buy and sell cryptocurrency, or trade your gadgets with ease.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
          <Link href="/gift-cards">
            <Button size="lg" data-testid="button-hero-get-started" asChild>
              <span>Get Started</span>
            </Button>
          </Link>
          <Link href="/gadgets">
            <Button size="lg" variant="outline" className="backdrop-blur-sm bg-background/50" data-testid="button-hero-browse-gadgets" asChild>
              <span>Browse Gadgets</span>
            </Button>
          </Link>
        </div>

        <div className="flex flex-wrap gap-6 justify-center items-center text-sm">
          <div className="flex items-center gap-2" data-testid="trust-indicator-customers">
            <Users className="w-5 h-5 text-primary" />
            <span className="text-muted-foreground">5,000+ Customers</span>
          </div>
          <div className="flex items-center gap-2" data-testid="trust-indicator-response">
            <Clock className="w-5 h-5 text-primary" />
            <span className="text-muted-foreground">15 Min Response</span>
          </div>
          <div className="flex items-center gap-2" data-testid="trust-indicator-secure">
            <Shield className="w-5 h-5 text-primary" />
            <span className="text-muted-foreground">100% Secure</span>
          </div>
        </div>
      </div>
    </div>
  );
}
