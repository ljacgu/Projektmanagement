import { Layout } from "@/components/Layout";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useStudy } from "@/lib/study-context";
import { useState } from "react";
import { format, parseISO, isSameDay, addDays, startOfWeek, endOfWeek, eachDayOfInterval, isAfter } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Clock, Calendar as CalendarIcon, Grid, Plus, Trash2, AlertTriangle, BookOpen, Sparkles } from "lucide-react";
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

  const upcomingExams = subjects
    .filter(s => {
      try {
        if (!s.examDate) return false;
        const examDate = parseISO(s.examDate);
        if (isNaN(examDate.getTime())) return false;
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        return isAfter(examDate, yesterday);
      } catch (e) {
        return false;
      }
    })
    .sort((a, b) => {
      try {
        return parseISO(a.examDate).getTime() - parseISO(b.examDate).getTime();
      } catch (e) {
        return 0;
      }
    });

  const getExamsForDate = (day: Date) => {
    if (!day || !(day instanceof Date) || isNaN(day.getTime())) return [];
    return subjects.filter(s => {
      try {
        return isSameDay(parseISO(s.examDate), day);
      } catch (e) { return false; }
    });
  };

  const getEventsForDate = (day: Date) => {
    if (!day || !(day instanceof Date) || isNaN(day.getTime())) return [];
    return personalEvents.filter(e => {
      try {
        return isSameDay(parseISO(e.date), day);
      } catch (e) { return false; }
    });
  };

  const getAllForDate = (day: Date) => {
    const exams = getExamsForDate(day).map(e => ({ ...e, isExam: true }));
    const events = getEventsForDate(day).map(e => ({ ...e, isExam: false }));
    return [...exams, ...events];
  };

  const getDayInfo = (day: Date) => {
    const exams = getExamsForDate(day);
    const events = getEventsForDate(day);
    const totalItems = exams.length + events.length;
    
    if (exams.length > 0) {
      return { level: 4, color: "red", bgClass: "bg-red-500", borderClass: "ring-4 ring-red-400/60", label: "EXAM" };
    }
    if (totalItems >= 3) {
      return { level: 3, color: "orange", bgClass: "bg-orange-500", borderClass: "ring-2 ring-orange-400/50", label: "Busy" };
    }
    if (totalItems === 2) {
      return { level: 2, color: "yellow", bgClass: "bg-amber-400", borderClass: "ring-2 ring-amber-400/40", label: "Moderate" };
    }
    if (totalItems === 1) {
      return { level: 1, color: "green", bgClass: "bg-emerald-500", borderClass: "ring-1 ring-emerald-400/30", label: "Light" };
    }
    return { level: 0, color: "none", bgClass: "", borderClass: "", label: "Free" };
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
          const dayInfo = getDayInfo(day);
          
          return (
            <div 
              key={day.toISOString()} 
              className={cn(
                "flex gap-4 p-4 rounded-xl border-2 transition-all",
                isToday ? "bg-primary/5 border-primary/30 shadow-md" : "bg-card border-border/50",
                dayInfo.level >= 3 && "border-l-4",
                dayInfo.level === 4 && "border-l-red-500",
                dayInfo.level === 3 && "border-l-orange-500"
              )}
            >
              <div className="flex flex-col items-center justify-center min-w-[70px] border-r pr-4">
                <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">{format(day, "EEE")}</span>
                <span className={cn(
                  "text-3xl font-bold font-serif",
                  isToday ? "text-primary" : "text-foreground"
                )}>{format(day, "d")}</span>
                {dayInfo.level > 0 && (
                  <div className={cn("h-2 w-8 rounded-full mt-2", dayInfo.bgClass)} />
                )}
              </div>
              <div className="flex-1 space-y-2">
                {allEvents.length > 0 ? (
                  allEvents.map((item: any) => (
                    <div 
                      key={item.id} 
                      className={cn(
                        "p-3 rounded-lg text-sm font-medium flex justify-between items-center shadow-sm", 
                        item.isExam ? "bg-red-500 text-white" : item.color + " text-white"
                      )}
                    >
                      <div className="flex items-center gap-2">
                        {item.isExam && <AlertTriangle className="h-4 w-4" />}
                        {item.isExam && <Badge variant="outline" className="bg-white/20 border-white/40 text-white text-xs">EXAM</Badge>}
                        <span>{item.name || item.title}</span>
                      </div>
                      {item.isExam && <span className="text-xs bg-white/20 px-2 py-0.5 rounded">Score: {item.studyScore}%</span>}
                      {!item.isExam && (
                        <Button variant="ghost" size="icon" className="h-6 w-6 text-white hover:bg-white/20" onClick={() => deletePersonalEvent(item.id)}>
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      )}
                    </div>
                  ))
                ) : (
                  <div className="text-sm text-muted-foreground italic py-2 flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-emerald-400" />
                    Free day - perfect for studying!
                  </div>
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
               <Button className="gap-2 shadow-sm" data-testid="button-add-event">
                 <Plus className="h-4 w-4" /> Add Event
               </Button>
             </AddEventDialog>
             <div className="flex bg-secondary p-1 rounded-lg ml-auto lg:ml-0">
               <Button 
                 variant={view === "month" ? "default" : "ghost"} 
                 size="sm" 
                 onClick={() => setView("month")}
                 className="text-xs"
                 data-testid="button-view-month"
               >
                 Month
               </Button>
               <Button 
                 variant={view === "2week" ? "default" : "ghost"} 
                 size="sm" 
                 onClick={() => setView("2week")}
                 className="text-xs"
                 data-testid="button-view-2week"
               >
                 2 Weeks
               </Button>
               <Button 
                 variant={view === "week" ? "default" : "ghost"} 
                 size="sm" 
                 onClick={() => setView("week")}
                 className="text-xs"
                 data-testid="button-view-week"
               >
                 Week
               </Button>
               <Button 
                 variant={view === "day" ? "default" : "ghost"} 
                 size="sm" 
                 onClick={() => setView("day")}
                 className="text-xs"
                 data-testid="button-view-day"
               >
                 Day
               </Button>
             </div>
          </div>
        </div>

        <div className="flex flex-wrap gap-6 p-4 bg-gradient-to-r from-secondary/50 to-secondary/20 rounded-xl border shadow-sm">
          <div className="flex items-center gap-2 text-sm font-semibold">
            <CalendarIcon className="h-4 w-4 text-primary" />
            <span>Legend:</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <div className="h-4 w-4 rounded-full bg-red-500 shadow-sm animate-pulse" />
            <span className="font-medium text-red-700 dark:text-red-400">Exam Day</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <div className="h-4 w-4 rounded-full bg-orange-500 shadow-sm" />
            <span>Very Busy (3+)</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <div className="h-4 w-4 rounded-full bg-amber-400 shadow-sm" />
            <span>Busy (2)</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <div className="h-4 w-4 rounded-full bg-emerald-500 shadow-sm" />
            <span>Light (1)</span>
          </div>
        </div>

        <div className="grid gap-8 md:grid-cols-12 h-full">
           <div className="col-span-12 md:col-span-8 lg:col-span-8 flex flex-col h-full min-h-[650px]">
              <Card className="flex-1 flex flex-col shadow-lg border-2">
                <CardContent className="p-6 md:p-8 flex-1">
                   {view === "month" ? (
                     <Calendar
                        mode="single"
                        selected={date}
                        onSelect={setDate}
                        className="w-full h-full flex flex-col"
                        classNames={{
                          months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0 w-full flex-1",
                          month: "space-y-4 w-full flex flex-col flex-1",
                          caption: "flex justify-center pt-1 relative items-center mb-6",
                          caption_label: "text-2xl font-bold font-serif tracking-tight",
                          nav: "space-x-2 flex items-center",
                          nav_button: "h-10 w-10 bg-secondary hover:bg-primary hover:text-primary-foreground rounded-full p-0 opacity-70 hover:opacity-100 transition-all shadow-sm",
                          table: "w-full border-collapse flex-1 h-full",
                          head_row: "flex w-full mb-2",
                          head_cell: "text-muted-foreground rounded-lg w-full font-bold text-sm uppercase tracking-wider py-3 bg-secondary/30",
                          row: "flex w-full mt-1 flex-1",
                          cell: "h-20 md:h-28 w-full text-center text-sm p-0.5 relative focus-within:relative focus-within:z-20",
                          day: "h-full w-full p-0 font-normal aria-selected:opacity-100 transition-all flex flex-col items-center justify-start pt-1 gap-1 rounded-xl",
                          day_selected: "bg-primary/10 text-primary ring-2 ring-primary/30",
                          day_today: "bg-accent/50 text-accent-foreground font-bold",
                          day_outside: "text-muted-foreground opacity-30",
                          day_disabled: "text-muted-foreground opacity-30",
                          day_hidden: "invisible",
                        }}
                        components={{
                          Day: (props: any) => {
                            const dayDate = props.date || props.day;
                            const displayMonth = props.displayMonth;

                            if (!dayDate) return <div className="invisible" />;
                            if (!(dayDate instanceof Date) || isNaN(dayDate.getTime())) return <div className="invisible" />;

                            if (displayMonth && dayDate.getMonth() !== displayMonth.getMonth() && props.hidden) {
                                return <div className="invisible" />;
                            }
                            
                            const exams = getExamsForDate(dayDate);
                            const events = getEventsForDate(dayDate);
                            const hasExam = exams.length > 0;
                            const hasEvent = events.length > 0;
                            const isSelected = date && isSameDay(date, dayDate);
                            const isToday = isSameDay(dayDate, new Date());
                            const dayInfo = getDayInfo(dayDate);
                            const isCurrentMonth = displayMonth && dayDate.getMonth() === displayMonth.getMonth();
                            
                            return (
                              <div className={cn(
                                "h-20 md:h-28 w-full text-center text-sm p-1 relative transition-all rounded-xl",
                                isSelected ? "bg-primary/10 ring-2 ring-primary/40" : "hover:bg-secondary/60",
                                isToday ? "bg-gradient-to-br from-primary/20 to-primary/5" : "",
                                !isCurrentMonth && "opacity-30",
                                dayInfo.level >= 3 && isCurrentMonth && "shadow-md"
                              )}>
                                <Popover>
                                  <PopoverTrigger asChild>
                                    <button 
                                      className="w-full h-full flex flex-col items-center pt-1 gap-1 outline-none focus:ring-2 focus:ring-primary/50 rounded-lg"
                                      onClick={() => setDate(dayDate)}
                                      data-testid={`calendar-day-${format(dayDate, 'yyyy-MM-dd')}`}
                                    >
                                      <div className={cn(
                                        "text-lg md:text-xl font-bold h-8 w-8 md:h-10 md:w-10 flex items-center justify-center rounded-full transition-all font-serif",
                                        isToday ? "bg-primary text-primary-foreground shadow-lg scale-110" : "",
                                        hasExam && !isToday ? "bg-red-500 text-white shadow-md animate-pulse" : "",
                                        !isToday && !hasExam && "hover:bg-secondary"
                                      )}>
                                        {dayDate.getDate()}
                                      </div>
                                      
                                      {hasExam && (
                                        <div className="flex items-center justify-center gap-1 w-full px-1 bg-red-500 text-white rounded-md py-0.5 shadow-sm">
                                          <AlertTriangle className="h-3 w-3" />
                                          <span className="text-[10px] font-bold truncate">EXAM</span>
                                        </div>
                                      )}
                                      
                                      {!hasExam && dayInfo.level > 0 && (
                                        <div className={cn(
                                          "flex items-center justify-center gap-1 w-full px-2 rounded-md py-0.5",
                                          dayInfo.bgClass,
                                          "text-white shadow-sm"
                                        )}>
                                          <span className="text-[10px] font-semibold">
                                            {events.length} event{events.length > 1 ? 's' : ''}
                                          </span>
                                        </div>
                                      )}
                                      
                                      <div className="flex flex-wrap justify-center gap-0.5 w-full px-1 mt-auto">
                                        {events.slice(0, 3).map((e: any) => (
                                          <div 
                                            key={e.id} 
                                            className={cn("h-1.5 flex-1 max-w-[20px] rounded-full shadow-sm", e.color)} 
                                            title={e.title} 
                                          />
                                        ))}
                                        {events.length > 3 && (
                                          <span className="text-[9px] text-muted-foreground font-medium">+{events.length - 3}</span>
                                        )}
                                      </div>
                                    </button>
                                  </PopoverTrigger>
                                  {(hasExam || hasEvent) && (
                                    <PopoverContent className="w-80 p-4 shadow-xl border-2" align="center">
                                      <div className="space-y-3">
                                        <div className="flex items-center justify-between border-b pb-2">
                                          <h4 className="font-bold text-lg font-serif">{format(dayDate, "MMMM d, yyyy")}</h4>
                                          {dayInfo.level > 0 && (
                                            <Badge className={cn(dayInfo.bgClass, "text-white border-0")}>
                                              {dayInfo.label}
                                            </Badge>
                                          )}
                                        </div>
                                        {exams.map(exam => (
                                          <div key={exam.id} className="bg-gradient-to-r from-red-500 to-red-600 text-white p-4 rounded-xl shadow-lg" data-testid={`exam-popup-${exam.id}`}>
                                            <div className="flex items-center gap-2 mb-2">
                                              <AlertTriangle className="h-5 w-5 animate-pulse" />
                                              <span className="font-bold uppercase tracking-wide text-xs bg-white/20 px-2 py-0.5 rounded">Exam Day</span>
                                            </div>
                                            <div className="font-bold text-xl">{exam.name}</div>
                                            <div className="text-sm opacity-90 mt-2 flex items-center gap-2">
                                              <BookOpen className="h-4 w-4" />
                                              Preparedness: {exam.studyScore}%
                                            </div>
                                          </div>
                                        ))}
                                        {events.map((event: any) => (
                                          <div key={event.id} className={cn("text-white p-4 rounded-xl shadow-md relative group", event.color)} data-testid={`event-popup-${event.id}`}>
                                            <div className="font-semibold text-lg">{event.title}</div>
                                            {event.description && <div className="text-sm opacity-90 mt-1">{event.description}</div>}
                                            <div className="text-xs opacity-75 capitalize mt-2 flex items-center gap-1">
                                              <Clock className="h-3 w-3" />
                                              {event.type}
                                            </div>
                                            <button 
                                              onClick={(e) => { e.stopPropagation(); deletePersonalEvent(event.id); }}
                                              className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 hover:text-red-200 transition-all p-1 rounded-full hover:bg-white/20"
                                              data-testid={`button-delete-event-${event.id}`}
                                            >
                                              <Trash2 className="h-4 w-4" />
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
              <Card className="border-l-4 border-l-primary shadow-lg">
                 <CardHeader>
                    <CardTitle className="font-serif text-xl">
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
                               "p-4 rounded-xl shadow-md text-white relative group transition-all hover:scale-[1.02] hover:shadow-lg", 
                               item.isExam ? "bg-gradient-to-r from-red-500 to-red-600" : item.color
                             )} data-testid={`daily-item-${item.id}`}>
                                {item.isExam ? (
                                  <>
                                    <div className="flex items-center gap-2 mb-2">
                                      <AlertTriangle className="h-5 w-5 animate-pulse" />
                                      <span className="text-xs font-bold uppercase tracking-wider bg-white/20 px-2 py-0.5 rounded">Exam Day</span>
                                    </div>
                                    <h3 className="font-bold text-xl">{item.name}</h3>
                                    <p className="text-sm opacity-90 mt-2 flex items-center gap-2">
                                      <BookOpen className="h-4 w-4" />
                                      Preparedness: {item.studyScore}%
                                    </p>
                                  </>
                                ) : (
                                  <>
                                    <div className="flex justify-between items-start">
                                      <span className="text-xs font-bold uppercase tracking-wider opacity-80 mb-1 block bg-white/20 px-2 py-0.5 rounded">{item.type}</span>
                                      <button onClick={() => deletePersonalEvent(item.id)} className="opacity-0 group-hover:opacity-100 hover:text-red-200 transition-opacity p-1 rounded-full hover:bg-white/20">
                                        <Trash2 className="h-4 w-4" />
                                      </button>
                                    </div>
                                    <h3 className="font-bold text-lg mt-2">{item.title}</h3>
                                    <p className="text-sm opacity-90 mt-1">{item.description}</p>
                                  </>
                                )}
                             </div>
                          ))
                       ) : (
                          <div className="text-center py-12 text-muted-foreground border-2 border-dashed rounded-xl bg-secondary/20">
                             <Sparkles className="h-8 w-8 mx-auto mb-3 text-emerald-400" />
                             <p className="font-medium">Free day!</p>
                             <p className="text-sm mt-1">Nothing scheduled</p>
                             <div className="mt-4">
                               <AddEventDialog defaultDate={date}>
                                 <Button variant="outline" size="sm" data-testid="button-add-event-empty">
                                   <Plus className="mr-2 h-3 w-3" /> Add Event
                                 </Button>
                               </AddEventDialog>
                             </div>
                          </div>
                       )}
                    </div>
                 </CardContent>
              </Card>

              <Card className="shadow-lg">
                <CardHeader className="bg-gradient-to-r from-red-500/10 to-red-500/5 rounded-t-lg">
                  <CardTitle className="font-serif flex items-center gap-2 text-lg">
                    <AlertTriangle className="h-5 w-5 text-red-500" />
                    Upcoming Exams
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-4">
                  <div className="space-y-0">
                    {upcomingExams.map((subject, index) => (
                      <div 
                        key={subject.id} 
                        className={cn(
                          "relative p-4 bg-card border-2 rounded-xl shadow-sm transition-all hover:translate-x-1 hover:shadow-md cursor-pointer border-l-4 border-l-red-500", 
                          index !== 0 && "-mt-2"
                        )}
                        style={{ zIndex: upcomingExams.length - index }}
                        onClick={() => setDate(parseISO(subject.examDate))}
                        data-testid={`upcoming-exam-${subject.id}`}
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="font-bold">{subject.name}</h4>
                            <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
                              <CalendarIcon className="h-3 w-3" />
                              {format(parseISO(subject.examDate), "MMM d, yyyy")}
                            </p>
                          </div>
                          <Badge variant="destructive" className="font-bold">
                            {subject.studyScore}%
                          </Badge>
                        </div>
                      </div>
                    ))}
                    {upcomingExams.length === 0 && (
                      <div className="text-center py-6 text-muted-foreground">
                        <BookOpen className="h-8 w-8 mx-auto mb-2 opacity-30" />
                        <p className="text-sm">No upcoming exams</p>
                      </div>
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
