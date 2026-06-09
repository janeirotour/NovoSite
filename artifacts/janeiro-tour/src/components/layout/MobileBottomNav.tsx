import { Link, useLocation } from "wouter";
import { Home, Compass, MapPin, CalendarDays } from "lucide-react";
import { cn } from "@/lib/utils";
import { useGetSettings } from "@workspace/api-client-react";

function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  );
}

export function MobileBottomNav() {
  const [location] = useLocation();
  const { data: settings } = useGetSettings();
  const whatsappUrl = settings?.contactWhatsapp || "https://wa.me/+5521999999999";

  const isActive = (path: string) => {
    if (path === "/") return location === "/";
    return location.startsWith(path);
  };

  return (
    <nav
      className="lg:hidden fixed bottom-0 inset-x-0 z-40 bg-gray-950 border-t border-white/[0.08]"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      <div className="flex items-end justify-around h-16 px-1">

        {/* Home */}
        <NavItem
          href="/"
          label="Home"
          active={isActive("/")}
          icon={<Home className="w-[22px] h-[22px]" />}
        />

        {/* Experiences */}
        <NavItem
          href="/tours"
          label="Experiences"
          active={isActive("/tours") || isActive("/packages")}
          icon={<Compass className="w-[22px] h-[22px]" />}
        />

        {/* Book — raised center CTA */}
        <Link href="/tours" className="flex flex-col items-center gap-1 pb-2 -mt-5">
          <span className="w-[52px] h-[52px] rounded-2xl bg-[#009743] flex items-center justify-center shadow-[0_4px_20px_rgba(0,151,67,0.45)] active:scale-95 transition-transform">
            <CalendarDays className="w-6 h-6 text-white" />
          </span>
          <span className="text-[10px] font-semibold text-[#009743] tracking-wide">Book</span>
        </Link>

        {/* Destinations */}
        <NavItem
          href="/destinations"
          label="Destinations"
          active={isActive("/destinations")}
          icon={<MapPin className="w-[22px] h-[22px]" />}
        />

        {/* WhatsApp */}
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noreferrer"
          className="flex flex-col items-center gap-1 px-2 pb-3 pt-2 active:scale-95 transition-transform text-[#25D366]"
        >
          <WhatsAppIcon className="w-[22px] h-[22px]" />
          <span className="text-[10px] font-medium text-white/50">WhatsApp</span>
        </a>

      </div>
    </nav>
  );
}

function NavItem({
  href,
  label,
  icon,
  active,
}: {
  href: string;
  label: string;
  icon: React.ReactNode;
  active: boolean;
}) {
  return (
    <Link
      href={href}
      className={cn(
        "flex flex-col items-center gap-1 px-2 pb-3 pt-2 active:scale-95 transition-all",
        active ? "text-[#009743]" : "text-white/40"
      )}
    >
      {icon}
      <span
        className={cn(
          "text-[10px] font-medium",
          active ? "text-[#009743]" : "text-white/40"
        )}
      >
        {label}
      </span>
    </Link>
  );
}
