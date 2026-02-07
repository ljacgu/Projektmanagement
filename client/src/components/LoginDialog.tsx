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
import { UserCircle } from "lucide-react";

export function LoginDialog() {
  const { user, login } = useStudy();
  const [open, setOpen] = useState(false);
  const [name, setName] = useState(user?.name || "");
  const [field, setField] = useState(user?.field || "");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name) return;
    login(name, field);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {user ? (
          <Button variant="ghost" className="relative flex items-center gap-2 rounded-full px-3 h-9 hover:bg-secondary" data-testid="button-profile">
            <div className="h-7 w-7 rounded-full bg-primary/15 flex items-center justify-center text-sm font-bold text-primary ring-2 ring-primary/20">
              {user.name.charAt(0).toUpperCase()}
            </div>
            <span className="text-sm font-medium hidden sm:inline">{user.name}</span>
          </Button>
        ) : (
          <Button variant="default" className="rounded-full px-4 h-9 shadow-sm font-medium" data-testid="button-profile">
            <UserCircle className="h-4 w-4 mr-2" />
            Log In
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Who is studying?</DialogTitle>
          <DialogDescription>
            Enter your details to personalize your experience.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="username">Name</Label>
            <Input
              id="username"
              placeholder="Your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="field">Field of Study</Label>
            <Input
              id="field"
              placeholder="e.g. Computer Science"
              value={field}
              onChange={(e) => setField(e.target.value)}
            />
          </div>
          <DialogFooter>
            <Button type="submit">Save Profile</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
