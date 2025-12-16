import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string;
  change?: string;
  changeType?: "positive" | "negative" | "neutral";
  icon: LucideIcon;
  className?: string;
}

export function StatCard({ title, value, change, changeType = "neutral", icon: Icon, className }: StatCardProps) {
  return (
    <div className={cn("group relative overflow-hidden rounded-xl border bg-card p-6 transition-all hover:shadow-lg hover:border-primary/20", className)}>
      <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-primary/5 blur-xl transition-all group-hover:bg-primary/10"></div>
      
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <div className="flex items-baseline gap-2">
            <h3 className="text-2xl font-bold font-display tracking-tight text-foreground">{value}</h3>
            {change && (
              <span className={cn(
                "text-xs font-medium px-1.5 py-0.5 rounded-full",
                changeType === "positive" && "bg-emerald-500/10 text-emerald-500",
                changeType === "negative" && "bg-rose-500/10 text-rose-500",
                changeType === "neutral" && "bg-secondary text-muted-foreground"
              )}>
                {change}
              </span>
            )}
          </div>
        </div>
        <div className="rounded-lg bg-secondary/50 p-2 text-foreground group-hover:bg-primary/10 group-hover:text-primary transition-colors">
          <Icon className="h-5 w-5" />
        </div>
      </div>
    </div>
  );
}

interface FeatureCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  action?: React.ReactNode;
  className?: string;
}

export function FeatureCard({ title, description, icon: Icon, action, className }: FeatureCardProps) {
  return (
    <div className={cn("flex flex-col justify-between rounded-xl border bg-card p-6 transition-all hover:border-primary/20 hover:shadow-md", className)}>
      <div className="space-y-4">
        <div className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
          <Icon className="h-5 w-5" />
        </div>
        <div className="space-y-1">
          <h3 className="font-display font-semibold text-lg">{title}</h3>
          <p className="text-sm text-muted-foreground leading-relaxed">{description}</p>
        </div>
      </div>
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}
