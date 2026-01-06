import { Layout } from "@/components/Layout";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useStudy } from "@/lib/study-context";
import { useState } from "react";
import { format, parseISO, isSameDay, addDays, isSameWeek, startOfWeek, endOfWeek, eachDayOfInterval, isAfter, isBefore } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Clock, Calendar as CalendarIcon, Grid, List, Plus, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { AddEventDialog } from "@/components/AddEventDialog";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

export default function CalendarPage() {
  const { subjects, personalEvents, deletePersonalEvent } = useStudy();
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

  const getEventsForDate = (day: Date) => {
    return personalEvents.filter(e => isSameDay(parseISO(e.date), day));
  };

  const getAllForDate = (day: Date) => {
    const exams = getExamsForDate(day).map(e => ({ ...e, isExam: true }));
    const events = getEventsForDate(day).map(e => ({ ...e, isExam: false }));
    return [...exams, ...events];
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
          const allEvents = getAllForDate(day);
          const isToday = isSameDay(day, new Date());
          
          return (
            <div key={day.toISOString()} className={cn("flex gap-4 p-4 rounded-lg border", isToday ? "bg-accent/50 border-primary/20" : "bg-card")}>
              <div className="flex flex-col items-center justify-center min-w-[60px] border-r pr-4">
                <span className="text-xs font-medium text-muted-foreground uppercase">{format(day, "EEE")}</span>
                <span className={cn("text-2xl font-bold", isToday && "text-primary")}>{format(day, "d")}</span>
              </div>
              <div className="flex-1 space-y-2">
                {allEvents.length > 0 ? (
                  allEvents.map((item: any) => (
                    <div 
                      key={item.id} 
                      className={cn(
                        "p-3 rounded-md text-sm font-medium flex justify-between items-center shadow-sm", 
                        item.isExam ? "bg-destructive text-destructive-foreground" : item.color + " text-white"
                      )}
                    >
                      <div className="flex items-center gap-2">
                        {item.isExam && <Badge variant="outline" className="bg-white/20 border-white/40 text-white">EXAM</Badge>}
                        <span>{item.name || item.title}</span>
                      </div>
                      {item.isExam && <span className="text-xs bg-white/20 px-2 py-0.5 rounded">Score: {item.studyScore}</span>}
                      {!item.isExam && (
                        <Button variant="ghost" size="icon" className="h-6 w-6 text-white hover:bg-white/20" onClick={() => deletePersonalEvent(item.id)}>
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      )}
                    </div>
                  ))
                ) : (
                  <div className="text-sm text-muted-foreground italic py-1">No schedule</div>
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
      <div className="space-y-6 max-w-[1400px] mx-auto">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-serif font-bold tracking-tight">Study Calendar</h1>
            <p className="text-muted-foreground">Manage your exams and personal schedule.</p>
          </div>
          <div className="flex flex-wrap gap-2 items-center w-full lg:w-auto">
             <AddEventDialog defaultDate={date}>
               <Button className="gap-2 shadow-sm">
                 <Plus className="h-4 w-4" /> Add Event
               </Button>
             </AddEventDialog>
             <div className="flex bg-secondary p-1 rounded-lg ml-auto lg:ml-0">
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
        </div>

        <div className="grid gap-8 md:grid-cols-12 h-full">
           <div className="col-span-12 md:col-span-8 lg:col-span-8 flex flex-col h-full min-h-[600px]">
              <Card className="flex-1 flex flex-col shadow-md">
                <CardContent className="p-4 md:p-8 flex-1">
                   {view === "month" ? (
                     <Calendar
                        mode="single"
                        selected={date}
                        onSelect={setDate}
                        className="w-full h-full flex flex-col"
                        classNames={{
                          months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0 w-full flex-1",
                          month: "space-y-4 w-full flex flex-col flex-1",
                          caption: "flex justify-center pt-1 relative items-center mb-4",
                          caption_label: "text-lg font-bold font-serif",
                          nav: "space-x-1 flex items-center",
                          nav_button: "h-8 w-8 bg-transparent p-0 opacity-50 hover:opacity-100 transition-opacity",
                          table: "w-full border-collapse space-y-1 flex-1 h-full",
                          head_row: "flex w-full",
                          head_cell: "text-muted-foreground rounded-md w-full font-normal text-[0.9rem] uppercase tracking-wide py-2",
                          row: "flex w-full mt-2 flex-1",
                          cell: "h-16 md:h-24 w-full text-center text-sm p-0 relative [&:has([aria-selected])]:bg-accent first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20 border-b border-r border-border/20 last:border-r-0",
                          day: "h-full w-full p-0 font-normal aria-selected:opacity-100 hover:bg-secondary/50 transition-colors flex flex-col items-center justify-start pt-2 gap-1",
                          day_selected: "bg-primary/5 text-primary hover:bg-primary/10 hover:text-primary",
                          day_today: "bg-accent text-accent-foreground font-bold ring-1 ring-primary/20",
                          day_outside: "text-muted-foreground opacity-50",
                          day_disabled: "text-muted-foreground opacity-50",
                          day_hidden: "invisible",
                        }}
                        // We use Custom Day component instead of modifiers to avoid hydration issues with nested buttons
                        components={{
                          Day: (props: any) => {
                            const dayDate = props.date || props.day;
                            const displayMonth = props.displayMonth;

                            if (!dayDate) return <div className="invisible" />;
                            // Check if dayDate is valid date object
                            if (!(dayDate instanceof Date) || isNaN(dayDate.getTime())) return <div className="invisible" />;

                            // Only render days that belong to the current month or are visible
                            if (displayMonth && dayDate.getMonth() !== displayMonth.getMonth() && props.hidden) {
                                return <div className="invisible" />;
                            }
                            
                            const exams = getExamsForDate(dayDate);
                            const events = getEventsForDate(dayDate);
                            const hasExam = exams.length > 0;
                            const hasEvent = events.length > 0;
                            const isSelected = date && isSameDay(date, dayDate);
                            const isToday = isSameDay(dayDate, new Date());
                            
                            return (
                              <div className={cn(
                                "h-16 md:h-24 w-full text-center text-sm p-0 relative border-b border-r border-border/20",
                                isSelected ? "bg-primary/5 text-primary" : "hover:bg-secondary/50",
                                isToday ? "bg-accent/30" : ""
                              )}>
                                <Popover>
                                  <PopoverTrigger asChild>
                                    <button 
                                      className="w-full h-full flex flex-col items-center pt-2 gap-1 outline-none focus:bg-secondary/50"
                                      onClick={() => setDate(dayDate)}
                                    >
                                      <span className={cn(
                                        "text-sm font-medium h-7 w-7 flex items-center justify-center rounded-full",
                                        isToday ? "bg-primary text-primary-foreground" : ""
                                      )}>{dayDate.getDate()}</span>
                                      
                                      <div className="flex flex-wrap justify-center gap-1 w-full px-1 mt-1">
                                        {hasExam && (
                                          <div className="h-2 w-full mx-2 rounded-full bg-destructive animate-pulse" title="Exam Day" />
                                        )}
                                        
                                        {events.slice(0, 3).map((e: any) => (
                                          <div key={e.id} className={cn("h-1.5 w-1.5 rounded-full", e.color)} title={e.title} />
                                        ))}
                                        {events.length > 3 && <span className="text-[10px] leading-none text-muted-foreground">+</span>}
                                      </div>
                                    </button>
                                  </PopoverTrigger>
                                  {(hasExam || hasEvent) && (
                                    <PopoverContent className="w-64 p-3" align="center">
                                      <div className="space-y-2">
                                        <h4 className="font-semibold text-sm border-b pb-1 mb-2">{format(dayDate, "MMMM d, yyyy")}</h4>
                                        {exams.map(exam => (
                                          <div key={exam.id} className="bg-destructive text-destructive-foreground p-2 rounded text-sm">
                                            <div className="font-bold">EXAM: {exam.name}</div>
                                            <div className="text-xs opacity-90">Score: {exam.studyScore}</div>
                                          </div>
                                        ))}
                                        {events.map((event: any) => (
                                          <div key={event.id} className={cn("text-white p-2 rounded text-sm relative group", event.color)}>
                                            <div className="font-medium">{event.title}</div>
                                            {event.description && <div className="text-xs opacity-90">{event.description}</div>}
                                            <div className="text-xs opacity-75 capitalize mt-1">{event.type}</div>
                                            <button 
                                              onClick={(e) => { e.stopPropagation(); deletePersonalEvent(event.id); }}
                                              className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 hover:text-red-200"
                                            >
                                              <Trash2 className="h-3 w-3" />
                                            </button>
                                          </div>
                                        ))}
                                      </div>
                                    </PopoverContent>
                                  )}
                                </Popover>
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
              <Card className="border-l-4 border-l-secondary shadow-md">
                 <CardHeader>
                    <CardTitle className="font-serif">
                       {date ? format(date, "MMMM d, yyyy") : "Select a date"}
                    </CardTitle>
                    <CardDescription>
                       Daily Overview
                    </CardDescription>
                 </CardHeader>
                 <CardContent>
                    <div className="space-y-4">
                       {date && getAllForDate(date).length > 0 ? (
                          getAllForDate(date).map((item: any) => (
                             <div key={item.id} className={cn(
                               "p-4 rounded-lg shadow-sm text-white relative group transition-all hover:scale-[1.02]", 
                               item.isExam ? "bg-destructive" : item.color
                             )}>
                                {item.isExam ? (
                                  <>
                                    <span className="text-xs font-bold uppercase tracking-wider opacity-80 mb-1 block">Exam Day</span>
                                    <h3 className="font-bold text-lg">{item.name}</h3>
                                    <p className="text-sm opacity-90 mt-1">Preparedness: {item.studyScore}%</p>
                                  </>
                                ) : (
                                  <>
                                    <div className="flex justify-between items-start">
                                      <span className="text-xs font-bold uppercase tracking-wider opacity-80 mb-1 block">{item.type}</span>
                                      <button onClick={() => deletePersonalEvent(item.id)} className="opacity-0 group-hover:opacity-100 hover:text-red-200 transition-opacity">
                                        <Trash2 className="h-4 w-4" />
                                      </button>
                                    </div>
                                    <h3 className="font-bold text-lg">{item.title}</h3>
                                    <p className="text-sm opacity-90 mt-1">{item.description}</p>
                                  </>
                                )}
                             </div>
                          ))
                       ) : (
                          <div className="text-center py-10 text-muted-foreground border-2 border-dashed rounded-lg">
                             <p>Nothing scheduled.</p>
                             <div className="mt-4">
                               <AddEventDialog defaultDate={date}>
                                 <Button variant="outline" size="sm">
                                   <Plus className="mr-2 h-3 w-3" /> Add Event
                                 </Button>
                               </AddEventDialog>
                             </div>
                          </div>
                       )}
                    </div>
                 </CardContent>
              </Card>

              {/* Upcoming Exams Stack */}
              <Card className="shadow-md">
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
                          "relative p-4 bg-card border rounded-lg shadow-sm transition-all hover:translate-x-1 hover:shadow-md cursor-pointer", 
                          index !== 0 && "-mt-2"
                        )}
                        style={{ zIndex: upcomingExams.length - index }}
                        onClick={() => setDate(parseISO(subject.examDate))}
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="font-semibold">{subject.name}</h4>
                            <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
                              <CalendarIcon className="h-3 w-3" />
                              {format(parseISO(subject.examDate), "MMM d, yyyy")}
                            </p>
                          </div>
                          <Badge variant="destructive">
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
