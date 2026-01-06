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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { useStudy } from "@/lib/study-context";
import { Plus, CheckCircle2 } from "lucide-react";

export function LogStudyDialog({ children }: { children?: React.ReactNode }) {
  const { subjects, problems, addLog } = useStudy();
  const [open, setOpen] = useState(false);
  const [selectedSubject, setSelectedSubject] = useState<string>("");
  const [duration, setDuration] = useState("");
  const [description, setDescription] = useState("");
  const [solvedProblem, setSolvedProblem] = useState<string>("none");

  const selectedSubjectId = selectedSubject ? parseInt(selectedSubject) : null;
  const activeProblems = problems.filter(p => p.subjectId === selectedSubjectId && p.status === "active");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSubject || !duration) return;

    addLog({
      subjectId: parseInt(selectedSubject),
      durationMinutes: parseInt(duration),
      description: description || "Study session",
      date: new Date().toISOString().split("T")[0],
      solvedProblemId: solvedProblem !== "none" ? parseInt(solvedProblem) : undefined
    });

    setOpen(false);
    // Reset form
    setSelectedSubject("");
    setDuration("");
    setDescription("");
    setSolvedProblem("none");
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children || (
          <Button className="w-full justify-start gap-2 shadow-sm" data-testid="button-log-study">
            <div className="flex h-5 w-5 items-center justify-center rounded bg-white/20">
              <Plus className="h-3.5 w-3.5" />
            </div>
            Log Study Session
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Log Study Session</DialogTitle>
          <DialogDescription>
            Record your progress. Solving problems improves your subject score significantly.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="subject">Subject</Label>
            <Select value={selectedSubject} onValueChange={setSelectedSubject}>
              <SelectTrigger id="subject">
                <SelectValue placeholder="Select subject" />
              </SelectTrigger>
              <SelectContent>
                {subjects.map((s) => (
                  <SelectItem key={s.id} value={String(s.id)}>{s.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="duration">Duration (min)</Label>
              <Input 
                id="duration" 
                type="number" 
                placeholder="60" 
                value={duration} 
                onChange={(e) => setDuration(e.target.value)}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="date">Date</Label>
              <Input id="date" type="date" defaultValue={new Date().toISOString().split("T")[0]} disabled />
            </div>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="description">What did you study?</Label>
            <Textarea 
              id="description" 
              placeholder="Reviewed chapter 4..." 
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          {selectedSubject && activeProblems.length > 0 && (
            <div className="grid gap-2 p-3 bg-secondary/30 rounded-md border border-secondary">
              <Label className="flex items-center gap-2 text-primary">
                <CheckCircle2 className="h-4 w-4" />
                Did you solve a problem?
              </Label>
              <Select 
                value={solvedProblem} 
                onValueChange={(value) => {
                  if (value) {
                    setSolvedProblem(value);
                  }
                }}
              >
                <SelectTrigger className="bg-background">
                  <SelectValue placeholder="Select solved problem" />
                </SelectTrigger>
                <SelectContent position="popper" sideOffset={4}>
                  <SelectItem value="none">No specific problem solved</SelectItem>
                  {activeProblems.map((p) => (
                    <SelectItem key={p.id} value={String(p.id)}>
                      <span className="block max-w-[280px] truncate">{p.description}</span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
          
          <DialogFooter>
            <Button type="submit">Save Log</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
