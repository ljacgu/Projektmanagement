import { Layout } from "@/components/Layout";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useStudy } from "@/lib/study-context";
import { useState } from "react";
import { format, parseISO, isSameDay } from "date-fns";
import { Badge } from "@/components/ui/badge";

export default function CalendarPage() {
  const { subjects } = useStudy();
  const [date, setDate] = useState<Date | undefined>(new Date());

  const examDays = subjects.map(s => parseISO(s.examDate));
  
  const getExamsForDate = (day: Date) => {
    return subjects.filter(s => isSameDay(parseISO(s.examDate), day));
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-serif font-bold tracking-tight">Study Calendar</h1>
          <p className="text-muted-foreground">Plan your study sessions and track exam dates.</p>
        </div>

        <div className="grid gap-6 md:grid-cols-12">
           <div className="col-span-12 md:col-span-8 lg:col-span-8">
              <Card className="h-full">
                <CardContent className="p-6">
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
                    />
                </CardContent>
              </Card>
           </div>
           
           <div className="col-span-12 md:col-span-4 lg:col-span-4">
              <Card className="h-full border-l-4 border-l-secondary">
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
                             <div key={subject.id} className="p-4 rounded-lg bg-rose-50 border border-rose-200 text-rose-900 shadow-sm">
                                <span className="text-xs font-bold uppercase tracking-wider text-rose-600 mb-1 block">Exam Day</span>
                                <h3 className="font-bold text-lg">{subject.name}</h3>
                                <p className="text-sm opacity-80 mt-1">Good luck! You prepared well.</p>
                             </div>
                          ))
                       ) : (
                          <div className="text-center py-10 text-muted-foreground">
                             <p>No exams scheduled for this day.</p>
                             <p className="text-sm mt-2">Perfect day for a study session.</p>
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
