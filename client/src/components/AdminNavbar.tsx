import { Link, useLocation } from "wouter";
import { LogOut, Package, TrendingUp, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";

export default function AdminNavbar() {
  const [location] = useLocation();
  const { logout } = useAuth();

  const handleLogout = async () => {
    await logout();
  };

  const isActive = (path: string) => location.startsWith(path);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-primary to-primary text-white border-b border-primary/20 shadow-md">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16 md:h-20">
          <Link href="/admin">
            <span className="text-xl md:text-2xl font-bold text-white hover:text-white/90 px-3 py-2 rounded-md cursor-pointer" data-testid="link-admin-home">
              JTECH Admin
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-2">
            <Link href="/admin/trades">
              <Button
                variant={isActive("/admin/trades") ? "default" : "ghost"}
                size="sm"
                className={isActive("/admin/trades") ? "bg-white text-primary" : "text-white hover:bg-white/20"}
                data-testid="link-admin-trades"
              >
                <TrendingUp className="w-4 h-4 mr-2" />
                Trades
              </Button>
            </Link>

            <Link href="/admin/update-rates">
              <Button
                variant={isActive("/admin/update-rates") ? "default" : "ghost"}
                size="sm"
                className={isActive("/admin/update-rates") ? "bg-white text-primary" : "text-white hover:bg-white/20"}
                data-testid="link-admin-rates"
              >
                <TrendingUp className="w-4 h-4 mr-2" />
                Rates
              </Button>
            </Link>

            <Link href="/admin/post-item">
              <Button
                variant={isActive("/admin/post-item") ? "default" : "ghost"}
                size="sm"
                className={isActive("/admin/post-item") ? "bg-white text-primary" : "text-white hover:bg-white/20"}
                data-testid="link-admin-post"
              >
                <Package className="w-4 h-4 mr-2" />
                Post Item
              </Button>
            </Link>

            <Button
              onClick={handleLogout}
              variant="ghost"
              size="sm"
              className="text-white hover:bg-white/20"
              data-testid="button-admin-logout"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
}
