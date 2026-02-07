import React, { createContext, useContext, useState } from "react";
import {
  useSubjects,
  useProblems,
  useStudyLogs,
  usePersonalEvents,
  useCreateSubject,
  useUpdateSubject,
  useDeleteSubject,
  useCreateProblem,
  useUpdateProblem,
  useCreateStudyLog,
  useCreatePersonalEvent,
  useDeletePersonalEvent,
  useCreateFile,
  useDeleteFile,
} from "./hooks";
import type { Subject, InsertSubject, InsertProblem, InsertStudyLog, InsertPersonalEvent, InsertStudyFile } from "@shared/schema";

export interface User {
  name: string;
  field: string;
}

interface StudyContextType {
  user: User | null;
  login: (name: string, field: string) => void;
  subjects: Subject[];
  isLoadingSubjects: boolean;
  problems: any[];
  isLoadingProblems: boolean;
  logs: any[];
  isLoadingLogs: boolean;
  personalEvents: any[];
  isLoadingEvents: boolean;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  addSubject: (subject: Omit<InsertSubject, "studyScore" | "studiedMinutes">) => void;
  updateSubject: (id: number, updates: Partial<InsertSubject>) => void;
  deleteSubject: (id: number) => void;
  addProblem: (problem: Omit<InsertProblem, "status">) => void;
  addLog: (log: InsertStudyLog) => void;
  solveProblem: (id: number) => void;
  addFile: (subjectId: number, file: Omit<InsertStudyFile, "subjectId">) => void;
  deleteFile: (id: number) => void;
  addPersonalEvent: (event: InsertPersonalEvent) => void;
  deletePersonalEvent: (id: number) => void;
}

const StudyContext = createContext<StudyContextType | undefined>(undefined);

export function StudyProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem("studyflow_user_v2");
    return saved ? JSON.parse(saved) : { name: "Jane", field: "Computer Science" };
  });

  const [searchQuery, setSearchQuery] = useState("");

  // Queries
  const { data: subjects = [], isLoading: isLoadingSubjects } = useSubjects();
  const { data: problems = [], isLoading: isLoadingProblems } = useProblems();
  const { data: logs = [], isLoading: isLoadingLogs } = useStudyLogs();
  const { data: personalEvents = [], isLoading: isLoadingEvents } = usePersonalEvents();

  // Mutations
  const createSubjectMutation = useCreateSubject();
  const updateSubjectMutation = useUpdateSubject();
  const deleteSubjectMutation = useDeleteSubject();
  const createProblemMutation = useCreateProblem();
  const updateProblemMutation = useUpdateProblem();
  const createLogMutation = useCreateStudyLog();
  const createEventMutation = useCreatePersonalEvent();
  const deleteEventMutation = useDeletePersonalEvent();
  const createFileMutation = useCreateFile();
  const deleteFileMutation = useDeleteFile();

  const login = (name: string, field: string) => {
    const newUser = { name, field };
    setUser(newUser);
    localStorage.setItem("studyflow_user_v2", JSON.stringify(newUser));
  };

  const addSubject = (newSubject: Omit<InsertSubject, "studyScore" | "studiedMinutes">) => {
    createSubjectMutation.mutate({
      ...newSubject,
      studyScore: 0,
      studiedMinutes: 0,
    });
  };

  const updateSubject = (id: number, updates: Partial<InsertSubject>) => {
    updateSubjectMutation.mutate({ id, updates });
  };

  const deleteSubject = (id: number) => {
    deleteSubjectMutation.mutate(id);
  };

  const addProblem = (newProblem: Omit<InsertProblem, "status">) => {
    createProblemMutation.mutate({
      ...newProblem,
      status: "active",
    });
  };

  const solveProblem = (id: number) => {
    updateProblemMutation.mutate({ id, updates: { status: "refresh" } });
  };

  const addLog = (newLog: InsertStudyLog) => {
    createLogMutation.mutate(newLog);
  };

  const addFile = (subjectId: number, newFile: Omit<InsertStudyFile, "subjectId">) => {
    createFileMutation.mutate({ subjectId, file: newFile });
  };

  const deleteFile = (id: number) => {
    deleteFileMutation.mutate(id);
  };

  const addPersonalEvent = (newEvent: InsertPersonalEvent) => {
    createEventMutation.mutate(newEvent);
  };

  const deletePersonalEvent = (id: number) => {
    deleteEventMutation.mutate(id);
  };

  return (
    <StudyContext.Provider
      value={{
        user,
        login,
        subjects,
        isLoadingSubjects,
        problems,
        isLoadingProblems,
        logs,
        isLoadingLogs,
        personalEvents,
        isLoadingEvents,
        searchQuery,
        setSearchQuery,
        addSubject,
        updateSubject,
        deleteSubject,
        addProblem,
        addLog,
        solveProblem,
        addFile,
        deleteFile,
        addPersonalEvent,
        deletePersonalEvent,
      }}
    >
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
