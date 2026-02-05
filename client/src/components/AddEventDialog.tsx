import { Button } from "@/components/ui/button";
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
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useState, useEffect } from "react";
import { useStudy } from "@/lib/study-context";

const eventSchema = z.object({
  title: z.string().min(2, "Title is too short"),
  description: z.string().optional(),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format"),
  type: z.enum(["class", "appointment", "training", "other"]),
});

type EventFormValues = z.infer<typeof eventSchema>;

export function AddEventDialog({ children, defaultDate }: { children: React.ReactNode; defaultDate?: Date }) {
  const [open, setOpen] = useState(false);
  const { addPersonalEvent, personalEvents } = useStudy();
  
  const previousTitles = [...new Set(personalEvents.map((e: any) => e.title))].filter(Boolean);
  
  const formatDateLocal = (date: Date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const { register, handleSubmit, formState: { errors }, reset, setValue } = useForm<EventFormValues>({
    resolver: zodResolver(eventSchema),
    defaultValues: {
      type: "appointment",
      date: defaultDate ? formatDateLocal(defaultDate) : formatDateLocal(new Date())
    }
  });

  useEffect(() => {
    if (open && defaultDate) {
      setValue("date", formatDateLocal(defaultDate));
    }
  }, [open, defaultDate, setValue]);

  const onSubmit = (data: EventFormValues) => {
    let color = "bg-slate-500";
    switch(data.type) {
      case "class": color = "bg-blue-500"; break;
      case "appointment": color = "bg-purple-500"; break;
      case "training": color = "bg-emerald-500"; break;
      case "other": color = "bg-gray-500"; break;
    }

    addPersonalEvent({
      ...data,
      color
    });
    setOpen(false);
    reset();
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add Personal Event</DialogTitle>
          <DialogDescription>
            Schedule a training, appointment, or class.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="title">Event Title</Label>
            {previousTitles.length > 0 ? (
              <>
                <select
                  {...register("title")}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                  defaultValue=""
                >
                  <option value="" disabled>Select or type below...</option>
                  {previousTitles.map((title) => (
                    <option key={title} value={title}>{title}</option>
                  ))}
                </select>
                <Input 
                  id="title-custom" 
                  placeholder="Or type a new title..."
                  onChange={(e) => setValue("title", e.target.value)}
                  className="mt-2"
                />
              </>
            ) : (
              <Input 
                id="title" 
                {...register("title")} 
                placeholder="e.g. Dentist Appointment"
              />
            )}
            {errors.title && <p className="text-sm text-destructive">{errors.title.message}</p>}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="type">Type</Label>
            <select
              {...register("type")}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
            >
              <option value="class">Class</option>
              <option value="appointment">Appointment</option>
              <option value="training">Training</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="date">Date</Label>
            <Input id="date" type="date" {...register("date")} />
            {errors.date && <p className="text-sm text-destructive">{errors.date.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description (Optional)</Label>
            <Input id="description" {...register("description")} placeholder="Details..." />
          </div>

          <DialogFooter>
            <Button type="submit">Add Event</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
