import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { 
  LayoutGrid, 
  BookOpen, 
  Calendar as CalendarIcon, 
  BarChart2, 
  Settings,
  Plus,
  Bell,
  Search,
  Command,
  User,
  Menu,
  X,
  AlertTriangle,
  Sun,
  Moon
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { LogStudyDialog } from "@/components/LogStudyDialog";
import { LoginDialog } from "@/components/LoginDialog";
import { useStudy } from "@/lib/study-context";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { differenceInDays, parseISO, isAfter, format } from "date-fns";
import { useState, useEffect } from "react";

function useTheme() {
  const [isDark, setIsDark] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('studyflow_theme');
      if (saved) return saved === 'dark';
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
  });

  useEffect(() => {
    const root = document.documentElement;
    if (isDark) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('studyflow_theme', isDark ? 'dark' : 'light');
  }, [isDark]);

  const toggleTheme = () => setIsDark(!isDark);

  return { isDark, toggleTheme };
}

export function Sidebar() {
  const [location] = useLocation();
  const { subjects } = useStudy();
  const { isDark, toggleTheme } = useTheme();

  const today = new Date();
  const upcomingExams = subjects
    .filter(s => {
      try {
        if (!s.examDate) return false;
        const examDate = parseISO(s.examDate);
        return isAfter(examDate, today) || differenceInDays(examDate, today) === 0;
      } catch {
        return false;
      }
    })
    .sort((a, b) => {
      try {
        return parseISO(a.examDate).getTime() - parseISO(b.examDate).getTime();
      } catch {
        return 0;
      }
    });

  const nearestExam = upcomingExams[0];
  const daysUntilExam = nearestExam 
    ? Math.max(0, differenceInDays(parseISO(nearestExam.examDate), today))
    : null;

  const navItems = [
    { href: "/", label: "Overview", icon: LayoutGrid },
    { href: "/subjects", label: "Subjects", icon: BookOpen },
    { href: "/calendar", label: "Calendar", icon: CalendarIcon },
    { href: "/stats", label: "Statistics", icon: BarChart2 },
    // Removed Settings as requested
  ];

  return (
    <aside className="fixed left-0 top-0 z-40 h-screen w-64 border-r bg-sidebar text-sidebar-foreground transition-transform hidden md:block">
      <div className="flex h-16 items-center justify-between border-b border-sidebar-border px-6">
        <div className="flex items-center gap-2 font-serif font-bold text-xl tracking-tight">
          <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center border border-primary/50 text-primary">
            <BookOpen className="h-4 w-4" />
          </div>
          <span className="text-foreground">StudyFlow</span>
        </div>
        <Button
          variant="outline"
          size="icon"
          onClick={toggleTheme}
          className="h-8 w-8 bg-secondary hover:bg-primary/20 border-primary/30"
          data-testid="button-theme-toggle"
        >
          {isDark ? <Sun className="h-4 w-4 text-yellow-500" /> : <Moon className="h-4 w-4 text-primary" />}
        </Button>
      </div>

      <div className="px-4 py-6">
        <div className="mb-6 px-2">
          <LogStudyDialog />
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
        <div className="rounded-lg bg-sidebar-accent/50 p-3 border border-sidebar-border/50">
           {nearestExam ? (
             <>
               <div className="flex items-center justify-between mb-2">
                 <span className="text-xs font-medium text-muted-foreground truncate max-w-[120px]" title={nearestExam.name}>
                   {nearestExam.name}
                 </span>
                 <span className={cn(
                   "text-xs font-bold",
                   daysUntilExam !== null && daysUntilExam <= 3 ? "text-destructive" : "text-primary"
                 )}>
                   {daysUntilExam === 0 ? "Today!" : `${daysUntilExam} day${daysUntilExam === 1 ? '' : 's'} left`}
                 </span>
               </div>
               <div className="h-1.5 w-full bg-sidebar-border rounded-full overflow-hidden">
                 <div 
                   className={cn(
                     "h-full rounded-full transition-all",
                     daysUntilExam !== null && daysUntilExam <= 3 ? "bg-destructive" : "bg-primary"
                   )} 
                   style={{ width: `${nearestExam.studyScore}%` }}
                 ></div>
               </div>
               <div className="text-[10px] text-muted-foreground mt-1 text-right">
                 {nearestExam.studyScore}% prepared
               </div>
             </>
           ) : (
             <div className="text-xs text-muted-foreground text-center py-2">
               No upcoming exams
             </div>
           )}
        </div>
      </div>
    </aside>
  );
}

export function MobileMenu() {
  const [location, setLocation] = useLocation();
  const { subjects } = useStudy();
  const [isOpen, setIsOpen] = useState(false);
  const { isDark, toggleTheme } = useTheme();

  const today = new Date();
  const upcomingExams = subjects
    .filter(s => {
      try {
        if (!s.examDate) return false;
        const examDate = parseISO(s.examDate);
        return isAfter(examDate, today) || differenceInDays(examDate, today) === 0;
      } catch {
        return false;
      }
    })
    .sort((a, b) => {
      try {
        return parseISO(a.examDate).getTime() - parseISO(b.examDate).getTime();
      } catch {
        return 0;
      }
    });

  const nearestExam = upcomingExams[0];
  const daysUntilExam = nearestExam 
    ? Math.max(0, differenceInDays(parseISO(nearestExam.examDate), today))
    : null;

  const navItems = [
    { href: "/", label: "Overview", icon: LayoutGrid },
    { href: "/subjects", label: "Subjects", icon: BookOpen },
    { href: "/calendar", label: "Calendar", icon: CalendarIcon },
    { href: "/stats", label: "Statistics", icon: BarChart2 },
  ];

  const handleNavClick = (href: string) => {
    setLocation(href);
    setIsOpen(false);
  };

  return (
    <div className="md:hidden">
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setIsOpen(!isOpen)}
        className="text-muted-foreground hover:text-foreground"
        data-testid="button-mobile-menu"
      >
        {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </Button>

      {isOpen && (
        <div className="absolute left-0 top-16 w-full bg-background border-b shadow-lg z-50 animate-in slide-in-from-top-2 duration-200">
          <nav className="p-4 space-y-1">
            {navItems.map((item) => {
              const isActive = location === item.href;
              return (
                <button
                  key={item.href}
                  onClick={() => handleNavClick(item.href)}
                  className={cn(
                    "flex w-full items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-all",
                    isActive
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                  )}
                  data-testid={`mobile-nav-${item.label.toLowerCase()}`}
                >
                  <item.icon className="h-5 w-5" />
                  {item.label}
                </button>
              );
            })}
          </nav>

          <div className="border-t p-4">
            <div className="rounded-lg bg-secondary/50 p-4 border">
              <div className="flex items-center gap-2 mb-2">
                <AlertTriangle className={cn(
                  "h-4 w-4",
                  daysUntilExam !== null && daysUntilExam <= 3 ? "text-destructive" : "text-primary"
                )} />
                <span className="text-sm font-semibold">Next Exam Reminder</span>
              </div>
              {nearestExam ? (
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">{nearestExam.name}</span>
                    <span className={cn(
                      "text-sm font-bold",
                      daysUntilExam !== null && daysUntilExam <= 3 ? "text-destructive" : "text-primary"
                    )}>
                      {daysUntilExam === 0 ? "Today!" : `${daysUntilExam} day${daysUntilExam === 1 ? '' : 's'}`}
                    </span>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {format(parseISO(nearestExam.examDate), "EEEE, MMMM d, yyyy")}
                  </div>
                  <div className="h-2 w-full bg-secondary rounded-full overflow-hidden">
                    <div 
                      className={cn(
                        "h-full rounded-full transition-all",
                        daysUntilExam !== null && daysUntilExam <= 3 ? "bg-destructive" : "bg-primary"
                      )} 
                      style={{ width: `${nearestExam.studyScore}%` }}
                    />
                  </div>
                  <div className="text-xs text-muted-foreground text-right">
                    {nearestExam.studyScore}% prepared
                  </div>
                </div>
              ) : (
                <div className="text-sm text-muted-foreground">
                  No upcoming exams scheduled
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export function Topbar() {
  const { searchQuery, setSearchQuery, problems } = useStudy();
  const activeProblems = problems.filter(p => p.status === "active");

  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b bg-background/80 px-6 backdrop-blur-md transition-all">
      <div className="flex flex-1 items-center gap-4">
        <MobileMenu />
        <div className="relative w-full max-w-md hidden md:block group">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
          <Input
            type="search"
            placeholder="Search subjects or problems..."
            className="w-full bg-secondary/50 pl-9 border-transparent focus-visible:ring-primary/20 transition-all hover:bg-secondary/80 focus:bg-background focus:border-primary/30"
            data-testid="input-global-search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="flex items-center gap-4">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="relative text-muted-foreground hover:text-foreground" data-testid="button-notifications">
              <Bell className="h-5 w-5" />
              {activeProblems.length > 0 && (
                <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-destructive ring-2 ring-background animate-pulse"></span>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80">
            <DropdownMenuLabel>Notifications</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {activeProblems.length > 0 ? (
              <div className="max-h-[300px] overflow-y-auto">
                 <div className="p-2 text-sm font-medium text-muted-foreground bg-secondary/20">
                    You have {activeProblems.length} active problems to work on.
                 </div>
                 {activeProblems.slice(0, 3).map((p) => (
                   <DropdownMenuItem key={p.id} className="flex flex-col items-start gap-1 p-3">
                      <span className="font-semibold">{p.description}</span>
                      <span className="text-xs text-muted-foreground">Needs attention</span>
                   </DropdownMenuItem>
                 ))}
                 {activeProblems.length > 3 && (
                   <div className="p-2 text-center text-xs text-muted-foreground">
                      + {activeProblems.length - 3} more
                   </div>
                 )}
              </div>
            ) : (
              <div className="p-4 text-center text-sm text-muted-foreground">
                No new notifications. Great job!
              </div>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
        
        <LoginDialog />
      </div>
    </header>
  );
}

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background font-sans text-foreground selection:bg-primary/20">
      <Sidebar />
      <div className="md:pl-64 transition-all">
        <Topbar />
        <main className="p-6 md:p-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
          {children}
        </main>
      </div>
    </div>
  );
}
