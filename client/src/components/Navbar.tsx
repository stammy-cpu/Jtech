import { Link } from "wouter";
import { LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SiWhatsapp } from "react-icons/si";
import { useAuth } from "@/context/AuthContext";

export default function Navbar() {
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b safe-area-top">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-14 md:h-20">
          <Link href="/home">
            <span className="text-lg md:text-2xl font-bold text-primary hover-elevate active-elevate-2 px-2 md:px-3 py-2 rounded-md cursor-pointer" data-testid="link-home">
              JTECH Trading World
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-6">
            <Link href="/gift-cards">
              <span className="text-sm font-medium hover-elevate active-elevate-2 px-3 py-2 rounded-md cursor-pointer" data-testid="link-gift-cards">
                Gift Cards
              </span>
            </Link>
            <Link href="/crypto">
              <span className="text-sm font-medium hover-elevate active-elevate-2 px-3 py-2 rounded-md cursor-pointer" data-testid="link-crypto">
                Crypto
              </span>
            </Link>
            <Link href="/gadgets">
              <span className="text-sm font-medium hover-elevate active-elevate-2 px-3 py-2 rounded-md cursor-pointer" data-testid="link-gadgets">
                Gadgets
              </span>
            </Link>
            {user?.isAdmin && (
              <Link href="/admin">
                <span className="text-sm font-medium hover-elevate active-elevate-2 px-3 py-2 rounded-md cursor-pointer" data-testid="link-admin">
                  Admin
                </span>
              </Link>
            )}
            {user ? (
              <Button onClick={handleLogout} size="sm" variant="outline" className="gap-2" data-testid="button-logout">
                <LogOut className="w-4 h-4" />
                Logout
              </Button>
            ) : (
              <a
                href="https://wa.me/1234567890"
                target="_blank"
                rel="noopener noreferrer"
                data-testid="button-whatsapp-nav"
              >
                <Button size="sm" className="gap-2 bg-green-600 text-white border-green-700">
                  <SiWhatsapp className="w-4 h-4" />
                  WhatsApp
                </Button>
              </a>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
