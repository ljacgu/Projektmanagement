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
import { useState } from "react";
import { useStudy } from "@/lib/study-context";
import { Upload } from "lucide-react";

const resultSchema = z.object({
  grade: z.coerce.number().min(1.0, "Grade cannot be better than 1.0").max(5.0, "Grade cannot be worse than 5.0"),
  notes: z.string().optional(),
  file: z.any().optional(), // In a real app we'd validate file type
});

type ResultFormValues = z.infer<typeof resultSchema>;

export function SubjectResultDialog({ children, subjectId, subjectName }: { children: React.ReactNode; subjectId: number; subjectName: string }) {
  const [open, setOpen] = useState(false);
  const { updateSubject, addFile, subjects } = useStudy();
  
  const subject = subjects.find(s => s.id === subjectId);
  
  const { register, handleSubmit, formState: { errors }, reset } = useForm<ResultFormValues>({
    resolver: zodResolver(resultSchema),
    defaultValues: {
      grade: subject?.grade ? subject.grade / 10 : 4.0,
      notes: subject?.notes || ""
    }
  });

  const onSubmit = (data: ResultFormValues) => {
    // 1. Update grade and notes (convert to integer for storage)
    updateSubject(Number(subjectId), { 
      grade: Math.round(data.grade * 10),
      notes: data.notes 
    });

    // 2. Mock file upload if file provided
    if (data.file && data.file.length > 0) {
        const file = data.file[0];
        addFile(Number(subjectId), {
            name: file.name,
            type: "exam_result",
            size: `${(file.size / 1024).toFixed(1)} KB`,
            url: "#",
            uploadedAt: new Date().toISOString().split("T")[0],
        });
    }

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
          <DialogTitle>Exam Results: {subjectName}</DialogTitle>
          <DialogDescription>
            Record your grade (1.0 - 5.0), notes, and upload exam summary.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="grade">Grade (1.0 Best - 5.0 Worst)</Label>
            <Input 
                id="grade" 
                type="number" 
                step="0.1" 
                min="1.0" 
                max="5.0"
                {...register("grade")} 
            />
            {errors.grade && <p className="text-sm text-destructive">{errors.grade.message}</p>}
            <p className="text-xs text-muted-foreground">Passed: &le; 4.4, Failed: &gt; 4.4</p>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="notes">Exam Notes</Label>
            <textarea 
              id="notes" 
              className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              placeholder="Reflections, topics to review, or general notes..."
              {...register("notes")}
            />
          </div>

          <div className="space-y-2">
             <Label htmlFor="file">Upload Summary / Certificate</Label>
             <div className="flex items-center gap-2">
                <Input id="file" type="file" {...register("file")} className="cursor-pointer" />
             </div>
          </div>

          <DialogFooter>
            <Button type="submit">Save Result</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
