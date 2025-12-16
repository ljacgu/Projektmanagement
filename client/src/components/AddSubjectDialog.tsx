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
import { useState } from "react";
import { useStudy } from "@/lib/study-context";
import { Plus } from "lucide-react";

export function AddSubjectDialog({ children }: { children?: React.ReactNode }) {
  const { addSubject } = useStudy();
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [examDate, setExamDate] = useState("");
  const [targetHours, setTargetHours] = useState("20");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !examDate || !targetHours) return;

    addSubject({
      name,
      examDate,
      targetHours: parseInt(targetHours)
    });

    setOpen(false);
    setName("");
    setExamDate("");
    setTargetHours("20");
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children || (
          <Button>
            <Plus className="mr-2 h-4 w-4" /> Add Subject
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New Subject</DialogTitle>
          <DialogDescription>
            Track a new course, set your goal, and exam date.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="name">Subject Name</Label>
            <Input
              id="name"
              placeholder="e.g. Linear Algebra"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="examDate">Exam Date</Label>
            <Input
              id="examDate"
              type="date"
              value={examDate}
              onChange={(e) => setExamDate(e.target.value)}
              required
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="targetHours">Self-study Workload (Hours)</Label>
            <Input
              id="targetHours"
              type="number"
              min="1"
              value={targetHours}
              onChange={(e) => setTargetHours(e.target.value)}
              required
            />
            <p className="text-xs text-muted-foreground">Estimate hours needed to prepare fully.</p>
          </div>
          <DialogFooter>
            <Button type="submit">Create Subject</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
