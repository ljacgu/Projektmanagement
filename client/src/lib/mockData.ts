import { LucideIcon, LayoutGrid, Database, Layers, MessageSquare, BarChart3, Users, Globe, Lock, Code2, Cpu } from "lucide-react";

export interface Project {
  id: string;
  title: string;
  client: string;
  status: "active" | "review" | "completed" | "archived";
  dueDate: string;
  thumbnail?: string;
  progress: number;
  members: string[];
}

export interface Integration {
  id: string;
  name: string;
  description: string;
  icon: LucideIcon;
  status: "connected" | "disconnected" | "error";
  lastSync: string;
  type: "data" | "storage" | "api" | "creative";
}

export const mockProjects: Project[] = [
  {
    id: "1",
    title: "Neon Horizon Campaign",
    client: "CyberCorp",
    status: "active",
    dueDate: "2024-06-15",
    progress: 75,
    members: ["alex", "sarah", "mike"]
  },
  {
    id: "2",
    title: "Eco-Future Rebranding",
    client: "GreenSpace",
    status: "review",
    dueDate: "2024-05-30",
    progress: 90,
    members: ["sarah", "jen"]
  },
  {
    id: "3",
    title: "Quarterly Data Viz",
    client: "FinTech Global",
    status: "active",
    dueDate: "2024-07-01",
    progress: 30,
    members: ["alex", "mike", "david"]
  },
  {
    id: "4",
    title: "Product Launch Video",
    client: "TechStream",
    status: "completed",
    dueDate: "2024-04-10",
    progress: 100,
    members: ["jen", "david"]
  }
];

export const mockIntegrations: Integration[] = [
  {
    id: "1",
    name: "PostgreSQL Database",
    description: "Direct connection to production data warehouse.",
    icon: Database,
    status: "connected",
    lastSync: "2 mins ago",
    type: "data"
  },
  {
    id: "2",
    name: "AWS S3 Storage",
    description: "Asset storage for high-res creative files.",
    icon: Layers,
    status: "connected",
    lastSync: "1 hour ago",
    type: "storage"
  },
  {
    id: "3",
    name: "OpenAI API",
    description: "Generative text and image processing.",
    icon: Cpu,
    status: "disconnected",
    lastSync: "Never",
    type: "api"
  },
  {
    id: "4",
    name: "Figma Connect",
    description: "Sync design assets and comments.",
    icon: LayoutGrid,
    status: "connected",
    lastSync: "5 mins ago",
    type: "creative"
  },
  {
    id: "5",
    name: "Stripe Payments",
    description: "Client billing and invoicing data.",
    icon: Lock,
    status: "error",
    lastSync: "2 days ago",
    type: "api"
  }
];

export const activityFeed = [
  { id: 1, user: "Sarah Chen", action: "uploaded 3 new assets", project: "Neon Horizon", time: "10 mins ago" },
  { id: 2, user: "Mike Ross", action: "connected", target: "PostgreSQL DB", time: "1 hour ago" },
  { id: 3, user: "Alex Kim", action: "commented on", project: "Eco-Future", time: "2 hours ago" },
  { id: 4, user: "System", action: "sync completed", target: "AWS S3", time: "3 hours ago" },
];
