import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { 
  LayoutGrid, 
  Database, 
  Settings, 
  FolderKanban, 
  PieChart, 
  Users,
  Bell,
  Search,
  Command,
  Plus
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function Sidebar() {
  const [location] = useLocation();

  const navItems = [
    { href: "/", label: "Dashboard", icon: LayoutGrid },
    { href: "/projects", label: "Projects", icon: FolderKanban },
    { href: "/data", label: "Data Sources", icon: Database },
    { href: "/analytics", label: "Analytics", icon: PieChart },
    { href: "/team", label: "Team", icon: Users },
    { href: "/settings", label: "Settings", icon: Settings },
  ];

  return (
    <aside className="fixed left-0 top-0 z-40 h-screen w-64 border-r bg-sidebar text-sidebar-foreground transition-transform">
      <div className="flex h-16 items-center border-b border-sidebar-border px-6">
        <div className="flex items-center gap-2 font-display font-bold text-xl tracking-tight">
          <div className="h-8 w-8 rounded-lg bg-primary/20 flex items-center justify-center border border-primary/50">
            <span className="text-primary text-lg">A</span>
          </div>
          <span className="bg-gradient-to-r from-white to-white/60 bg-clip-text text-transparent">Artifex</span>
        </div>
      </div>

      <div className="px-4 py-6">
        <div className="mb-6 px-2">
          <Button variant="outline" className="w-full justify-start gap-2 bg-sidebar-accent/50 border-sidebar-border text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground group" data-testid="button-new-project">
            <div className="flex h-5 w-5 items-center justify-center rounded bg-primary/20 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
              <Plus className="h-3.5 w-3.5" />
            </div>
            New Project
          </Button>
        </div>

        <nav className="space-y-1">
          {navItems.map((item) => {
            const isActive = location === item.href;
            return (
              <Link 
                key={item.href} 
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200 group",
                  isActive 
                    ? "bg-sidebar-primary/10 text-sidebar-primary shadow-[inset_3px_0_0_0_hsl(var(--sidebar-primary))]" 
                    : "text-muted-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                )}
                data-testid={`nav-link-${item.label.toLowerCase()}`}
              >
                <item.icon className={cn(
                  "h-4 w-4 transition-colors",
                  isActive ? "text-sidebar-primary" : "text-muted-foreground group-hover:text-sidebar-accent-foreground"
                )} />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="absolute bottom-0 left-0 w-full border-t border-sidebar-border bg-sidebar p-4">
        <div className="flex items-center gap-3 rounded-lg bg-sidebar-accent/30 p-3 border border-sidebar-border/50">
          <div className="h-8 w-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-xs font-bold text-white ring-2 ring-background">
            JD
          </div>
          <div className="flex-1 overflow-hidden">
            <p className="truncate text-sm font-medium text-sidebar-foreground">Jane Designer</p>
            <p className="truncate text-xs text-muted-foreground">Lead Creative</p>
          </div>
        </div>
      </div>
    </aside>
  );
}

export function Topbar() {
  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b bg-background/80 px-6 backdrop-blur-xl transition-all">
      <div className="flex items-center gap-4 lg:hidden">
        {/* Mobile menu trigger would go here */}
      </div>

      <div className="flex flex-1 items-center gap-4">
        <div className="relative w-full max-w-md hidden md:block group">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
          <Input
            type="search"
            placeholder="Search projects, assets, or data..."
            className="w-full bg-secondary/50 pl-9 border-transparent focus-visible:ring-primary/20 transition-all hover:bg-secondary/80 focus:bg-background focus:border-primary/30"
            data-testid="input-global-search"
          />
          <div className="absolute right-2.5 top-2.5 hidden items-center gap-1 text-xs text-muted-foreground md:flex">
            <Command className="h-3 w-3" />
            <span>K</span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" className="relative text-muted-foreground hover:text-foreground" data-testid="button-notifications">
          <Bell className="h-5 w-5" />
          <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-primary ring-2 ring-background animate-pulse"></span>
        </Button>
        <div className="h-6 w-px bg-border/50"></div>
        <div className="flex items-center gap-2">
           <span className="text-xs font-medium text-muted-foreground hidden sm:inline-block">v2.4.0-beta</span>
        </div>
      </div>
    </header>
  );
}

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background font-sans text-foreground selection:bg-primary/20">
      <Sidebar />
      <div className="pl-64 transition-all">
        <Topbar />
        <main className="p-6 md:p-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
          {children}
        </main>
      </div>
    </div>
  );
}
