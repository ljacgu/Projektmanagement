import { Layout } from "@/components/Layout";
import { useStudy } from "@/lib/study-context";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Clock, BookOpen, CheckCircle2 } from "lucide-react";

export default function StatsPage() {
  const { logs, subjects, problems } = useStudy();

  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-serif font-bold tracking-tight">Study Logs</h1>
          <p className="text-muted-foreground">A history of all your study sessions and solved problems.</p>
        </div>

        <div className="grid gap-6 md:grid-cols-12">
          <div className="col-span-12 lg:col-span-8">
            <Card className="h-full">
              <CardHeader>
                <CardTitle>Session History</CardTitle>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[600px] pr-4">
                  <div className="space-y-6">
                    {logs.length === 0 ? (
                      <div className="text-center py-12 text-muted-foreground">
                        No study logs yet. Start studying to see your history!
                      </div>
                    ) : (
                      logs.map((log) => {
                        const subject = subjects.find((s) => s.id === log.subjectId);
                        const solvedProblem = log.solvedProblemId 
                          ? problems.find(p => p.id === log.solvedProblemId) 
                          : null;

                        return (
                          <div key={log.id} className="relative pl-6 pb-6 border-l-2 border-muted last:pb-0">
                            <div className="absolute top-0 left-[-9px] h-4 w-4 rounded-full bg-primary ring-4 ring-background" />
                            
                            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-2">
                              <div>
                                <h3 className="font-semibold text-lg">{subject?.name}</h3>
                                <span className="text-sm text-muted-foreground">{log.date}</span>
                              </div>
                              <div className="flex items-center gap-2 bg-secondary/50 px-3 py-1 rounded-full text-sm font-mono">
                                <Clock className="h-3.5 w-3.5" />
                                {log.durationMinutes} min
                              </div>
                            </div>
                            
                            <div className="bg-card border rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow">
                              <p className="text-foreground/90">{log.description}</p>
                              
                              {solvedProblem && (
                                <div className="mt-3 flex items-start gap-2 text-emerald-600 bg-emerald-50 dark:bg-emerald-900/20 dark:text-emerald-400 p-2 rounded text-sm">
                                  <CheckCircle2 className="h-4 w-4 mt-0.5" />
                                  <div>
                                    <span className="font-semibold block">Problem Solved!</span>
                                    <span className="opacity-90">{solvedProblem.description}</span>
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </div>

          <div className="col-span-12 lg:col-span-4 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Total Stats</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-secondary/30 rounded-lg">
                  <span className="text-muted-foreground">Total Sessions</span>
                  <span className="font-mono font-bold text-xl">{logs.length}</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-secondary/30 rounded-lg">
                  <span className="text-muted-foreground">Total Hours</span>
                  <span className="font-mono font-bold text-xl">
                    {Math.round(logs.reduce((acc, log) => acc + log.durationMinutes, 0) / 60 * 10) / 10}
                  </span>
                </div>
                <div className="flex items-center justify-between p-3 bg-secondary/30 rounded-lg">
                   <span className="text-muted-foreground">Problems Solved</span>
                   <span className="font-mono font-bold text-xl text-emerald-600">
                     {logs.filter(l => l.solvedProblemId).length}
                   </span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
}
