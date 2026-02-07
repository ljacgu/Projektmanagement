import { Layout } from "@/components/Layout";
import { useStudy } from "@/lib/study-context";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Clock, BookOpen, CheckCircle2, GraduationCap, Award, XCircle, Plus, Paperclip, TrendingUp, TrendingDown, Minus, FileText, Download, Upload, Eye } from "lucide-react";
import { isBefore, parseISO, isToday, isThisWeek, isThisMonth, startOfDay, startOfWeek, startOfMonth } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { useFilesBySubject } from "@/lib/hooks";
import type { Subject } from "@shared/schema";

function ExamFiles({ subjectId }: { subjectId: number }) {
  const { data: files = [] } = useFilesBySubject(subjectId);
  const { addFile } = useStudy();
  const [uploading, setUploading] = useState(false);

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
    });
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    setUploading(true);
    try {
      for (const file of Array.from(e.target.files)) {
        const base64Url = await fileToBase64(file);
        addFile(subjectId, {
          name: file.name,
          type: file.type,
          url: base64Url,
          size: formatFileSize(file.size),
          uploadedAt: new Date().toISOString(),
        });
      }
    } catch (err) {
      console.error("Upload failed:", err);
    }
    setUploading(false);
    e.target.value = "";
  };

  const isImageType = (type: string) => type.startsWith("image/") || type === "image";
  const isPdfType = (type: string) => type.includes("pdf");

  const handleView = (file: { url: string; name: string; type: string }) => {
    if (file.url === "#") return;
    const safeName = file.name.replace(/[<>"'&]/g, '_');
    if (isImageType(file.type)) {
      const w = window.open("", "_blank");
      if (w) {
        w.document.title = safeName;
        w.document.body.style.cssText = "margin:0;display:flex;justify-content:center;align-items:center;min-height:100vh;background:#1a1a2e";
        const img = w.document.createElement("img");
        img.src = file.url;
        img.style.cssText = "max-width:100%;max-height:100vh;object-fit:contain";
        w.document.body.appendChild(img);
      }
    } else if (isPdfType(file.type)) {
      const w = window.open("", "_blank");
      if (w) {
        w.document.title = safeName;
        w.document.body.style.margin = "0";
        const iframe = w.document.createElement("iframe");
        iframe.src = file.url;
        iframe.style.cssText = "width:100%;height:100vh;border:none";
        w.document.body.appendChild(iframe);
      }
    } else {
      handleDownload(file);
    }
  };

  const handleDownload = (file: { url: string; name: string }) => {
    if (file.url === "#") return;
    const a = document.createElement("a");
    a.href = file.url;
    a.download = file.name;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const getFileIcon = (type: string) => {
    if (isPdfType(type)) return <FileText className="h-3.5 w-3.5 text-rose-500" />;
    if (isImageType(type)) return <FileText className="h-3.5 w-3.5 text-blue-500" />;
    return <FileText className="h-3.5 w-3.5 text-slate-500" />;
  };
  
  return (
    <div className="mt-3 space-y-1.5">
      {files.map((file) => (
        <div
          key={file.id}
          className="flex items-center gap-2 text-xs bg-muted/50 p-2.5 rounded-lg border"
          data-testid={`file-${file.id}`}
        >
          {getFileIcon(file.type)}
          <span className="truncate flex-1 font-medium">{file.name}</span>
          <span className="text-muted-foreground text-[10px]">{file.size}</span>
          <button
            onClick={() => handleView(file)}
            className="text-blue-600 hover:text-blue-700 p-1 rounded-md hover:bg-blue-50 dark:hover:bg-blue-950 transition-colors"
            title="View file"
            data-testid={`button-view-file-${file.id}`}
          >
            <Eye className="h-3.5 w-3.5" />
          </button>
          <button
            onClick={() => handleDownload(file)}
            className="text-emerald-600 hover:text-emerald-700 p-1 rounded-md hover:bg-emerald-50 dark:hover:bg-emerald-950 transition-colors"
            title="Download file"
            data-testid={`button-download-file-${file.id}`}
          >
            <Download className="h-3.5 w-3.5" />
          </button>
        </div>
      ))}
      <label className="flex items-center gap-2 text-xs text-muted-foreground hover:text-primary cursor-pointer p-2.5 rounded-lg border border-dashed border-muted-foreground/20 hover:border-primary/40 hover:bg-muted/30 transition-all" data-testid={`button-attach-file-${subjectId}`}>
        <Upload className="h-3.5 w-3.5" />
        <span>{uploading ? "Uploading..." : "Attach exam file"}</span>
        <input
          type="file"
          className="hidden"
          multiple
          accept=".pdf,.doc,.docx,.txt,.jpg,.jpeg,.png,.gif,.webp"
          onChange={handleUpload}
          data-testid={`input-upload-file-${subjectId}`}
        />
      </label>
    </div>
  );
}

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
  const { logs, subjects, problems, addSubject, addFile } = useStudy();
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [examDate, setExamDate] = useState("");
  const [grade, setGrade] = useState("2.0");
  const [notes, setNotes] = useState("");
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

  useEffect(() => {
    const hash = window.location.hash;
    if (hash === "#problems-overview" || hash === "#learning-time-evaluation") {
      setTimeout(() => {
        const element = document.getElementById(hash.substring(1));
        if (element) {
          const yOffset = -20;
          const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
          window.scrollTo({ top: y, behavior: "smooth" });
        }
      }, 300);
    }
  }, []);

  const passedExams = subjects.filter(s => s.grade !== null && s.grade !== undefined && s.grade <= 44);
  const failedExams = subjects.filter(s => s.grade !== null && s.grade !== undefined && s.grade > 44);
  
  const averageGrade = passedExams.length > 0 
    ? passedExams.reduce((acc, s) => acc + ((s.grade || 0) / 10), 0) / passedExams.length 
    : 0;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setSelectedFiles(Array.from(e.target.files));
    }
  };

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
    });
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  const handleSubmit = async (e: React.FormEvent) => {
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

    // Upload files after a brief delay to ensure subject is created
    if (selectedFiles.length > 0) {
      setTimeout(async () => {
        // Find the newly created subject
        const newSubject = subjects.find(s => s.name === name && s.examDate === examDate);
        if (newSubject) {
          for (const file of selectedFiles) {
            const base64Url = await fileToBase64(file);
            addFile(newSubject.id, {
              name: file.name,
              type: file.type,
              url: base64Url,
              size: formatFileSize(file.size),
              uploadedAt: new Date().toISOString(),
            });
          }
        }
      }, 500);
    }

    setOpen(false);
    setName("");
    setExamDate("");
    setGrade("2.0");
    setNotes("");
    setSelectedFiles([]);
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
                <div className="grid gap-2">
                  <Label htmlFor="exam-files">Attach Files (optional)</Label>
                  <Input
                    id="exam-files"
                    type="file"
                    multiple
                    onChange={handleFileChange}
                    className="cursor-pointer"
                    data-testid="input-exam-files"
                    accept=".pdf,.doc,.docx,.txt,.jpg,.jpeg,.png,.gif"
                  />
                  <p className="text-xs text-muted-foreground">Upload old exams, scripts, or study materials (PDF, DOC, images)</p>
                  {selectedFiles.length > 0 && (
                    <div className="text-xs text-muted-foreground bg-secondary/50 p-2 rounded">
                      <Paperclip className="inline h-3 w-3 mr-1" />
                      {selectedFiles.length} file{selectedFiles.length > 1 ? 's' : ''} selected: {selectedFiles.map(f => f.name).join(', ')}
                    </div>
                  )}
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

            <Card>
              <CardHeader>
                <CardTitle id="learning-time-evaluation">Learning Time Evaluation</CardTitle>
                <CardDescription>Assessment of your study habits</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-3">
                  {(() => {
                    const today = new Date();
                    
                    const todayLogs = logs.filter(l => {
                      try {
                        return isToday(parseISO(l.date));
                      } catch { return false; }
                    });
                    const todayHours = Math.round(todayLogs.reduce((acc, l) => acc + l.durationMinutes, 0) / 60 * 10) / 10;
                    const todayTarget = 2;
                    const todayStatus = todayHours >= todayTarget ? "good" : todayHours >= todayTarget * 0.5 ? "ok" : "low";
                    
                    const weekLogs = logs.filter(l => {
                      try {
                        return isThisWeek(parseISO(l.date), { weekStartsOn: 1 });
                      } catch { return false; }
                    });
                    const weekHours = Math.round(weekLogs.reduce((acc, l) => acc + l.durationMinutes, 0) / 60 * 10) / 10;
                    const weekTarget = 14;
                    const weekStatus = weekHours >= weekTarget ? "good" : weekHours >= weekTarget * 0.5 ? "ok" : "low";
                    
                    const monthLogs = logs.filter(l => {
                      try {
                        return isThisMonth(parseISO(l.date));
                      } catch { return false; }
                    });
                    const monthHours = Math.round(monthLogs.reduce((acc, l) => acc + l.durationMinutes, 0) / 60 * 10) / 10;
                    const monthTarget = 40;
                    const monthStatus = monthHours >= monthTarget ? "good" : monthHours >= monthTarget * 0.5 ? "ok" : "low";
                    
                    const getStatusColor = (status: string) => {
                      if (status === "good") return "text-emerald-600 bg-emerald-50 border-emerald-200";
                      if (status === "ok") return "text-amber-600 bg-amber-50 border-amber-200";
                      return "text-destructive bg-destructive/10 border-destructive/20";
                    };
                    
                    const getStatusIcon = (status: string) => {
                      if (status === "good") return <TrendingUp className="h-5 w-5" />;
                      if (status === "ok") return <Minus className="h-5 w-5" />;
                      return <TrendingDown className="h-5 w-5" />;
                    };
                    
                    const getStatusMessage = (status: string, period: string) => {
                      if (status === "good") return `Great ${period}!`;
                      if (status === "ok") return "Keep going!";
                      return "Need more study time";
                    };
                    
                    return (
                      <>
                        <div className={`p-4 rounded-lg border ${getStatusColor(todayStatus)}`} data-testid="eval-today">
                          <div className="flex items-center justify-between mb-2">
                            <span className="font-semibold">Today</span>
                            {getStatusIcon(todayStatus)}
                          </div>
                          <div className="text-2xl font-bold">{todayHours}h</div>
                          <div className="text-xs mt-1">Target: {todayTarget}h/day</div>
                          <div className="text-xs font-medium mt-2">{getStatusMessage(todayStatus, "day")}</div>
                        </div>
                        
                        <div className={`p-4 rounded-lg border ${getStatusColor(weekStatus)}`} data-testid="eval-week">
                          <div className="flex items-center justify-between mb-2">
                            <span className="font-semibold">This Week</span>
                            {getStatusIcon(weekStatus)}
                          </div>
                          <div className="text-2xl font-bold">{weekHours}h</div>
                          <div className="text-xs mt-1">Target: {weekTarget}h/week</div>
                          <div className="text-xs font-medium mt-2">{getStatusMessage(weekStatus, "week")}</div>
                        </div>
                        
                        <div className={`p-4 rounded-lg border ${getStatusColor(monthStatus)}`} data-testid="eval-month">
                          <div className="flex items-center justify-between mb-2">
                            <span className="font-semibold">This Month</span>
                            {getStatusIcon(monthStatus)}
                          </div>
                          <div className="text-2xl font-bold">{monthHours}h</div>
                          <div className="text-xs mt-1">Target: {monthTarget}h/month</div>
                          <div className="text-xs font-medium mt-2">{getStatusMessage(monthStatus, "month")}</div>
                        </div>
                      </>
                    );
                  })()}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Study Time by Subject</CardTitle>
                <CardDescription>Hours spent on each subject</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {subjects.filter(s => !s.grade).length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground text-sm">
                      No active subjects. Add subjects to track study time.
                    </div>
                  ) : (
                    subjects.filter(s => !s.grade).map((subject) => {
                      const subjectLogs = logs.filter(l => l.subjectId === subject.id);
                      const totalMinutes = subjectLogs.reduce((acc, l) => acc + l.durationMinutes, 0);
                      const totalHours = Math.round(totalMinutes / 60 * 10) / 10;
                      const targetHours = subject.targetHours || 20;
                      const progress = Math.min(100, (totalHours / targetHours) * 100);
                      
                      return (
                        <div key={subject.id} className="space-y-2" data-testid={`subject-time-${subject.id}`}>
                          <div className="flex justify-between items-center">
                            <div className="flex items-center gap-2">
                              <div className={`w-3 h-3 rounded-full ${subject.color}`} />
                              <span className="font-medium">{subject.name}</span>
                            </div>
                            <span className="text-sm text-muted-foreground">
                              {totalHours}h / {targetHours}h target
                            </span>
                          </div>
                          <div className="h-2 w-full bg-secondary rounded-full overflow-hidden">
                            <div 
                              className={`h-full rounded-full transition-all ${subject.color}`}
                              style={{ width: `${progress}%` }}
                            />
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </CardContent>
            </Card>

            <Card id="problems-overview">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5 text-primary" />
                  Problems Overview
                </CardTitle>
                <CardDescription>All active problems grouped by subject</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {subjects.filter(s => !s.grade).length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground text-sm">
                      No active subjects. Add subjects to track problems.
                    </div>
                  ) : (
                    subjects.filter(s => !s.grade).map((subject) => {
                      const subjectProblems = problems.filter(p => p.subjectId === subject.id && p.status !== "solved");
                      
                      return (
                        <div key={subject.id} className="space-y-3" data-testid={`problems-subject-${subject.id}`}>
                          <div className="flex items-center gap-2">
                            <div className={`w-3 h-3 rounded-full ${subject.color}`} />
                            <h4 className="font-semibold">{subject.name}</h4>
                            <Badge variant="secondary" className="ml-auto">
                              {subjectProblems.length} problem{subjectProblems.length !== 1 ? 's' : ''}
                            </Badge>
                          </div>
                          
                          {subjectProblems.length === 0 ? (
                            <div className="text-sm text-muted-foreground pl-5 py-2 border-l-2 border-muted ml-1">
                              No active problems - great job!
                            </div>
                          ) : (
                            <div className="space-y-2 pl-5 border-l-2 border-muted ml-1">
                              {subjectProblems.map((problem) => (
                                <div 
                                  key={problem.id} 
                                  className={`p-3 rounded-lg border text-sm ${
                                    problem.status === "refresh" 
                                      ? "bg-blue-50 border-blue-200 dark:bg-blue-900/10 dark:border-blue-800" 
                                      : "bg-amber-50 border-amber-200 dark:bg-amber-900/10 dark:border-amber-800"
                                  }`}
                                  data-testid={`problem-item-${problem.id}`}
                                >
                                  <p className="font-medium">{problem.description}</p>
                                  <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
                                    <Clock className="h-3 w-3" />
                                    <span>Added {problem.createdAt}</span>
                                    {problem.status === "refresh" && (
                                      <Badge variant="outline" className="ml-auto text-blue-600 border-blue-300">
                                        Needs Refresh
                                      </Badge>
                                    )}
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      );
                    })
                  )}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle>Session History</CardTitle>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[350px] pr-4">
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
            <Card className="border-l-4 border-l-primary">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2 text-base">
                  <GraduationCap className="h-4 w-4 text-primary" />
                  Passed Exams
                </CardTitle>
                <CardDescription className="text-xs">Grades 1.0 - 4.4</CardDescription>
              </CardHeader>
              <CardContent>
                <ScrollArea className={passedExams.length > 3 ? "h-[300px] pr-4" : "pr-4"}>
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
                          <ExamFiles subjectId={subject.id} />
                        </div>
                      ))
                    )}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-destructive">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2 text-base">
                  <XCircle className="h-4 w-4 text-destructive" />
                  Failed Exams
                </CardTitle>
                <CardDescription className="text-xs">Grades &gt; 4.4</CardDescription>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[120px] pr-4">
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
