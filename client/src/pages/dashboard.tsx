import { Layout } from "@/components/Layout";
import { useStudy } from "@/lib/study-context";
import { 
  Calendar, 
  Clock, 
  AlertCircle, 
  CheckCircle2, 
  ArrowRight,
  BookOpen,
  Trophy
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { differenceInDays, parseISO } from "date-fns";
import heroImage from "@assets/generated_images/study_hero_background.png";
import { cn } from "@/lib/utils";
import { LogStudyDialog } from "@/components/LogStudyDialog";
import { Link } from "wouter";

export default function Dashboard() {
  const { subjects, problems, logs, searchQuery, user } = useStudy();
  
  // Filter by search query
  const filteredSubjects = subjects.filter(s => 
    s.name.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  // Sort subjects: Red (lowest score) first
  const sortedSubjects = [...filteredSubjects].sort((a, b) => a.studyScore - b.studyScore);

  // Filter problems by search query
  const filteredProblems = problems.filter(p => 
    p.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (subjects.find(s => s.id === p.subjectId)?.name || "").toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Sort problems: Problems from Red subjects first
  const activeProblems = filteredProblems.filter(p => p.status === "active").sort((a, b) => {
    const subjectA = subjects.find(s => s.id === a.subjectId);
    const subjectB = subjects.find(s => s.id === b.subjectId);
    return (subjectA?.studyScore || 0) - (subjectB?.studyScore || 0);
  });

  const today = new Date();

  const getDaysLeft = (dateStr: string) => {
    try {
      if (!dateStr) return 0;
      const days = differenceInDays(parseISO(dateStr), today);
      return isNaN(days) ? 0 : days;
    } catch {
      return 0;
    }
  };

  const getSubjectColor = (score: number) => {
    if (score >= 80) return "bg-emerald-100 border-emerald-200 text-emerald-900 dark:bg-emerald-900/20 dark:border-emerald-800 dark:text-emerald-100";
    if (score >= 50) return "bg-amber-100 border-amber-200 text-amber-900 dark:bg-amber-900/20 dark:border-amber-800 dark:text-amber-100";
    return "bg-rose-100 border-rose-200 text-rose-900 dark:bg-rose-900/20 dark:border-rose-800 dark:text-rose-100";
  };
  
  const getProgressColor = (score: number) => {
    if (score >= 80) return "bg-emerald-500";
    if (score >= 50) return "bg-amber-500";
    return "bg-rose-500";
  };

  return (
    <Layout>
      <div className="space-y-8">
        {/* Hero Section */}
        <div className="relative overflow-hidden rounded-2xl border bg-card text-card-foreground paper-shadow transition-all hover:shadow-lg">
          <div className="absolute inset-0 z-0">
             <div className="absolute inset-0 bg-gradient-to-r from-background via-background/90 to-transparent z-10"></div>
             <img 
              src={heroImage} 
              alt="Study Environment" 
              className="h-full w-full object-cover opacity-80"
            />
          </div>
          
          <div className="relative z-20 p-8 md:p-10 flex flex-col md:flex-row items-start justify-between gap-6">
            <div className="max-w-xl space-y-3">
              <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20 mb-2">
                Exam Season
              </Badge>
              <h1 className="text-3xl font-serif font-bold tracking-tight text-foreground sm:text-4xl">
                Keep up the momentum, {user ? user.name : "Student"}!
              </h1>
              <p className="text-muted-foreground text-lg leading-relaxed">
                You have <span className="font-semibold text-foreground">{subjects.length} exams</span> coming up. Focus on the red subjects to improve your scores.
              </p>
              <div className="flex gap-3 pt-2">
                <LogStudyDialog>
                  <Button className="font-medium shadow-md hover:shadow-lg transition-all" data-testid="button-start-session-hero">
                    Start Study Session
                  </Button>
                </LogStudyDialog>
                <Link href="/calendar">
                  <Button variant="outline" className="bg-background/50 backdrop-blur-sm hover:bg-background/80" data-testid="button-view-calendar">
                    View Calendar
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-12">
          
          {/* Main Content - Subject Cards */}
          <div className="col-span-12 lg:col-span-8 space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-serif font-semibold tracking-tight">Your Subjects</h2>
              <Link href="/subjects">
                <Button variant="ghost" className="text-primary hover:text-primary/80 hover:bg-primary/5">
                  View All <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {sortedSubjects.map((subject) => {
                const daysLeft = getDaysLeft(subject.examDate);
                const colorClass = getSubjectColor(subject.studyScore);
                const progressClass = getProgressColor(subject.studyScore);
                
                return (
                  <div 
                    key={subject.id} 
                    className={cn(
                      "group relative flex flex-col justify-between rounded-xl border p-5 transition-all hover:shadow-md hover:-translate-y-1",
                      colorClass
                    )}
                    data-testid={`subject-card-${subject.id}`}
                  >
                    <div className="space-y-3">
                      <div className="flex justify-between items-start">
                        <div className="rounded-full bg-white/50 p-2 dark:bg-black/20">
                          <BookOpen className="h-5 w-5 opacity-80" />
                        </div>
                        <Badge variant="outline" className="bg-white/50 backdrop-blur-sm border-current/20 font-mono">
                          {daysLeft} days left
                        </Badge>
                      </div>
                      
                      <div>
                        <h3 className="font-serif font-semibold text-lg">{subject.name}</h3>
                        <p className="text-sm opacity-80 mt-1">Exam: {subject.examDate}</p>
                      </div>
                    </div>
                    
                    <div className="mt-6 space-y-2">
                       <div className="flex justify-between text-xs font-medium opacity-80">
                          <span>Preparedness</span>
                          <span>{subject.studyScore}%</span>
                       </div>
                       <div className="h-2 w-full bg-black/5 rounded-full overflow-hidden dark:bg-white/10">
                          <div 
                            className={cn("h-full rounded-full transition-all duration-500", progressClass)} 
                            style={{ width: `${subject.studyScore}%` }}
                          ></div>
                       </div>
                    </div>
                  </div>
                );
              })}
              
              {sortedSubjects.length === 0 && (
                <div className="col-span-2 text-center py-10 border border-dashed rounded-xl text-muted-foreground">
                   No subjects found.
                </div>
              )}
            </div>

            {/* Recent Study Logs Preview */}
            <div className="pt-6">
               <h2 className="text-xl font-serif font-semibold tracking-tight mb-4">Recent Activity</h2>
               <div className="space-y-3">
                  {logs.length > 0 ? logs.slice(0, 3).map((log) => {
                    const subject = subjects.find(s => s.id === log.subjectId);
                    return (
                      <div key={log.id} className="flex items-center gap-4 p-4 rounded-lg border bg-card hover:bg-secondary/20 transition-colors">
                         <div className="h-10 w-10 rounded-full bg-primary/10 text-primary flex items-center justify-center">
                            <Clock className="h-5 w-5" />
                         </div>
                         <div className="flex-1">
                            <div className="flex justify-between">
                               <h4 className="font-medium text-foreground">{subject?.name}</h4>
                               <span className="text-xs text-muted-foreground">{log.date}</span>
                            </div>
                            <p className="text-sm text-muted-foreground line-clamp-1">{log.description}</p>
                         </div>
                         <div className="text-sm font-mono font-medium text-foreground">
                            {log.durationMinutes}m
                         </div>
                      </div>
                    )
                  }) : (
                    <div className="text-center p-8 text-muted-foreground border border-dashed rounded-lg">
                      No logs yet. Start studying!
                    </div>
                  )}
               </div>
            </div>
          </div>

          {/* Sidebar - Problem Tracker */}
          <div className="col-span-12 lg:col-span-4 space-y-6">
            <Card className="border-l-4 border-l-primary shadow-sm flex flex-col" style={{ maxHeight: 'calc(100vh - 150px)' }}>
              <CardHeader className="flex-shrink-0">
                <CardTitle className="flex items-center gap-2 font-serif">
                  <AlertCircle className="h-5 w-5 text-primary" />
                  Problem Tracker
                </CardTitle>
                <CardDescription>
                   Focus areas that need your attention.
                </CardDescription>
              </CardHeader>
              <CardContent className="px-0 flex-1 overflow-y-auto">
                <div className="px-6">
                  <div className="space-y-4">
                    {activeProblems.length === 0 && (
                      <div className="text-center p-4 text-muted-foreground text-sm">
                        No active problems. You're doing great!
                      </div>
                    )}
                    
                    {activeProblems.map((problem) => {
                       const subject = subjects.find(s => s.id === problem.subjectId);
                       // Add a visual indicator if subject is red (low score)
                       const isUrgent = (subject?.studyScore || 0) < 50;
                       
                       return (
                         <div key={problem.id} className={cn(
                           "p-3 rounded-lg border transition-all relative group",
                           isUrgent 
                             ? "bg-rose-50 border-rose-200 text-rose-900 dark:bg-rose-900/10 dark:border-rose-800 dark:text-rose-100" 
                             : "bg-amber-50 border-amber-200 text-amber-900 dark:bg-amber-900/10 dark:border-amber-800 dark:text-amber-100"
                         )}>
                            <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                               <Button size="icon" variant="ghost" className="h-6 w-6 hover:bg-white/50">
                                  <CheckCircle2 className="h-4 w-4" />
                               </Button>
                            </div>
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-xs font-semibold uppercase tracking-wider opacity-70 block">
                                 {subject?.name}
                              </span>
                              {isUrgent && (
                                <span className="h-2 w-2 rounded-full bg-rose-500 animate-pulse" title="Low subject score"></span>
                              )}
                            </div>
                            <p className="text-sm font-medium leading-snug">
                               {problem.description}
                            </p>
                            <div className="mt-2 flex items-center gap-1 text-xs opacity-70">
                               <Clock className="h-3 w-3" />
                               <span>Added {problem.createdAt}</span>
                            </div>
                         </div>
                       );
                    })}
                    
                    {problems.filter(p => p.status === "refresh").length > 0 && (
                      <>
                        <div className="relative py-2">
                           <div className="absolute inset-0 flex items-center">
                              <span className="w-full border-t" />
                           </div>
                           <div className="relative flex justify-center text-xs uppercase">
                              <span className="bg-card px-2 text-muted-foreground">Review Needed</span>
                           </div>
                        </div>
                        
                        {problems.filter(p => p.status === "refresh").map((problem) => {
                           const subject = subjects.find(s => s.id === problem.subjectId);
                           return (
                             <div key={problem.id} className="p-3 rounded-lg bg-secondary/50 border border-border opacity-70">
                                <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1 block">
                                   {subject?.name}
                                </span>
                                <p className="text-sm font-medium text-muted-foreground">
                                   {problem.description}
                                </p>
                             </div>
                           );
                        })}
                      </>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
        </div>
      </div>
    </Layout>
  );
}
