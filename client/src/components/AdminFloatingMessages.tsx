import { useState } from "react";
import { MessageCircle, X } from "lucide-react";
import { useLocation } from "wouter";

export default function AdminFloatingMessages() {
  const [, navigate] = useLocation();

  return (
    <button
      onClick={() => navigate("/admin/messages")}
      className="fixed bottom-6 right-6 z-40 w-14 h-14 rounded-full bg-gradient-to-r from-primary to-chart-1 text-white shadow-lg hover:shadow-xl transition-all hover:scale-110 flex items-center justify-center group"
      data-testid="button-admin-messages-float"
      title="View Messages"
    >
      <MessageCircle className="w-6 h-6" />
      <span className="absolute w-2 h-2 bg-chart-2 rounded-full animate-pulse -top-1 -right-1" />
    </button>
  );
}
