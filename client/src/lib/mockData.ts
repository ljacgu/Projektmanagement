import { Plus, Calendar, BookOpen, Clock, AlertCircle, CheckCircle2, BarChart2 } from "lucide-react";

export interface StudyFile {
  id: string;
  name: string;
  type: string; // 'pdf', 'image', 'doc', etc.
  url: string; // Mock URL
  size: string;
  uploadedAt: string;
}

export interface Subject {
  id: string;
  name: string;
  examDate: string; // ISO Date
  color: string; // Hex or tailwind class
  studyScore: number; // 0 to 100, determines color (Red -> Green)
  targetHours: number; // New: Target study hours
  studiedMinutes: number; // New: Track actual studied time
  files: StudyFile[]; // New: Attached files
  grade?: number; // Optional: Grade for past exams (German scale: 1.0 - 5.0)
  examResultFile?: StudyFile; // File for the exam result
}

export interface Problem {
  id: string;
  subjectId: string;
  description: string;
  status: "active" | "solved" | "refresh";
  createdAt: string;
}

export interface StudyLog {
  id: string;
  subjectId: string;
  durationMinutes: number;
  description: string; // What was studied
  date: string;
  solvedProblemId?: string; // If this log solved a problem
}

export interface PersonalEvent {
  id: string;
  title: string;
  description?: string;
  date: string; // ISO Date
  type: "class" | "appointment" | "training" | "other";
  color: string;
}

export const mockSubjects: Subject[] = [
  {
    id: "1",
    name: "Advanced Calculus",
    examDate: "2026-06-15",
    color: "bg-blue-500",
    studyScore: 0,
    targetHours: 50,
    studiedMinutes: 0,
    files: []
  },
  {
    id: "2",
    name: "Organic Chemistry",
    examDate: "2026-05-20",
    color: "bg-emerald-500",
    studyScore: 0,
    targetHours: 40,
    studiedMinutes: 0,
    files: []
  },
  {
    id: "3",
    name: "World History",
    examDate: "2026-06-01",
    color: "bg-amber-500",
    studyScore: 0,
    targetHours: 30,
    studiedMinutes: 0,
    files: []
  },
  {
    id: "4",
    name: "Computer Science 101",
    examDate: "2026-05-10",
    color: "bg-purple-500",
    studyScore: 0,
    targetHours: 60,
    studiedMinutes: 0,
    files: []
  },
  {
    id: "5",
    name: "Physics I",
    examDate: "2026-01-15",
    color: "bg-indigo-500",
    studyScore: 0,
    targetHours: 40,
    studiedMinutes: 0,
    files: []
  },
  {
    id: "6",
    name: "English Literature",
    examDate: "2026-02-10",
    color: "bg-rose-500",
    studyScore: 0,
    targetHours: 20,
    studiedMinutes: 0,
    files: []
  }
];

export const mockProblems: Problem[] = [];

export const mockLogs: StudyLog[] = [];
