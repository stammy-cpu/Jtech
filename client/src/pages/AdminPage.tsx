import AdminNavbar from "@/components/AdminNavbar";
import AdminFloatingMessages from "@/components/AdminFloatingMessages";
import { useLocation } from "wouter";

export default function AdminPage() {
  const [location] = useLocation();
  
  // Redirect to trades dashboard
  if (location === "/admin") {
    window.location.href = "/admin/trades";
  }

  return (
    <>
      <AdminNavbar />
      <AdminFloatingMessages />
    </>
  );
}
