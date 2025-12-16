import React, { createContext, useContext, useState, useEffect } from "react";
import { mockSubjects, mockProblems, mockLogs, Subject, Problem, StudyLog } from "./mockData";
import { addDays } from "date-fns";

interface StudyContextType {
  subjects: Subject[];
  problems: Problem[];
  logs: StudyLog[];
  addSubject: (subject: Omit<Subject, "id" | "studyScore" | "color">) => void;
  deleteSubject: (id: string) => void;
  addProblem: (problem: Omit<Problem, "id" | "status" | "createdAt">) => void;
  addLog: (log: Omit<StudyLog, "id">) => void;
  solveProblem: (id: string) => void;
}

const StudyContext = createContext<StudyContextType | undefined>(undefined);

export function StudyProvider({ children }: { children: React.ReactNode }) {
  const [subjects, setSubjects] = useState<Subject[]>(mockSubjects);
  const [problems, setProblems] = useState<Problem[]>(mockProblems);
  const [logs, setLogs] = useState<StudyLog[]>(mockLogs);

  const addSubject = (newSubject: Omit<Subject, "id" | "studyScore" | "color">) => {
    const subject: Subject = {
      ...newSubject,
      id: Math.random().toString(36).substr(2, 9),
      studyScore: 0,
      color: "bg-rose-500", // Default start color
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
    
    // Adding a problem might lower the score slightly?
    // keeping it simple for now
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

    // Update problem status if this log solved one
    if (newLog.solvedProblemId) {
      solveProblem(newLog.solvedProblemId);
    }

    // Update Subject Score logic
    // Formula: Score increases based on minutes studied. 
    // Max 100.
    setSubjects(subjects.map(s => {
      if (s.id === newLog.subjectId) {
        // Arbitrary: 1 hour = +10 points
        const points = Math.floor(newLog.durationMinutes / 6); 
        const newScore = Math.min(100, s.studyScore + points);
        return { ...s, studyScore: newScore };
      }
      return s;
    }));
  };

  return (
    <StudyContext.Provider value={{ subjects, problems, logs, addSubject, deleteSubject, addProblem, addLog, solveProblem }}>
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
