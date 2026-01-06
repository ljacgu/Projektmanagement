import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type {
  Subject,
  InsertSubject,
  Problem,
  InsertProblem,
  StudyLog,
  InsertStudyLog,
  PersonalEvent,
  InsertPersonalEvent,
  StudyFile,
  InsertStudyFile,
} from "@shared/schema";
import * as api from "./api";

// Subjects
export function useSubjects() {
  return useQuery<Subject[]>({
    queryKey: ["subjects"],
    queryFn: api.fetchSubjects,
  });
}

export function useCreateSubject() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (subject: InsertSubject) => api.createSubject(subject),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["subjects"] });
    },
  });
}

export function useUpdateSubject() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, updates }: { id: number; updates: Partial<InsertSubject> }) =>
      api.updateSubject(id, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["subjects"] });
    },
  });
}

export function useDeleteSubject() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => api.deleteSubject(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["subjects"] });
      queryClient.invalidateQueries({ queryKey: ["problems"] });
      queryClient.invalidateQueries({ queryKey: ["logs"] });
    },
  });
}

// Problems
export function useProblems() {
  return useQuery<Problem[]>({
    queryKey: ["problems"],
    queryFn: api.fetchProblems,
  });
}

export function useCreateProblem() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (problem: InsertProblem) => api.createProblem(problem),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["problems"] });
    },
  });
}

export function useUpdateProblem() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, updates }: { id: number; updates: Partial<InsertProblem> }) =>
      api.updateProblem(id, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["problems"] });
    },
  });
}

export function useDeleteProblem() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => api.deleteProblem(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["problems"] });
    },
  });
}

// Study Logs
export function useStudyLogs() {
  return useQuery<StudyLog[]>({
    queryKey: ["logs"],
    queryFn: api.fetchStudyLogs,
  });
}

export function useCreateStudyLog() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (log: InsertStudyLog) => api.createStudyLog(log),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["logs"] });
      queryClient.invalidateQueries({ queryKey: ["subjects"] });
      queryClient.invalidateQueries({ queryKey: ["problems"] });
    },
  });
}

export function useDeleteStudyLog() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => api.deleteStudyLog(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["logs"] });
    },
  });
}

// Personal Events
export function usePersonalEvents() {
  return useQuery<PersonalEvent[]>({
    queryKey: ["events"],
    queryFn: api.fetchPersonalEvents,
  });
}

export function useCreatePersonalEvent() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (event: InsertPersonalEvent) => api.createPersonalEvent(event),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["events"] });
    },
  });
}

export function useDeletePersonalEvent() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => api.deletePersonalEvent(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["events"] });
    },
  });
}

// Study Files
export function useFilesBySubject(subjectId: number) {
  return useQuery<StudyFile[]>({
    queryKey: ["files", subjectId],
    queryFn: () => api.fetchFilesBySubject(subjectId),
    enabled: !!subjectId,
  });
}

export function useCreateFile() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ subjectId, file }: { subjectId: number; file: Omit<InsertStudyFile, "subjectId"> }) =>
      api.createFile(subjectId, file),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["files", variables.subjectId] });
    },
  });
}

export function useDeleteFile() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => api.deleteFile(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["files"] });
    },
  });
}
