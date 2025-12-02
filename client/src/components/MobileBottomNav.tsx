import { Link, useLocation } from "wouter";
import { Home, Gift, Bitcoin, Smartphone, User, MessageCircle, LogOut } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { cn } from "@/lib/utils";

interface NavItem {
  icon: React.ElementType;
  label: string;
  href: string;
  isActive?: boolean;
}

export default function MobileBottomNav() {
  const [location] = useLocation();
  const { user, logout } = useAuth();

  const navItems: NavItem[] = [
    {
      icon: Home,
      label: "Home",
      href: "/home",
    },
    {
      icon: Gift,
      label: "Gift Cards",
      href: "/gift-cards",
    },
    {
      icon: Bitcoin,
      label: "Crypto",
      href: "/crypto",
    },
    {
      icon: Smartphone,
      label: "Gadgets",
      href: "/gadgets",
    },
  ];

  const isActive = (href: string) => {
    if (href === "/home") {
      return location === "/home";
    }
    if (location === "/" && href === "/home") {
      return false;
    }
    return location.startsWith(href);
  };

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-background border-t safe-area-bottom">
      <div className="flex items-center justify-around h-16 px-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.href);
          
          return (
            <Link key={item.href} href={item.href}>
              <div
                className={cn(
                  "flex flex-col items-center justify-center min-w-[60px] py-2 px-3 rounded-lg transition-all duration-200",
                  active
                    ? "text-primary"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                <Icon
                  className={cn(
                    "w-5 h-5 mb-1 transition-transform",
                    active && "scale-110"
                  )}
                />
                <span className={cn(
                  "text-[10px] font-medium leading-tight",
                  active && "font-semibold"
                )}>
                  {item.label}
                </span>
              </div>
            </Link>
          );
        })}
        
        {user ? (
          <button
            onClick={() => logout()}
            className="flex flex-col items-center justify-center min-w-[60px] py-2 px-3 rounded-lg text-muted-foreground hover:text-foreground transition-all duration-200"
          >
            <LogOut className="w-5 h-5 mb-1" />
            <span className="text-[10px] font-medium leading-tight">Logout</span>
          </button>
        ) : (
          <a
            href="https://wa.me/1234567890"
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-col items-center justify-center min-w-[60px] py-2 px-3 rounded-lg text-green-600 hover:text-green-500 transition-all duration-200"
          >
            <MessageCircle className="w-5 h-5 mb-1" />
            <span className="text-[10px] font-medium leading-tight">Chat</span>
          </a>
        )}
      </div>
    </nav>
  );
}
