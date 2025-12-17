import { Layout } from "@/components/Layout";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useStudy } from "@/lib/study-context";
import { useState } from "react";
import { format, parseISO, isSameDay, addDays, isSameWeek, startOfWeek, endOfWeek, eachDayOfInterval, isAfter, isBefore } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Clock, Calendar as CalendarIcon, Grid, List } from "lucide-react";
import { cn } from "@/lib/utils";

export default function CalendarPage() {
  const { subjects } = useStudy();
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [view, setView] = useState<"month" | "2week" | "week" | "day">("month");

  // Filter only upcoming exams for the stack
  const upcomingExams = subjects
    .filter(s => s.examDate && isAfter(parseISO(s.examDate), new Date(new Date().setDate(new Date().getDate() - 1))))
    .sort((a, b) => parseISO(a.examDate).getTime() - parseISO(b.examDate).getTime());

  const examDays = subjects.map(s => parseISO(s.examDate));
  
  const getExamsForDate = (day: Date) => {
    return subjects.filter(s => isSameDay(parseISO(s.examDate), day));
  };

  const getSubjectColor = (score: number) => {
    if (score >= 80) return "bg-emerald-500 text-white";
    if (score >= 50) return "bg-amber-500 text-white";
    return "bg-rose-500 text-white";
  };

  const renderAgendaView = () => {
    const today = date || new Date();
    let start = today;
    let end = today;

    if (view === "week") {
      start = startOfWeek(today);
      end = endOfWeek(today);
    } else if (view === "2week") {
      start = today;
      end = addDays(today, 13);
    }

    const days = eachDayOfInterval({ start, end });

    return (
      <div className="space-y-4">
        {days.map((day) => {
          const exams = getExamsForDate(day);
          const isToday = isSameDay(day, new Date());
          
          return (
            <div key={day.toISOString()} className={cn("flex gap-4 p-4 rounded-lg border", isToday ? "bg-accent/50 border-primary/20" : "bg-card")}>
              <div className="flex flex-col items-center justify-center min-w-[60px] border-r pr-4">
                <span className="text-xs font-medium text-muted-foreground uppercase">{format(day, "EEE")}</span>
                <span className={cn("text-2xl font-bold", isToday && "text-primary")}>{format(day, "d")}</span>
              </div>
              <div className="flex-1 space-y-2">
                {exams.length > 0 ? (
                  exams.map(exam => (
                    <div key={exam.id} className={cn("p-2 rounded-md text-sm font-medium flex justify-between items-center", getSubjectColor(exam.studyScore))}>
                      <span>{exam.name} Exam</span>
                      <span className="text-xs bg-white/20 px-2 py-0.5 rounded">Score: {exam.studyScore}</span>
                    </div>
                  ))
                ) : (
                  <div className="text-sm text-muted-foreground italic py-1">No exams scheduled</div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-serif font-bold tracking-tight">Study Calendar</h1>
            <p className="text-muted-foreground">Plan your study sessions and track exam dates.</p>
          </div>
          <div className="flex bg-secondary p-1 rounded-lg">
            <Button 
              variant={view === "month" ? "default" : "ghost"} 
              size="sm" 
              onClick={() => setView("month")}
              className="text-xs"
            >
              Month
            </Button>
            <Button 
              variant={view === "2week" ? "default" : "ghost"} 
              size="sm" 
              onClick={() => setView("2week")}
              className="text-xs"
            >
              2 Weeks
            </Button>
            <Button 
              variant={view === "week" ? "default" : "ghost"} 
              size="sm" 
              onClick={() => setView("week")}
              className="text-xs"
            >
              Week
            </Button>
            <Button 
              variant={view === "day" ? "default" : "ghost"} 
              size="sm" 
              onClick={() => setView("day")}
              className="text-xs"
            >
              Day
            </Button>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-12">
           <div className="col-span-12 md:col-span-8 lg:col-span-8">
              <Card className="h-full">
                <CardContent className="p-6">
                   {view === "month" ? (
                     <Calendar
                        mode="single"
                        selected={date}
                        onSelect={setDate}
                        className="rounded-md border shadow-sm w-full h-full flex items-center justify-center"
                        classNames={{
                          head_cell: "text-muted-foreground font-normal text-[0.8rem] w-full",
                          cell: "h-14 w-14 text-center text-sm p-0 relative [&:has([aria-selected])]:bg-accent first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20",
                          day: "h-14 w-14 p-0 font-normal aria-selected:opacity-100 hover:bg-secondary/50 rounded-md transition-colors",
                          day_selected: "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground",
                          day_today: "bg-accent text-accent-foreground font-bold",
                        }}
                        modifiers={{
                          exam: examDays
                        }}
                        modifiersStyles={{
                          exam: { fontWeight: 'bold', color: 'var(--destructive)', textDecoration: 'underline' }
                        }}
                          components={{
                          DayContent: (props: any) => {
                            const exams = getExamsForDate(props.date);
                            const hasExam = exams.length > 0;
                            return (
                              <div className="relative w-full h-full flex items-center justify-center">
                                {props.date.getDate()}
                                {hasExam && (
                                  <div className={cn("absolute bottom-2 h-1.5 w-1.5 rounded-full", getSubjectColor(exams[0].studyScore).split(' ')[0])} />
                                )}
                              </div>
                            );
                          }
                        }}
                      />
                   ) : (
                     renderAgendaView()
                   )}
                </CardContent>
              </Card>
           </div>
           
           <div className="col-span-12 md:col-span-4 lg:col-span-4 space-y-6">
              <Card className="border-l-4 border-l-secondary">
                 <CardHeader>
                    <CardTitle className="font-serif">
                       {date ? format(date, "MMMM d, yyyy") : "Select a date"}
                    </CardTitle>
                    <CardDescription>
                       Events and exams for this day.
                    </CardDescription>
                 </CardHeader>
                 <CardContent>
                    <div className="space-y-4">
                       {date && getExamsForDate(date).length > 0 ? (
                          getExamsForDate(date).map(subject => (
                             <div key={subject.id} className={cn("p-4 rounded-lg shadow-sm text-white", getSubjectColor(subject.studyScore))}>
                                <span className="text-xs font-bold uppercase tracking-wider opacity-80 mb-1 block">Exam Day</span>
                                <h3 className="font-bold text-lg">{subject.name}</h3>
                                <p className="text-sm opacity-90 mt-1">Preparedness: {subject.studyScore}%</p>
                             </div>
                          ))
                       ) : (
                          <div className="text-center py-6 text-muted-foreground">
                             <p>No exams scheduled for this day.</p>
                             <p className="text-sm mt-2">Perfect day for a study session.</p>
                          </div>
                       )}
                    </div>
                 </CardContent>
              </Card>

              {/* Upcoming Exams Stack */}
              <Card>
                <CardHeader>
                  <CardTitle className="font-serif flex items-center gap-2">
                    <Grid className="h-5 w-5" />
                    Upcoming Exams
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-0">
                    {upcomingExams.map((subject, index) => (
                      <div 
                        key={subject.id} 
                        className={cn(
                          "relative p-4 bg-card border rounded-lg shadow-sm transition-all hover:translate-x-1", 
                          index !== 0 && "-mt-2"
                        )}
                        style={{ zIndex: upcomingExams.length - index }}
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="font-semibold">{subject.name}</h4>
                            <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
                              <CalendarIcon className="h-3 w-3" />
                              {format(parseISO(subject.examDate), "MMM d, yyyy")}
                            </p>
                          </div>
                          <Badge className={cn("text-white", getSubjectColor(subject.studyScore).split(' ')[0])}>
                            {subject.studyScore}%
                          </Badge>
                        </div>
                      </div>
                    ))}
                    {upcomingExams.length === 0 && (
                      <p className="text-sm text-muted-foreground text-center py-4">No upcoming exams.</p>
                    )}
                  </div>
                </CardContent>
              </Card>
           </div>
        </div>
      </div>
    </Layout>
  );
}
