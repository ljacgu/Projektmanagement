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
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { useStudy } from "@/lib/study-context";
import { AlertCircle, Plus } from "lucide-react";

interface AddProblemDialogProps {
  children?: React.ReactNode;
  subjectId: number;
  subjectName: string;
}

export function AddProblemDialog({ children, subjectId, subjectName }: AddProblemDialogProps) {
  const { addProblem } = useStudy();
  const [open, setOpen] = useState(false);
  const [description, setDescription] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!description) return;

    addProblem({
      subjectId,
      description,
      createdAt: new Date().toISOString().split("T")[0],
    });

    setOpen(false);
    setDescription("");
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children || (
          <Button variant="outline" size="sm">
            <Plus className="mr-2 h-4 w-4" /> Add Problem
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Report a Problem</DialogTitle>
          <DialogDescription>
            What are you struggling with in <span className="font-semibold">{subjectName}</span>?
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="description">Problem Description</Label>
            <Textarea
              id="description"
              placeholder="e.g. Struggling with eigenvalues concept..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
          </div>
          <DialogFooter>
            <Button type="submit" className="gap-2">
              <AlertCircle className="h-4 w-4" />
              Add to Tracker
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
