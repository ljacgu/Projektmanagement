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
    examDate: "2024-06-15",
    color: "bg-blue-500",
    studyScore: 35, // Low - Reddish
    targetHours: 50,
    studiedMinutes: 1050, // ~17.5 hours
    files: [
      {
        id: "f1",
        name: "Calculus_Syllabus.pdf",
        type: "pdf",
        url: "#",
        size: "2.4 MB",
        uploadedAt: "2024-04-10"
      }
    ]
  },
  {
    id: "2",
    name: "Organic Chemistry",
    examDate: "2024-05-20",
    color: "bg-emerald-500",
    studyScore: 85, // High - Greenish
    targetHours: 40,
    studiedMinutes: 2040, // ~34 hours
    files: []
  },
  {
    id: "3",
    name: "World History",
    examDate: "2024-06-01",
    color: "bg-amber-500",
    studyScore: 60, // Medium - Yellowish
    targetHours: 30,
    studiedMinutes: 1080, // ~18 hours
    files: []
  },
  {
    id: "4",
    name: "Computer Science 101",
    examDate: "2024-05-10",
    color: "bg-purple-500",
    studyScore: 95, // Very High - Green
    targetHours: 60,
    studiedMinutes: 3420, // ~57 hours
    files: [
      {
        id: "f2",
        name: "Lecture_Notes_Week1-5.docx",
        type: "doc",
        url: "#",
        size: "1.8 MB",
        uploadedAt: "2024-04-05"
      },
      {
        id: "f3",
        name: "Binary_Trees_Diagram.png",
        type: "image",
        url: "#",
        size: "450 KB",
        uploadedAt: "2024-04-20"
      }
    ]
  },
  {
    id: "5",
    name: "Physics I",
    examDate: "2024-01-15",
    color: "bg-indigo-500",
    studyScore: 100,
    targetHours: 40,
    studiedMinutes: 2400,
    files: []
    // Removed default grade
  },
  {
    id: "6",
    name: "English Literature",
    examDate: "2023-12-10",
    color: "bg-rose-500",
    studyScore: 100,
    targetHours: 20,
    studiedMinutes: 1200,
    files: []
    // Removed default grade
  }
];

export const mockProblems: Problem[] = [
  {
    id: "p1",
    subjectId: "1",
    description: "Understanding Green's Theorem application",
    status: "active",
    createdAt: "2024-04-20"
  },
  {
    id: "p2",
    subjectId: "2",
    description: "Memorizing functional groups",
    status: "solved", // Solved, now a refresh reminder
    createdAt: "2024-04-15"
  },
  {
    id: "p3",
    subjectId: "1",
    description: "Integration by parts vs u-substitution",
    status: "active",
    createdAt: "2024-04-22"
  }
];

export const mockLogs: StudyLog[] = [
  {
    id: "l1",
    subjectId: "2",
    durationMinutes: 120,
    description: "Reviewed Alkanes and Alkenes chapters",
    date: "2024-04-25",
    solvedProblemId: "p2"
  },
  {
    id: "l2",
    subjectId: "4",
    durationMinutes: 60,
    description: "Implemented Binary Search Tree in Python",
    date: "2024-04-26"
  }
];
