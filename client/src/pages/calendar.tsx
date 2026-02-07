import { Layout } from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useStudy } from "@/lib/study-context";
import { useState } from "react";
import { format, parseISO, isSameDay, addDays, startOfWeek, endOfWeek, eachDayOfInterval, isAfter, startOfMonth, endOfMonth, getDay, addMonths, subMonths } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Clock, Calendar as CalendarIcon, Plus, Trash2, AlertTriangle, BookOpen, Sparkles, ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { AddEventDialog } from "@/components/AddEventDialog";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

export default function CalendarPage() {
  const { subjects, personalEvents, deletePersonalEvent } = useStudy();
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date());
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
        return s.examDate && isSameDay(parseISO(s.examDate), day);
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
      return { level: 4, color: "red", bgClass: "bg-red-500", label: "EXAM" };
    }
    if (totalItems >= 3) {
      return { level: 3, color: "orange", bgClass: "bg-orange-500", label: "Busy" };
    }
    if (totalItems === 2) {
      return { level: 2, color: "yellow", bgClass: "bg-amber-400", label: "Moderate" };
    }
    if (totalItems === 1) {
      return { level: 1, color: "green", bgClass: "bg-emerald-500", label: "Light" };
    }
    return { level: 0, color: "none", bgClass: "", label: "Free" };
  };

  const getMonthDays = () => {
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(currentMonth);
    const startDate = startOfWeek(monthStart, { weekStartsOn: 1 });
    const endDate = endOfWeek(monthEnd, { weekStartsOn: 1 });
    return eachDayOfInterval({ start: startDate, end: endDate });
  };

  const renderMonthView = () => {
    const days = getMonthDays();
    const weekDaysFull = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
    const weekDaysShort = ["M", "T", "W", "T", "F", "S", "S"];
    
    return (
      <div className="flex flex-col h-full">
        <div className="flex items-center justify-between mb-4 md:mb-6">
          <Button variant="outline" size="icon" onClick={() => setCurrentMonth(subMonths(currentMonth, 1))} className="rounded-full h-9 w-9" data-testid="button-prev-month">
            <ChevronLeft className="h-4 w-4 md:h-5 md:w-5" />
          </Button>
          <h2 className="text-lg md:text-2xl font-bold font-serif" data-testid="text-current-month">{format(currentMonth, "MMMM yyyy")}</h2>
          <Button variant="outline" size="icon" onClick={() => setCurrentMonth(addMonths(currentMonth, 1))} className="rounded-full h-9 w-9" data-testid="button-next-month">
            <ChevronRight className="h-4 w-4 md:h-5 md:w-5" />
          </Button>
        </div>

        <div className="grid grid-cols-7 gap-0.5 md:gap-1 mb-1 md:mb-2">
          {weekDaysFull.map((day, i) => (
            <div key={day} className="text-center text-[10px] md:text-sm font-bold text-muted-foreground uppercase tracking-wider py-1.5 md:py-2 bg-secondary/30 rounded-md md:rounded-lg">
              <span className="hidden md:inline">{day}</span>
              <span className="md:hidden">{weekDaysShort[i]}</span>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-0.5 md:gap-1 flex-1">
          {days.map((day) => {
            const exams = getExamsForDate(day);
            const events = getEventsForDate(day);
            const hasExam = exams.length > 0;
            const hasEvent = events.length > 0;
            const isSelected = isSameDay(selectedDate, day);
            const isToday = isSameDay(day, new Date());
            const dayInfo = getDayInfo(day);
            const isCurrentMonth = day.getMonth() === currentMonth.getMonth();
            
            return (
              <Popover key={day.toISOString()}>
                <PopoverTrigger asChild>
                  <button
                    onClick={() => setSelectedDate(day)}
                    className={cn(
                      "min-h-[56px] md:min-h-[100px] w-full text-left p-0.5 md:p-1.5 rounded-lg md:rounded-xl transition-all flex flex-col items-center",
                      isSelected ? "bg-primary/10 ring-2 ring-primary/40" : "hover:bg-secondary/60",
                      isToday ? "bg-gradient-to-br from-primary/20 to-primary/5" : "",
                      !isCurrentMonth && "opacity-30",
                      dayInfo.level >= 3 && isCurrentMonth && "shadow-md"
                    )}
                    data-testid={`calendar-day-${format(day, 'yyyy-MM-dd')}`}
                  >
                    <div className="flex items-center justify-center mb-0.5 md:mb-1">
                      <span className={cn(
                        "text-sm md:text-xl font-bold h-6 w-6 md:h-10 md:w-10 flex items-center justify-center rounded-full transition-all font-serif",
                        isToday ? "bg-primary text-primary-foreground shadow-lg md:scale-110" : "",
                        hasExam && !isToday ? "bg-red-500 text-white shadow-md" : "",
                        !isToday && !hasExam && "hover:bg-secondary"
                      )}>
                        {day.getDate()}
                      </span>
                    </div>
                    
                    {hasExam && (
                      <div className="hidden md:flex items-center justify-center gap-1 w-full px-1 bg-red-500 text-white rounded-md py-0.5 shadow-sm mb-1">
                        <AlertTriangle className="h-3 w-3" />
                        <span className="text-[10px] font-bold truncate">EXAM</span>
                      </div>
                    )}

                    {hasExam && (
                      <div className="flex md:hidden items-center justify-center w-full">
                        <div className="h-1.5 w-1.5 rounded-full bg-red-500" />
                      </div>
                    )}
                    
                    {!hasExam && dayInfo.level > 0 && (
                      <div className={cn(
                        "hidden md:flex items-center justify-center gap-1 w-full px-1 rounded-md py-0.5 text-white shadow-sm mb-1",
                        dayInfo.bgClass
                      )}>
                        <span className="text-[10px] font-semibold">
                          {events.length} event{events.length > 1 ? 's' : ''}
                        </span>
                      </div>
                    )}

                    {!hasExam && dayInfo.level > 0 && (
                      <div className="flex md:hidden items-center justify-center w-full">
                        <div className={cn("h-1.5 w-1.5 rounded-full", dayInfo.bgClass)} />
                      </div>
                    )}
                    
                    <div className="hidden md:flex flex-wrap justify-center gap-0.5 w-full px-1 mt-auto">
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
                  <PopoverContent className="w-[calc(100vw-2rem)] sm:w-80 p-3 md:p-4 shadow-xl border-2" align="center">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between border-b pb-2">
                        <h4 className="font-bold text-base md:text-lg font-serif">{format(day, "MMMM d, yyyy")}</h4>
                        {dayInfo.level > 0 && (
                          <Badge className={cn(dayInfo.bgClass, "text-white border-0 text-xs")}>
                            {dayInfo.label}
                          </Badge>
                        )}
                      </div>
                      {exams.map(exam => (
                        <div key={exam.id} className="bg-gradient-to-r from-red-500 to-red-600 text-white p-3 md:p-4 rounded-xl shadow-lg" data-testid={`exam-popup-${exam.id}`}>
                          <div className="flex items-center gap-2 mb-2">
                            <AlertTriangle className="h-4 w-4 md:h-5 md:w-5" />
                            <span className="font-bold uppercase tracking-wide text-xs bg-white/20 px-2 py-0.5 rounded">Exam Day</span>
                          </div>
                          <div className="font-bold text-lg md:text-xl">{exam.name}</div>
                          <div className="text-sm opacity-90 mt-2 flex items-center gap-2">
                            <BookOpen className="h-4 w-4" />
                            Preparedness: {exam.studyScore}%
                          </div>
                        </div>
                      ))}
                      {events.map((event: any) => (
                        <div key={event.id} className={cn("text-white p-3 md:p-4 rounded-xl shadow-md relative group", event.color)} data-testid={`event-popup-${event.id}`}>
                          <div className="font-semibold text-base md:text-lg">{event.title}</div>
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
            );
          })}
        </div>
      </div>
    );
  };

  const renderDayCard = (day: Date) => {
    const allEvents = getAllForDate(day);
    const isToday = isSameDay(day, new Date());
    const dayInfo = getDayInfo(day);
    
    return (
      <div 
        key={day.toISOString()} 
        className={cn(
          "flex gap-3 md:gap-4 p-3 md:p-4 rounded-xl border-2 transition-all",
          isToday ? "bg-primary/5 border-primary/30 shadow-md" : "bg-card border-border/50",
          dayInfo.level >= 3 && "border-l-4",
          dayInfo.level === 4 && "border-l-red-500",
          dayInfo.level === 3 && "border-l-orange-500"
        )}
      >
        <div className="flex flex-col items-center justify-center min-w-[55px] md:min-w-[70px] border-r pr-3 md:pr-4">
          <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">{format(day, "EEE")}</span>
          <span className={cn(
            "text-2xl md:text-3xl font-bold font-serif",
            isToday ? "text-primary" : "text-foreground"
          )}>{format(day, "d")}</span>
          {dayInfo.level > 0 && (
            <div className={cn("h-2 w-6 md:w-8 rounded-full mt-2", dayInfo.bgClass)} />
          )}
        </div>
        <div className="flex-1 space-y-2 min-w-0">
          {allEvents.length > 0 ? (
            allEvents.map((item: any) => (
              <div 
                key={item.id} 
                className={cn(
                  "p-2.5 md:p-3 rounded-lg text-sm font-medium flex justify-between items-center shadow-sm text-white", 
                  item.isExam ? "bg-red-500" : item.color
                )}
                data-testid={`agenda-item-${item.id}`}
              >
                <div className="flex items-center gap-2 min-w-0 flex-1">
                  {item.isExam && <AlertTriangle className="h-4 w-4 shrink-0" />}
                  {item.isExam && <Badge variant="outline" className="bg-white/20 border-white/40 text-white text-xs shrink-0">EXAM</Badge>}
                  <span className="truncate">{item.name || item.title}</span>
                </div>
                {item.isExam && <span className="text-xs bg-white/20 px-2 py-0.5 rounded shrink-0 ml-2">{item.studyScore}%</span>}
                {!item.isExam && (
                  <Button variant="ghost" size="icon" className="h-6 w-6 text-white hover:bg-white/20 shrink-0" onClick={() => deletePersonalEvent(item.id)} data-testid={`button-delete-agenda-${item.id}`}>
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
  };

  const renderAgendaView = () => {
    const today = selectedDate || new Date();
    
    if (view === "2week") {
      const weekStart = startOfWeek(today, { weekStartsOn: 1 });
      const currentWeekDays = eachDayOfInterval({ start: weekStart, end: addDays(weekStart, 6) });
      const nextWeekStart = addDays(weekStart, 7);
      const nextWeekDays = eachDayOfInterval({ start: nextWeekStart, end: addDays(nextWeekStart, 6) });
      
      const renderWeekDay = (day: Date) => {
        const allEvents = getAllForDate(day);
        const isTodayDate = isSameDay(day, new Date());
        const isSelected = isSameDay(day, selectedDate);
        const dayInfo = getDayInfo(day);
        
        return (
          <div 
            key={day.toISOString()}
            onClick={() => setSelectedDate(day)}
            className={cn(
              "p-2 md:p-3 rounded-lg md:rounded-xl border-2 cursor-pointer transition-all min-h-[80px] md:min-h-[140px]",
              isSelected ? "ring-2 ring-primary ring-offset-1 md:ring-offset-2 bg-primary/5" : "",
              isTodayDate ? "bg-primary/10 border-primary shadow-lg" : "bg-card hover:bg-secondary/50 border-border",
              dayInfo.level === 4 && "border-red-500",
              dayInfo.level === 3 && "border-orange-500"
            )}
          >
            <div className="text-center mb-1 md:mb-3">
              <div className="text-[10px] md:text-sm font-medium text-muted-foreground">{format(day, "EEE")}</div>
              <div className={cn(
                "text-lg md:text-2xl font-bold mt-0.5 md:mt-1",
                isTodayDate && "text-primary",
                isSelected && !isTodayDate && "text-primary"
              )}>{format(day, "d")}</div>
              <div className="text-[10px] md:text-xs text-muted-foreground hidden sm:block">{format(day, "MMM")}</div>
            </div>
            {dayInfo.level > 0 && (
              <div className={cn("h-1.5 md:h-2 w-full rounded-full mb-1 md:mb-2", dayInfo.bgClass)} />
            )}
            <div className="space-y-1 md:space-y-1.5">
              {allEvents.slice(0, 2).map((item: any) => (
                <div 
                  key={item.id}
                  className={cn(
                    "text-[9px] md:text-xs px-1 md:px-2 py-0.5 md:py-1 rounded text-white truncate font-medium",
                    item.isExam ? "bg-red-500" : item.color
                  )}
                >
                  <span className="hidden sm:inline">{item.name || item.title || ''}</span>
                  <span className="sm:hidden">{(item.name || item.title || '').substring(0, 4)}</span>
                </div>
              ))}
              {allEvents.length > 2 && (
                <div className="text-[9px] md:text-xs text-muted-foreground font-medium text-center">+{allEvents.length - 2}</div>
              )}
            </div>
          </div>
        );
      };
      
      return (
        <div className="space-y-4 md:space-y-6">
          <div className="flex items-center justify-between mb-2 md:mb-4 gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => setSelectedDate(addDays(selectedDate, -14))}
              className="gap-1 md:gap-2 text-xs px-2 md:px-3"
              data-testid="button-prev-2weeks"
            >
              <ChevronLeft className="h-3 w-3 md:h-4 md:w-4" />
              <span className="hidden sm:inline">Previous</span>
            </Button>
            <h2 className="text-sm md:text-lg font-bold font-serif text-center">
              {format(weekStart, "MMM d")} - {format(addDays(nextWeekStart, 6), "MMM d")}
            </h2>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => setSelectedDate(addDays(selectedDate, 14))}
              className="gap-1 md:gap-2 text-xs px-2 md:px-3"
              data-testid="button-next-2weeks"
            >
              <span className="hidden sm:inline">Next</span>
              <ChevronRight className="h-3 w-3 md:h-4 md:w-4" />
            </Button>
          </div>
          
          <div>
            <h3 className="text-xs md:text-sm font-semibold text-muted-foreground mb-2 md:mb-3 uppercase tracking-wider flex items-center gap-2">
              <CalendarIcon className="h-3 w-3 md:h-4 md:w-4" />
              Week of {format(weekStart, "MMM d")}
            </h3>
            <div className="grid grid-cols-7 gap-1 md:gap-3">
              {currentWeekDays.map(renderWeekDay)}
            </div>
          </div>
          
          <div>
            <h3 className="text-xs md:text-sm font-semibold text-muted-foreground mb-2 md:mb-3 uppercase tracking-wider flex items-center gap-2">
              <CalendarIcon className="h-3 w-3 md:h-4 md:w-4" />
              Week of {format(nextWeekStart, "MMM d")}
            </h3>
            <div className="grid grid-cols-7 gap-1 md:gap-3">
              {nextWeekDays.map(renderWeekDay)}
            </div>
          </div>
        </div>
      );
    }

    let start = today;
    let end = today;

    if (view === "week") {
      start = startOfWeek(today, { weekStartsOn: 1 });
      end = endOfWeek(today, { weekStartsOn: 1 });
    }

    const days = eachDayOfInterval({ start, end });

    return (
      <div className="space-y-3 md:space-y-4">
        {days.map((day) => renderDayCard(day))}
      </div>
    );
  };

  return (
    <Layout>
      <div className="space-y-4 md:space-y-6 max-w-[1400px] mx-auto">
        <div className="flex flex-col gap-3 md:gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-serif font-bold tracking-tight">Study Calendar</h1>
            <p className="text-sm md:text-base text-muted-foreground">Manage your exams and personal schedule.</p>
          </div>
          <div className="flex flex-wrap gap-2 items-center">
             <AddEventDialog defaultDate={selectedDate}>
               <Button className="gap-2 shadow-sm" size="sm" data-testid="button-add-event">
                 <Plus className="h-4 w-4" /> Add Event
               </Button>
             </AddEventDialog>
             <div className="flex bg-secondary p-0.5 md:p-1 rounded-lg ml-auto">
               <Button 
                 variant={view === "month" ? "default" : "ghost"} 
                 size="sm" 
                 onClick={() => setView("month")}
                 className="text-[11px] md:text-xs h-7 md:h-8 px-2 md:px-3"
                 data-testid="button-view-month"
               >
                 Month
               </Button>
               <Button 
                 variant={view === "2week" ? "default" : "ghost"} 
                 size="sm" 
                 onClick={() => setView("2week")}
                 className="text-[11px] md:text-xs h-7 md:h-8 px-2 md:px-3"
                 data-testid="button-view-2week"
               >
                 2W
               </Button>
               <Button 
                 variant={view === "week" ? "default" : "ghost"} 
                 size="sm" 
                 onClick={() => setView("week")}
                 className="text-[11px] md:text-xs h-7 md:h-8 px-2 md:px-3"
                 data-testid="button-view-week"
               >
                 Week
               </Button>
               <Button 
                 variant={view === "day" ? "default" : "ghost"} 
                 size="sm" 
                 onClick={() => setView("day")}
                 className="text-[11px] md:text-xs h-7 md:h-8 px-2 md:px-3"
                 data-testid="button-view-day"
               >
                 Day
               </Button>
             </div>
          </div>
        </div>

        <div className="flex flex-wrap gap-3 md:gap-6 p-3 md:p-4 bg-gradient-to-r from-secondary/50 to-secondary/20 rounded-xl border shadow-sm">
          <div className="flex items-center gap-2 text-xs md:text-sm font-semibold">
            <CalendarIcon className="h-3.5 w-3.5 md:h-4 md:w-4 text-primary" />
            <span>Legend:</span>
          </div>
          <div className="flex items-center gap-1.5 text-xs md:text-sm">
            <div className="h-3 w-3 md:h-4 md:w-4 rounded-full bg-red-500 shadow-sm" />
            <span className="font-medium text-red-700 dark:text-red-400">Exam</span>
          </div>
          <div className="flex items-center gap-1.5 text-xs md:text-sm">
            <div className="h-3 w-3 md:h-4 md:w-4 rounded-full bg-orange-500 shadow-sm" />
            <span>Busy</span>
          </div>
          <div className="flex items-center gap-1.5 text-xs md:text-sm">
            <div className="h-3 w-3 md:h-4 md:w-4 rounded-full bg-amber-400 shadow-sm" />
            <span>Mod.</span>
          </div>
          <div className="flex items-center gap-1.5 text-xs md:text-sm">
            <div className="h-3 w-3 md:h-4 md:w-4 rounded-full bg-emerald-500 shadow-sm" />
            <span>Light</span>
          </div>
        </div>

        <div className="grid gap-4 md:gap-8 md:grid-cols-12 h-full">
           <div className="col-span-12 md:col-span-8 lg:col-span-8 flex flex-col h-full min-h-[400px] md:min-h-[650px]">
              <Card className="flex-1 flex flex-col shadow-lg border-2">
                <CardContent className="p-3 md:p-6 lg:p-8 flex-1">
                   {view === "month" ? renderMonthView() : renderAgendaView()}
                </CardContent>
              </Card>
           </div>
           
           <div className="col-span-12 md:col-span-4 lg:col-span-4 space-y-4 md:space-y-6">
              <Card className="border-l-4 border-l-primary shadow-lg">
                 <CardHeader className="p-4 md:p-6">
                    <CardTitle className="font-serif text-lg md:text-xl">
                       {format(selectedDate, "MMMM d, yyyy")}
                    </CardTitle>
                    <CardDescription>
                       Daily Overview
                    </CardDescription>
                 </CardHeader>
                 <CardContent className="p-4 md:p-6 pt-0 md:pt-0">
                    <div className="space-y-3 md:space-y-4">
                       {getAllForDate(selectedDate).length > 0 ? (
                          getAllForDate(selectedDate).map((item: any) => (
                             <div key={item.id} className={cn(
                               "p-3 md:p-4 rounded-xl shadow-md text-white relative group transition-all hover:scale-[1.02] hover:shadow-lg", 
                               item.isExam ? "bg-gradient-to-r from-red-500 to-red-600" : item.color
                             )} data-testid={`daily-item-${item.id}`}>
                                {item.isExam ? (
                                  <>
                                    <div className="flex items-center gap-2 mb-2">
                                      <AlertTriangle className="h-4 w-4 md:h-5 md:w-5" />
                                      <Badge variant="outline" className="bg-white/20 border-white/30 text-white text-xs">EXAM</Badge>
                                    </div>
                                    <div className="font-bold text-base md:text-lg">{item.name}</div>
                                    <div className="text-xs md:text-sm opacity-90 mt-2 flex items-center gap-2">
                                      <BookOpen className="h-3 w-3 md:h-4 md:w-4" />
                                      Prep: {item.studyScore}%
                                    </div>
                                  </>
                                ) : (
                                  <>
                                    <div className="font-semibold text-base md:text-lg pr-8">{item.title}</div>
                                    {item.description && <div className="text-xs md:text-sm opacity-90 mt-1">{item.description}</div>}
                                    <div className="text-xs opacity-75 capitalize mt-2 flex items-center gap-1">
                                      <Clock className="h-3 w-3" />
                                      {item.type}
                                    </div>
                                    <button 
                                      onClick={() => deletePersonalEvent(item.id)}
                                      className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 hover:text-red-200 transition-all p-1 rounded-full hover:bg-white/20"
                                      data-testid={`button-delete-daily-${item.id}`}
                                    >
                                      <Trash2 className="h-4 w-4" />
                                    </button>
                                  </>
                                )}
                             </div>
                          ))
                       ) : (
                          <div className="flex flex-col items-center justify-center py-6 md:py-10 text-muted-foreground">
                             <Sparkles className="h-8 w-8 md:h-10 md:w-10 text-emerald-400 mb-3" />
                             <p className="font-medium text-sm">Free Day</p>
                             <p className="text-xs mt-1">Tap a date with events to see details</p>
                          </div>
                       )}
                    </div>
                 </CardContent>
              </Card>

              <Card className="shadow-lg">
                <CardHeader className="p-4 md:p-6 pb-2 md:pb-2">
                  <CardTitle className="flex items-center gap-2 text-base md:text-lg font-serif">
                    <AlertTriangle className="h-4 w-4 text-red-500" />
                    Upcoming Exams
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4 md:p-6 pt-2 md:pt-2">
                  <div className="space-y-2 md:space-y-3">
                    {upcomingExams.length > 0 ? (
                      upcomingExams.slice(0, 5).map(exam => {
                        const daysLeft = Math.ceil((parseISO(exam.examDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
                        return (
                          <div key={exam.id} className="flex items-center justify-between p-2.5 md:p-3 rounded-lg bg-secondary/50 border" data-testid={`upcoming-exam-${exam.id}`}>
                            <div className="min-w-0 flex-1">
                              <div className="font-medium text-xs md:text-sm truncate">{exam.name}</div>
                              <div className="text-[10px] md:text-xs text-muted-foreground">{format(parseISO(exam.examDate), "MMM d")}</div>
                            </div>
                            <Badge 
                              variant={daysLeft <= 3 ? "destructive" : "secondary"} 
                              className="text-[10px] md:text-xs shrink-0 ml-2"
                            >
                              {daysLeft === 0 ? "Today" : `${daysLeft}d`}
                            </Badge>
                          </div>
                        );
                      })
                    ) : (
                      <p className="text-xs md:text-sm text-muted-foreground text-center py-4">No upcoming exams</p>
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
