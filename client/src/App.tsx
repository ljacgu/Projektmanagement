import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { StudyProvider } from "@/lib/study-context";
import NotFound from "@/pages/not-found";
import Dashboard from "@/pages/dashboard";
import SubjectsPage from "@/pages/subjects";
import CalendarPage from "@/pages/calendar";
import StatsPage from "@/pages/stats";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Dashboard} />
      <Route path="/subjects" component={SubjectsPage} />
      <Route path="/calendar" component={CalendarPage} />
      <Route path="/stats" component={StatsPage} />
      {/* Fallback to 404 */}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <StudyProvider>
          <Toaster />
          <Router />
        </StudyProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
