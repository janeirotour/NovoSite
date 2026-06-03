import { MessageCircle } from "lucide-react";
import { useGetSettings } from "@workspace/api-client-react";

export function WhatsAppButton() {
  const { data: settings } = useGetSettings();
  
  const whatsappUrl = settings?.contactWhatsapp || "https://wa.me/+5521999999999";

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noreferrer"
      className="fixed bottom-6 right-6 z-50 bg-[#25D366] text-white p-4 rounded-full shadow-lg hover:scale-110 transition-transform duration-300 hover:shadow-xl group"
      aria-label="Contact on WhatsApp"
    >
      <MessageCircle className="w-8 h-8" />
      
      {/* Tooltip on hover */}
      <span className="absolute right-full top-1/2 -translate-y-1/2 mr-4 bg-white text-foreground px-4 py-2 rounded-lg shadow-md whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none font-medium text-sm border border-border">
        Need help? Chat with us!
      </span>
    </a>
  );
}
