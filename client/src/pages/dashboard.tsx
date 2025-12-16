import { Layout } from "@/components/Layout";
import { StatCard, FeatureCard } from "@/components/DashboardCards";
import { mockProjects, mockIntegrations, activityFeed } from "@/lib/mockData";
import { 
  ArrowUpRight, 
  Clock, 
  Layers, 
  Zap, 
  Plus, 
  MoreHorizontal, 
  Filter,
  CheckCircle2,
  AlertCircle,
  Users,
  Database
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import abstractImage from "@assets/generated_images/abstract_creative_data_visualization.png";

export default function Dashboard() {
  return (
    <Layout>
      <div className="space-y-8">
        {/* Welcome Section */}
        <div className="relative overflow-hidden rounded-2xl border bg-card text-card-foreground shadow-sm">
          <div className="absolute inset-0 z-0">
             <div className="absolute inset-0 bg-gradient-to-r from-background via-background/95 to-background/20 z-10"></div>
             <img 
              src={abstractImage} 
              alt="Background" 
              className="h-full w-full object-cover opacity-60 mix-blend-screen"
            />
          </div>
          
          <div className="relative z-20 p-8 md:p-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="max-w-xl space-y-2">
              <h1 className="text-3xl font-display font-bold tracking-tight text-white sm:text-4xl text-glow">
                Welcome back, Jane
              </h1>
              <p className="text-muted-foreground text-lg">
                Your creative data hub is active. You have <span className="text-primary font-medium">3 active projects</span> and <span className="text-emerald-400 font-medium">2 pending reviews</span>.
              </p>
            </div>
            <div className="flex gap-3">
              <Button size="lg" className="bg-white text-black hover:bg-white/90 font-medium" data-testid="button-quick-action">
                <Zap className="mr-2 h-4 w-4" />
                Quick Action
              </Button>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <StatCard 
            title="Total Revenue" 
            value="$45,231.89" 
            change="+20.1% from last month" 
            changeType="positive" 
            icon={Zap} 
          />
          <StatCard 
            title="Active Clients" 
            value="12" 
            change="+2 new this week" 
            changeType="positive" 
            icon={Users} 
          />
          <StatCard 
            title="Data Usage" 
            value="2.4 TB" 
            change="85% of limit" 
            changeType="negative" 
            icon={Database} 
          />
          <StatCard 
            title="Pending Tasks" 
            value="7" 
            change="Due in 24h" 
            changeType="neutral" 
            icon={Clock} 
          />
        </div>

        <div className="grid gap-4 md:grid-cols-7 lg:grid-cols-7">
          
          {/* Main Content Area - Projects */}
          <div className="col-span-4 lg:col-span-5 space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-display font-semibold tracking-tight">Recent Projects</h2>
                <p className="text-sm text-muted-foreground">Manage your creative deliverables and data pipelines.</p>
              </div>
              <div className="flex items-center gap-2">
                 <Button variant="outline" size="sm" className="h-8 gap-1">
                  <Filter className="h-3.5 w-3.5" />
                  Filter
                </Button>
                <Button size="sm" className="h-8 gap-1">
                  <Plus className="h-3.5 w-3.5" />
                  New Project
                </Button>
              </div>
            </div>

            <div className="grid gap-4">
              {mockProjects.map((project) => (
                <div 
                  key={project.id} 
                  className="group flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-lg border bg-card p-4 transition-all hover:bg-accent/5 hover:border-primary/20"
                  data-testid={`project-card-${project.id}`}
                >
                  <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-secondary/50 border border-border/50 group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                      <Layers className="h-6 w-6" />
                    </div>
                    <div>
                      <h3 className="font-medium text-foreground group-hover:text-primary transition-colors">{project.title}</h3>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <span>{project.client}</span>
                        <span className="h-1 w-1 rounded-full bg-border"></span>
                        <span className="flex items-center gap-1">
                           <Clock className="h-3 w-3" /> Due {project.dueDate}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-6 sm:w-1/2 justify-between sm:justify-end">
                     <div className="flex flex-col gap-1 w-32">
                        <div className="flex justify-between text-xs text-muted-foreground">
                          <span>Progress</span>
                          <span>{project.progress}%</span>
                        </div>
                        <Progress value={project.progress} className="h-1.5" />
                     </div>
                     
                     <div className="flex -space-x-2">
                        {project.members.map((member, i) => (
                          <div key={i} className="h-8 w-8 rounded-full bg-secondary border-2 border-background flex items-center justify-center text-xs font-bold ring-2 ring-transparent group-hover:ring-background transition-all">
                             {member[0].toUpperCase()}
                          </div>
                        ))}
                     </div>
                     
                     <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground">
                        <MoreHorizontal className="h-4 w-4" />
                     </Button>
                  </div>
                </div>
              ))}
            </div>

            {/* Integration Status Section */}
            <div className="mt-8 pt-8 border-t border-border/40">
              <h2 className="text-xl font-display font-semibold tracking-tight mb-4">Connected Data Sources</h2>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                 {mockIntegrations.slice(0, 3).map((integration) => (
                    <FeatureCard 
                      key={integration.id}
                      title={integration.name}
                      description={integration.description}
                      icon={integration.icon}
                      className="bg-secondary/20 hover:bg-secondary/30"
                      action={
                        <div className="flex items-center gap-2 text-xs font-medium">
                          {integration.status === "connected" ? (
                            <span className="flex items-center gap-1.5 text-emerald-500">
                              <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                              </span>
                              Connected
                            </span>
                          ) : (
                            <span className="flex items-center gap-1.5 text-rose-500">
                              <AlertCircle className="h-3 w-3" />
                              Error
                            </span>
                          )}
                          <span className="text-muted-foreground ml-auto">{integration.lastSync}</span>
                        </div>
                      }
                    />
                 ))}
              </div>
            </div>
          </div>

          {/* Sidebar Area - Activity & Quick Stats */}
          <div className="col-span-4 lg:col-span-2 space-y-6">
            <Card className="bg-card/50 backdrop-blur-sm border-border/60">
              <CardHeader>
                <CardTitle className="text-lg font-display">Activity Feed</CardTitle>
                <CardDescription>Latest team updates</CardDescription>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[300px] pr-4">
                  <div className="space-y-6">
                    {activityFeed.map((item) => (
                      <div key={item.id} className="flex gap-3 relative">
                         {item.id !== activityFeed.length && (
                            <div className="absolute left-[15px] top-8 bottom-[-24px] w-px bg-border/50"></div>
                         )}
                         <div className="h-8 w-8 rounded-full bg-secondary flex items-center justify-center shrink-0 border border-border">
                            <span className="text-xs font-medium">{item.user.charAt(0)}</span>
                         </div>
                         <div className="space-y-1">
                            <p className="text-sm">
                              <span className="font-medium text-foreground">{item.user}</span>{" "}
                              <span className="text-muted-foreground">{item.action}</span>{" "}
                              <span className="text-primary font-medium">
                                {item.project || item.target}
                              </span>
                            </p>
                            <p className="text-xs text-muted-foreground">{item.time}</p>
                         </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>

            <Card className="bg-primary/5 border-primary/20">
              <CardHeader>
                <CardTitle className="text-lg font-display text-primary flex items-center gap-2">
                  <Zap className="h-4 w-4" />
                  Pro Tip
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  Connect your Figma account to automatically sync asset metadata with your PostgreSQL database.
                </p>
                <Button variant="outline" className="w-full bg-background/50 hover:bg-background border-primary/20 text-primary hover:text-primary">
                  Connect Integration
                </Button>
              </CardContent>
            </Card>
          </div>
          
        </div>
      </div>
    </Layout>
  );
}
