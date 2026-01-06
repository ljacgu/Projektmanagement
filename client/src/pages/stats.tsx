import { Layout } from "@/components/Layout";
import { useStudy } from "@/lib/study-context";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Clock, BookOpen, CheckCircle2, GraduationCap, Award, XCircle, Plus, Paperclip } from "lucide-react";
import { isBefore, parseISO } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export default function StatsPage() {
  const { logs, subjects, problems, addSubject } = useStudy();
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [examDate, setExamDate] = useState("");
  const [grade, setGrade] = useState("2.0");
  const [notes, setNotes] = useState("");

  const passedExams = subjects.filter(s => s.grade !== null && s.grade !== undefined && s.grade <= 44);
  const failedExams = subjects.filter(s => s.grade !== null && s.grade !== undefined && s.grade > 44);
  
  const averageGrade = passedExams.length > 0 
    ? passedExams.reduce((acc, s) => acc + ((s.grade || 0) / 10), 0) / passedExams.length 
    : 0;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !examDate || !grade) return;

    const colors = ["bg-emerald-500", "bg-amber-500", "bg-blue-500", "bg-violet-500", "bg-rose-500", "bg-pink-500"];
    const randomColor = colors[Math.floor(Math.random() * colors.length)];
    
    addSubject({
      name,
      examDate,
      targetHours: 0,
      color: randomColor,
      grade: Math.round(parseFloat(grade) * 10),
      notes: notes || null,
    });

    setOpen(false);
    setName("");
    setExamDate("");
    setGrade("2.0");
    setNotes("");
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-serif font-bold tracking-tight">Study Analytics</h1>
            <p className="text-muted-foreground">Track your history and academic performance.</p>
          </div>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button className="shadow-sm" data-testid="button-log-exam">
                <Plus className="mr-2 h-4 w-4" /> Log Completed Exam
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Log Completed Exam</DialogTitle>
                <DialogDescription>
                  Record an exam you've already taken to track your academic history.
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="exam-name">Subject Name</Label>
                  <Input
                    id="exam-name"
                    placeholder="e.g. Linear Algebra"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    data-testid="input-exam-name"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="exam-date">Exam Date</Label>
                  <Input
                    id="exam-date"
                    type="date"
                    value={examDate}
                    onChange={(e) => setExamDate(e.target.value)}
                    required
                    data-testid="input-exam-date"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="exam-grade">Grade (1.0 - 5.0)</Label>
                  <Input
                    id="exam-grade"
                    type="number"
                    step="0.1"
                    min="1.0"
                    max="5.0"
                    value={grade}
                    onChange={(e) => setGrade(e.target.value)}
                    required
                    data-testid="input-exam-grade"
                  />
                  <p className="text-xs text-muted-foreground">German grading scale: 1.0 (best) - 5.0 (fail)</p>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="exam-notes">Notes / Reflections</Label>
                  <Textarea
                    id="exam-notes"
                    placeholder="What went well? What could be improved?"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="h-24"
                    data-testid="input-exam-notes"
                  />
                </div>
                <DialogFooter>
                  <Button type="submit" data-testid="button-submit-exam">
                    <GraduationCap className="mr-2 h-4 w-4" />
                    Save Exam Result
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid gap-6 md:grid-cols-12">
          <div className="col-span-12 lg:col-span-8 space-y-6">
            
            <div className="grid gap-4 md:grid-cols-2">
              <Card className="bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Average Grade (Passed)</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-baseline gap-2">
                    <span className="text-4xl font-bold font-serif text-primary" data-testid="text-average-grade">
                      {averageGrade > 0 ? averageGrade.toFixed(2) : "-"}
                    </span>
                    <span className="text-sm text-muted-foreground">/ 1.0</span>
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
                    <span className="text-4xl font-bold font-serif" data-testid="text-total-hours">
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
                          <div key={log.id} className="relative pl-6 pb-6 border-l-2 border-muted last:pb-0" data-testid={`log-entry-${log.id}`}>
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
            <Card className="h-full border-l-4 border-l-primary">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <GraduationCap className="h-5 w-5 text-primary" />
                  Passed Exams
                </CardTitle>
                <CardDescription>Grades 1.0 - 4.4</CardDescription>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[300px] pr-4">
                  <div className="space-y-4">
                    {passedExams.length === 0 ? (
                      <div className="text-center py-8 text-muted-foreground text-sm">
                        No passed exams recorded yet.
                      </div>
                    ) : (
                      passedExams.map((subject) => (
                        <div key={subject.id} className="p-4 rounded-lg border bg-emerald-50/50 border-emerald-100 hover:bg-emerald-50 transition-all" data-testid={`passed-exam-${subject.id}`}>
                          <div className="flex justify-between items-start mb-2">
                            <h4 className="font-semibold">{subject.name}</h4>
                            <div className="flex items-center gap-1 bg-emerald-100 text-emerald-800 px-2 py-1 rounded text-xs font-bold border border-emerald-200">
                              <Award className="h-3 w-3" />
                              {(subject.grade! / 10).toFixed(1)}
                            </div>
                          </div>
                          <div className="flex items-center justify-between text-xs text-muted-foreground">
                            <span>Exam: {subject.examDate}</span>
                          </div>
                          {subject.notes && (
                            <div className="mt-2 text-xs text-muted-foreground bg-white/50 p-2 rounded border">
                              <Paperclip className="inline h-3 w-3 mr-1" />
                              {subject.notes}
                            </div>
                          )}
                        </div>
                      ))
                    )}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>

            <Card className="h-full border-l-4 border-l-destructive">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <XCircle className="h-5 w-5 text-destructive" />
                  Failed Exams
                </CardTitle>
                <CardDescription>Grades &gt; 4.4</CardDescription>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[200px] pr-4">
                  <div className="space-y-4">
                    {failedExams.length === 0 ? (
                      <div className="text-center py-8 text-muted-foreground text-sm">
                        No failed exams. Excellent!
                      </div>
                    ) : (
                      failedExams.map((subject) => (
                        <div key={subject.id} className="p-4 rounded-lg border bg-destructive/5 border-destructive/20 hover:bg-destructive/10 transition-all" data-testid={`failed-exam-${subject.id}`}>
                          <div className="flex justify-between items-start mb-2">
                            <h4 className="font-semibold">{subject.name}</h4>
                            <div className="flex items-center gap-1 bg-destructive/10 text-destructive px-2 py-1 rounded text-xs font-bold border border-destructive/20">
                              {(subject.grade! / 10).toFixed(1)}
                            </div>
                          </div>
                          <div className="flex items-center justify-between text-xs text-muted-foreground">
                            <span>Exam: {subject.examDate}</span>
                          </div>
                          {subject.notes && (
                            <div className="mt-2 text-xs text-muted-foreground bg-white/50 p-2 rounded border">
                              <Paperclip className="inline h-3 w-3 mr-1" />
                              {subject.notes}
                            </div>
                          )}
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
