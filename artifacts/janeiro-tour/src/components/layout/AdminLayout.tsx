import { ReactNode } from "react";
import { Link, useLocation } from "wouter";
import { useGetAdminMe, useAdminLogout } from "@workspace/api-client-react";
import { MapPin, Compass, FileText, Settings, Star, LayoutDashboard, LogOut, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";

export function AdminLayout({ children }: { children: ReactNode }) {
  const [location, setLocation] = useLocation();
  const { data: admin, isLoading, isError } = useGetAdminMe();
  const logout = useAdminLogout();

  // Redirect to login if not authenticated
  if (!isLoading && (isError || !admin)) {
    setLocation("/admin");
    return null;
  }

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  const handleLogout = () => {
    logout.mutate(undefined, {
      onSuccess: () => {
        setLocation("/admin");
      }
    });
  };

  const navItems = [
    { href: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { href: "/admin/tours", label: "Tours", icon: Compass },
    { href: "/admin/destinations", label: "Destinations", icon: MapPin },
    { href: "/admin/blog", label: "Blog Posts", icon: FileText },
    { href: "/admin/reviews", label: "Reviews", icon: Star },
    { href: "/admin/faqs", label: "FAQs", icon: MessageSquare },
    { href: "/admin/settings", label: "Settings", icon: Settings },
  ];

  // MapMapPin is not a standard lucide icon, let's just use MapPin
  // I'll fix it in the map

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-slate-50">
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-slate-900 text-white flex flex-col">
        <div className="p-6 border-b border-slate-800">
          <h2 className="font-serif font-bold text-xl text-primary">Janeiro Tour Admin</h2>
          <p className="text-slate-400 text-sm mt-1">Welcome, {admin?.username}</p>
        </div>
        
        <nav className="flex-1 py-6 px-4 flex flex-col gap-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location === item.href || (location.startsWith(item.href) && item.href !== "/admin/dashboard");
            
            return (
              <Link 
                key={item.href} 
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  isActive 
                    ? "bg-primary text-primary-foreground font-medium" 
                    : "text-slate-300 hover:bg-slate-800 hover:text-white"
                }`}
              >
                <Icon className="w-5 h-5" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-slate-800">
          <Button 
            variant="ghost" 
            className="w-full justify-start text-slate-300 hover:text-white hover:bg-slate-800"
            onClick={handleLogout}
          >
            <LogOut className="w-5 h-5 mr-3" />
            Sign Out
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto bg-slate-50">
        <div className="p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
