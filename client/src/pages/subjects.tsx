import { Layout } from "@/components/Layout";
import { 
  Plus, 
  Trash2, 
  BookOpen, 
  Calendar as CalendarIcon,
  Search,
  MoreVertical,
  AlertCircle,
  Clock,
  Paperclip,
  ChevronDown
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { cn } from "@/lib/utils";
import { useStudy } from "@/lib/study-context";
import { AddSubjectDialog } from "@/components/AddSubjectDialog";
import { AddProblemDialog } from "@/components/AddProblemDialog";
import { SubjectResourcesDialog } from "@/components/SubjectResourcesDialog";
import { useState } from "react";

export default function SubjectsPage() {
  const { subjects, problems, deleteSubject, searchQuery } = useStudy();

  const filteredSubjects = subjects.filter(s => 
    s.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getSubjectColor = (score: number) => {
    if (score >= 80) return "bg-emerald-100 border-emerald-200 text-emerald-900 dark:bg-emerald-900/20 dark:border-emerald-800 dark:text-emerald-100";
    if (score >= 50) return "bg-amber-100 border-amber-200 text-amber-900 dark:bg-amber-900/20 dark:border-amber-800 dark:text-amber-100";
    return "bg-rose-100 border-rose-200 text-rose-900 dark:bg-rose-900/20 dark:border-rose-800 dark:text-rose-100";
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-serif font-bold tracking-tight">Manage Subjects</h1>
            <p className="text-muted-foreground">Track your exams and subject-specific problems.</p>
          </div>
          <AddSubjectDialog>
            <Button className="shadow-sm">
              <Plus className="mr-2 h-4 w-4" /> Add Subject
            </Button>
          </AddSubjectDialog>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredSubjects.map((subject) => {
             const subjectProblems = problems.filter(p => p.subjectId === subject.id && p.status === "active");
             const problemCount = subjectProblems.length;
             const fileCount = subject.files ? subject.files.length : 0;
             const colorClass = getSubjectColor(subject.studyScore);
             
             // Safety checks for new fields
             const studiedMinutes = subject.studiedMinutes || 0;
             const targetHours = subject.targetHours || 10;
             const studiedHours = Math.round(studiedMinutes / 60);
             
             return (
               <Card key={subject.id} className="overflow-hidden border-t-4 transition-all hover:shadow-md flex flex-col group" style={{ borderTopColor: subject.studyScore >= 80 ? '#10b981' : subject.studyScore >= 50 ? '#f59e0b' : '#f43f5e' }}>
                 <CardHeader className="pb-3">
                    <div className="flex justify-between items-start">
                       <Badge variant="secondary" className="font-mono text-xs">
                          Score: {subject.studyScore}
                       </Badge>
                       <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                             <Button variant="ghost" size="icon" className="h-8 w-8 -mr-2">
                                <MoreVertical className="h-4 w-4" />
                             </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                             <DropdownMenuLabel>Actions</DropdownMenuLabel>
                             <AddProblemDialog subjectId={subject.id} subjectName={subject.name}>
                                <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                                  Report Problem
                                </DropdownMenuItem>
                             </AddProblemDialog>
                             <SubjectResourcesDialog subjectId={subject.id} subjectName={subject.name}>
                                <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                                  Manage Files
                                </DropdownMenuItem>
                             </SubjectResourcesDialog>
                             <DropdownMenuItem className="text-destructive" onClick={() => deleteSubject(subject.id)}>
                                Delete Subject
                             </DropdownMenuItem>
                          </DropdownMenuContent>
                       </DropdownMenu>
                    </div>
                    <CardTitle className="font-serif text-xl mt-2">{subject.name}</CardTitle>
                 </CardHeader>
                 <CardContent className="space-y-4 flex-1">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                       <CalendarIcon className="h-4 w-4" />
                       <span>Exam: {subject.examDate}</span>
                    </div>

                    <div className="space-y-1">
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>Progress</span>
                        <span>{studiedHours} / {targetHours} hrs</span>
                      </div>
                      <Progress value={subject.studyScore} className="h-1.5" />
                    </div>
                    
                    {problemCount > 0 ? (
                       <DropdownMenu>
                         <DropdownMenuTrigger asChild>
                           <Button variant="ghost" className="w-full justify-between p-3 h-auto rounded-md bg-amber-50 border border-amber-100 text-amber-800 hover:bg-amber-100 hover:text-amber-900 group/problems">
                              <div className="flex items-start gap-3 text-left">
                                <AlertCircle className="h-4 w-4 mt-0.5 shrink-0" />
                                <div>
                                   <span className="font-semibold block text-sm">{problemCount} Active Problems</span>
                                   <span className="text-xs opacity-90">Click to view all</span>
                                </div>
                              </div>
                              <ChevronDown className="h-4 w-4 opacity-50 group-hover/problems:opacity-100" />
                           </Button>
                         </DropdownMenuTrigger>
                         <DropdownMenuContent className="w-[300px] max-h-[300px] overflow-y-auto">
                            <DropdownMenuLabel>Active Problems</DropdownMenuLabel>
                            {subjectProblems.map(p => (
                              <DropdownMenuItem key={p.id} className="flex flex-col items-start gap-1 p-3 cursor-default focus:bg-transparent">
                                <span className="text-sm font-medium">{p.description}</span>
                                <span className="text-xs text-muted-foreground">{p.createdAt}</span>
                              </DropdownMenuItem>
                            ))}
                         </DropdownMenuContent>
                       </DropdownMenu>
                    ) : (
                       <div className="p-3 rounded-md bg-emerald-50 border border-emerald-100 text-emerald-800 flex items-start gap-3">
                          <BookOpen className="h-4 w-4 mt-0.5 shrink-0" />
                          <div className="text-sm">
                             <span className="font-semibold block">All Clear</span>
                             <span className="text-xs opacity-90">No active problems logged</span>
                          </div>
                       </div>
                    )}
                 </CardContent>
                 <CardFooter className="bg-secondary/20 p-2 grid grid-cols-2 gap-1">
                    <AddProblemDialog subjectId={subject.id} subjectName={subject.name}>
                        <Button variant="ghost" size="sm" className="w-full hover:bg-background gap-2 text-xs">
                           <Plus className="h-3.5 w-3.5" /> Problem
                        </Button>
                    </AddProblemDialog>
                    <SubjectResourcesDialog subjectId={subject.id} subjectName={subject.name}>
                        <Button variant="ghost" size="sm" className="w-full hover:bg-background gap-2 text-xs">
                           <Paperclip className="h-3.5 w-3.5" /> Files ({fileCount})
                        </Button>
                    </SubjectResourcesDialog>
                 </CardFooter>
               </Card>
             );
          })}
          
          <AddSubjectDialog>
            <Button variant="outline" className="h-[320px] w-full flex flex-col gap-4 border-dashed border-2 hover:border-primary/50 hover:bg-primary/5 transition-all group">
              <div className="h-16 w-16 rounded-full bg-secondary flex items-center justify-center group-hover:bg-primary/20 group-hover:text-primary transition-colors">
                  <Plus className="h-8 w-8" />
              </div>
              <div className="text-center">
                  <h3 className="font-medium text-lg">Add New Subject</h3>
                  <p className="text-sm text-muted-foreground mt-1">Track a new course or exam</p>
              </div>
            </Button>
          </AddSubjectDialog>
        </div>
      </div>
    </Layout>
  );
}
