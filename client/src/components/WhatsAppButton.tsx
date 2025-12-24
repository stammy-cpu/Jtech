import { Button } from "@/components/ui/button";
import { SiWhatsapp } from "react-icons/si";

export default function WhatsAppButton() {
  return (
    <a
      href="https://wa.me/1234567890"
      target="_blank"
      rel="noopener noreferrer"
      className="hidden md:block fixed bottom-8 right-8 z-50 hover:scale-110 transition-transform"
      data-testid="button-whatsapp-float"
    >
      <Button size="icon" className="w-14 h-14 rounded-full shadow-2xl bg-green-600 text-white border-green-700">
        <SiWhatsapp className="w-6 h-6" />
      </Button>
    </a>
  );
}
