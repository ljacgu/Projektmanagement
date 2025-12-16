import React, { createContext, useContext, useState, useEffect } from "react";
import { mockSubjects, mockProblems, mockLogs, Subject, Problem, StudyLog, StudyFile } from "./mockData";

export interface User {
  name: string;
  field: string;
}

interface StudyContextType {
  user: User | null;
  login: (name: string, field: string) => void;
  subjects: Subject[];
  problems: Problem[];
  logs: StudyLog[];
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  addSubject: (subject: Omit<Subject, "id" | "studyScore" | "color" | "studiedMinutes" | "files">) => void;
  deleteSubject: (id: string) => void;
  addProblem: (problem: Omit<Problem, "id" | "status" | "createdAt">) => void;
  addLog: (log: Omit<StudyLog, "id">) => void;
  solveProblem: (id: string) => void;
  addFile: (subjectId: string, file: Omit<StudyFile, "id" | "uploadedAt">) => void;
}

const StudyContext = createContext<StudyContextType | undefined>(undefined);

export function StudyProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>({ name: "Jane", field: "Computer Science" }); // Default user
  const [subjects, setSubjects] = useState<Subject[]>(mockSubjects);
  const [problems, setProblems] = useState<Problem[]>(mockProblems);
  const [logs, setLogs] = useState<StudyLog[]>(mockLogs);
  const [searchQuery, setSearchQuery] = useState("");

  const login = (name: string, field: string) => {
    setUser({ name, field });
  };

  const addSubject = (newSubject: Omit<Subject, "id" | "studyScore" | "color" | "studiedMinutes" | "files">) => {
    const subject: Subject = {
      ...newSubject,
      id: Math.random().toString(36).substr(2, 9),
      studyScore: 0,
      color: "bg-rose-500", // Default start color
      studiedMinutes: 0,
      files: []
    };
    setSubjects([...subjects, subject]);
  };

  const deleteSubject = (id: string) => {
    setSubjects(subjects.filter((s) => s.id !== id));
    setProblems(problems.filter((p) => p.subjectId !== id));
    setLogs(logs.filter((l) => l.subjectId !== id));
  };

  const addProblem = (newProblem: Omit<Problem, "id" | "status" | "createdAt">) => {
    const problem: Problem = {
      ...newProblem,
      id: Math.random().toString(36).substr(2, 9),
      status: "active",
      createdAt: new Date().toISOString().split("T")[0],
    };
    setProblems([...problems, problem]);
  };

  const solveProblem = (id: string) => {
    setProblems(problems.map(p => 
      p.id === id ? { ...p, status: "refresh" } : p
    ));
  };

  const addLog = (newLog: Omit<StudyLog, "id">) => {
    const log: StudyLog = {
      ...newLog,
      id: Math.random().toString(36).substr(2, 9),
    };
    setLogs([log, ...logs]);

    if (newLog.solvedProblemId) {
      solveProblem(newLog.solvedProblemId);
    }

    setSubjects(subjects.map(s => {
      if (s.id === newLog.subjectId) {
        const newStudiedMinutes = s.studiedMinutes + newLog.durationMinutes;
        const targetMinutes = s.targetHours * 60;
        
        // Calculate score based on target hours
        const safeTarget = targetMinutes > 0 ? targetMinutes : 600; // Default 10h if missing
        
        const newScore = Math.min(100, Math.floor((newStudiedMinutes / safeTarget) * 100));
        
        return { ...s, studyScore: newScore, studiedMinutes: newStudiedMinutes };
      }
      return s;
    }));
  };

  const addFile = (subjectId: string, newFile: Omit<StudyFile, "id" | "uploadedAt">) => {
    setSubjects(subjects.map(s => {
      if (s.id === subjectId) {
        const file: StudyFile = {
          ...newFile,
          id: Math.random().toString(36).substr(2, 9),
          uploadedAt: new Date().toISOString().split("T")[0],
        };
        return { ...s, files: [...s.files, file] };
      }
      return s;
    }));
  };

  return (
    <StudyContext.Provider value={{ 
      user, 
      login,
      subjects, 
      problems, 
      logs, 
      searchQuery,
      setSearchQuery,
      addSubject, 
      deleteSubject, 
      addProblem, 
      addLog, 
      solveProblem,
      addFile
    }}>
      {children}
    </StudyContext.Provider>
  );
}

export function useStudy() {
  const context = useContext(StudyContext);
  if (context === undefined) {
    throw new Error("useStudy must be used within a StudyProvider");
  }
  return context;
}
