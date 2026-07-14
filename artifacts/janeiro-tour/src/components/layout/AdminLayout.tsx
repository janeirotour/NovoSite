import { ReactNode, useState, useEffect } from "react";
import { Link, useLocation, useSearch } from "wouter";
import { useGetAdminMe, useAdminLogout } from "@workspace/api-client-react";
import {
  BarChart3, Compass, Package2, MapPin, FileText, Monitor,
  ClipboardList, CalendarDays, Star, HelpCircle, Tag, Home, Settings,
  LogOut, ExternalLink, Menu, X, Globe, ChevronDown, ChevronRight, TrendingUp, BedDouble,
} from "lucide-react";

type NavItem = { tab: string; label: string; icon: React.ElementType };
type NavGroup = { group: string; items: NavItem[] };

const NAV: NavGroup[] = [
  {
    group: "Business",
    items: [
      { tab: "overview", label: "Dashboard", icon: BarChart3 },
      { tab: "reservations", label: "Reservations", icon: ClipboardList },
      { tab: "availability", label: "Availability", icon: CalendarDays },
    ],
  },
  {
    group: "Website Content",
    items: [
      { tab: "tours", label: "Tours", icon: Compass },
      { tab: "packages", label: "Packages", icon: Package2 },
      { tab: "group-programs", label: "Group Programs", icon: Globe },
      { tab: "hotels", label: "Hotels & Accommodation", icon: BedDouble },
      { tab: "destinations", label: "Destinations", icon: MapPin },
      { tab: "blog", label: "Travel Guide", icon: FileText },
      { tab: "extras", label: "Tour Extras", icon: Tag },
      { tab: "editor", label: "Page Editor", icon: Monitor },
    ],
  },
  {
    group: "Engagement",
    items: [
      { tab: "reviews", label: "Reviews & Ratings", icon: Star },
      { tab: "faqs", label: "FAQs", icon: HelpCircle },
      { tab: "blog-monetization", label: "Blog Monetization", icon: TrendingUp },
    ],
  },
  {
    group: "Settings & SEO",
    items: [
      { tab: "homepage", label: "Homepage Content", icon: Home },
      { tab: "settings", label: "Settings & SEO", icon: Settings },
    ],
  },
];

function getActiveTab(search: string) {
  return new URLSearchParams(search).get("tab") ?? "overview";
}

export function AdminLayout({ children }: { children: ReactNode }) {
  const [location, setLocation] = useLocation();
  const search = useSearch();
  const activeTab = getActiveTab(search);
  const { data: admin, isLoading, isError } = useGetAdminMe();
  const logout = useAdminLogout();
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    if (!isLoading && (isError || !admin)) {
      setLocation("/admin");
    }
  }, [isLoading, isError, admin, setLocation]);

  if (isLoading || !admin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F5F3EE]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#1B4332] animate-pulse" />
          <p className="text-sm text-[#6B7280]">Loading…</p>
        </div>
      </div>
    );
  }

  const handleLogout = () => {
    logout.mutate(undefined, { onSuccess: () => setLocation("/admin") });
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="px-5 py-5 border-b border-white/8 flex items-center gap-3">
        <img
          src="/janeiro-logo.png"
          alt="Janeiro Tour"
          className="h-9 w-auto brightness-0 invert opacity-90"
          onError={e => (e.target as HTMLImageElement).style.display = "none"}
        />
        <div>
          <p className="font-bold text-white text-sm leading-tight">Janeiro Tour</p>
          <p className="text-[11px] text-white/40 leading-tight">Admin Portal</p>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-5">
        {NAV.map(({ group, items }) => (
          <div key={group}>
            <p className="text-[10px] uppercase tracking-widest font-semibold text-white/35 px-3 mb-1.5">
              {group}
            </p>
            <div className="space-y-0.5">
              {items.map(({ tab, label, icon: Icon }) => {
                const isActive = activeTab === tab;
                return (
                  <Link
                    key={tab}
                    href={`/admin/dashboard?tab=${tab}`}
                    onClick={() => setMobileOpen(false)}
                    className={[
                      "flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-all duration-150",
                      isActive
                        ? "bg-[#1B4332] text-white font-medium shadow-sm"
                        : "text-white/55 hover:text-white/90 hover:bg-white/6",
                    ].join(" ")}
                  >
                    <Icon
                      className={`w-4 h-4 shrink-0 ${isActive ? "text-[#4ade80]" : "text-white/40"}`}
                    />
                    {label}
                    {isActive && <ChevronRight className="ml-auto w-3 h-3 text-white/30" />}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* Footer */}
      <div className="p-3 border-t border-white/8 space-y-1">
        <a
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-white/50 hover:text-white/80 hover:bg-white/6 transition-colors"
        >
          <Globe className="w-4 h-4 text-white/35" />
          View Live Site
          <ExternalLink className="w-3 h-3 ml-auto text-white/25" />
        </a>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-white/50 hover:text-red-400 hover:bg-red-500/10 transition-colors"
        >
          <LogOut className="w-4 h-4 text-white/35" />
          Sign Out
        </button>
        <div className="flex items-center gap-2.5 px-3 py-2 mt-1">
          <div className="w-7 h-7 rounded-full bg-[#1B4332] border border-white/15 flex items-center justify-center shrink-0">
            <span className="text-xs font-bold text-[#4ade80]">
              {(admin?.username ?? "A")[0].toUpperCase()}
            </span>
          </div>
          <div className="min-w-0">
            <p className="text-xs font-medium text-white/75 truncate">{admin?.username}</p>
            <p className="text-[10px] text-white/30">Administrator</p>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen flex bg-[#F5F3EE]">
      {/* Desktop sidebar */}
      <aside className="hidden md:flex w-56 shrink-0 flex-col bg-[#111827] fixed inset-y-0 left-0 z-30">
        <SidebarContent />
      </aside>

      {/* Mobile sidebar backdrop */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-40 md:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Mobile sidebar */}
      <aside
        className={[
          "fixed inset-y-0 left-0 z-50 w-64 bg-[#111827] flex flex-col transition-transform duration-200 md:hidden",
          mobileOpen ? "translate-x-0" : "-translate-x-full",
        ].join(" ")}
      >
        <SidebarContent />
      </aside>

      {/* Main content */}
      <div className="flex-1 md:ml-56 flex flex-col min-h-screen">
        {/* Mobile topbar */}
        <header className="md:hidden sticky top-0 z-20 bg-white border-b border-gray-200 px-4 py-3 flex items-center gap-3">
          <button
            onClick={() => setMobileOpen(true)}
            className="p-1.5 rounded-lg text-gray-500 hover:bg-gray-100"
          >
            <Menu className="w-5 h-5" />
          </button>
          <img
            src="/janeiro-logo.png"
            alt="Janeiro Tour"
            className="h-7 w-auto"
            onError={e => (e.target as HTMLImageElement).style.display = "none"}
          />
        </header>

        <main className="flex-1 p-6 md:p-8 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
