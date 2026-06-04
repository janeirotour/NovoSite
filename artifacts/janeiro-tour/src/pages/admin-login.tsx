import { useState, useEffect } from "react";
  import { useLocation } from "wouter";
  import { useAdminLogin, useGetAdminMe } from "@workspace/api-client-react";
  import { Button } from "@/components/ui/button";
  import { Input } from "@/components/ui/input";
  import { Label } from "@/components/ui/label";
  import { useQueryClient } from "@tanstack/react-query";
  import { getGetAdminMeQueryKey } from "@workspace/api-client-react";
  import { Shield, Eye, EyeOff } from "lucide-react";

  export default function AdminLoginPage() {
    const [, setLocation] = useLocation();
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState("");
    const queryClient = useQueryClient();

    const { data: me } = useGetAdminMe();

    useEffect(() => {
      if (me) setLocation("/admin/dashboard");
    }, [me, setLocation]);

    const login = useAdminLogin({
      mutation: {
        onSuccess: async () => {
          await queryClient.invalidateQueries({ queryKey: getGetAdminMeQueryKey() });
          setLocation("/admin/dashboard");
        },
        onError: () => {
          setError("Invalid username or password");
        },
      },
    });

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      setError("");
      login.mutate({ data: { username, password } });
    };

    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral-950 px-4">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-accent/10" />
        <div className="relative w-full max-w-md">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-primary/30">
              <Shield size={28} className="text-primary-foreground" />
            </div>
            <h1 className="text-2xl font-bold text-white">Janeiro Tour Admin</h1>
            <p className="text-white/50 text-sm mt-1">Content Management System</p>
          </div>
          <div className="bg-neutral-900 border border-white/10 rounded-2xl p-8 shadow-2xl">
            <h2 className="text-xl font-semibold text-white mb-6">Sign In</h2>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-1.5">
                <Label htmlFor="username" className="text-white/70 text-sm">Username</Label>
                <Input id="username" value={username} onChange={e => setUsername(e.target.value)} placeholder="admin"
                  className="bg-white/5 border-white/10 text-white placeholder:text-white/30 focus:border-primary h-11"
                  autoComplete="username" required />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="password" className="text-white/70 text-sm">Password</Label>
                <div className="relative">
                  <Input id="password" type={showPassword ? "text" : "password"} value={password}
                    onChange={e => setPassword(e.target.value)} placeholder="••••••••"
                    className="bg-white/5 border-white/10 text-white placeholder:text-white/30 focus:border-primary h-11 pr-10"
                    autoComplete="current-password" required />
                  <button type="button" onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/70">
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>
              {error && (
                <div className="bg-red-500/10 border border-red-500/30 rounded-lg px-4 py-3 text-red-400 text-sm">{error}</div>
              )}
              <Button type="submit" className="w-full h-11 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold" disabled={login.isPending}>
                {login.isPending ? "Signing in..." : "Sign In"}
              </Button>
            </form>
            <p className="text-white/30 text-xs text-center mt-6">Default credentials: admin / admin123</p>
          </div>
        </div>
      </div>
    );
  }
  