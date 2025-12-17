import { Layout } from "@/components/Layout";
import { useStudy } from "@/lib/study-context";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Clock, BookOpen, CheckCircle2, GraduationCap, Award } from "lucide-react";
import { isBefore, parseISO } from "date-fns";

export default function StatsPage() {
  const { logs, subjects, problems } = useStudy();

  const passedExams = subjects.filter(s => s.grade !== undefined || (s.examDate && isBefore(parseISO(s.examDate), new Date()) && s.studyScore > 50));
  
  const averageGrade = passedExams.length > 0 
    ? passedExams.reduce((acc, s) => acc + (s.grade || s.studyScore), 0) / passedExams.length 
    : 0;

  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-serif font-bold tracking-tight">Study Analytics</h1>
          <p className="text-muted-foreground">Track your history and academic performance.</p>
        </div>

        <div className="grid gap-6 md:grid-cols-12">
          {/* Main Stats Column */}
          <div className="col-span-12 lg:col-span-8 space-y-6">
            
            {/* Academic Overview */}
            <div className="grid gap-4 md:grid-cols-2">
              <Card className="bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Average Grade</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-baseline gap-2">
                    <span className="text-4xl font-bold font-serif text-primary">{averageGrade.toFixed(1)}</span>
                    <span className="text-sm text-muted-foreground">/ 100</span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">Based on {passedExams.length} passed subjects</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Total Study Time</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-baseline gap-2">
                    <span className="text-4xl font-bold font-serif">
                      {Math.round(logs.reduce((acc, log) => acc + log.durationMinutes, 0) / 60 * 10) / 10}
                    </span>
                    <span className="text-sm text-muted-foreground">hours</span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">Across all subjects</p>
                </CardContent>
              </Card>
            </div>

            <Card className="h-[500px]">
              <CardHeader>
                <CardTitle>Session History</CardTitle>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[400px] pr-4">
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

          {/* Sidebar - Old Exams */}
          <div className="col-span-12 lg:col-span-4 space-y-6">
            <Card className="h-full">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <GraduationCap className="h-5 w-5 text-primary" />
                  Academic History
                </CardTitle>
                <CardDescription>Past exams and grades</CardDescription>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[600px] pr-4">
                  <div className="space-y-4">
                    {passedExams.length === 0 ? (
                      <div className="text-center py-8 text-muted-foreground text-sm">
                        No past exams recorded yet.
                      </div>
                    ) : (
                      passedExams.map((subject) => (
                        <div key={subject.id} className="p-4 rounded-lg border bg-card/50 hover:bg-card transition-all">
                          <div className="flex justify-between items-start mb-2">
                            <h4 className="font-semibold">{subject.name}</h4>
                            <div className="flex items-center gap-1 bg-primary/10 text-primary px-2 py-1 rounded text-xs font-bold">
                              <Award className="h-3 w-3" />
                              {subject.grade || subject.studyScore}
                            </div>
                          </div>
                          <div className="flex items-center justify-between text-xs text-muted-foreground">
                            <span>Exam: {subject.examDate}</span>
                            <span>{subject.grade ? "Final Grade" : "Predicted"}</span>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
}
