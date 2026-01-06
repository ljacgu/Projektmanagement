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

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    throw new Error(`API error: ${response.statusText}`);
  }
  return response.json();
}

// Subjects
export async function fetchSubjects(): Promise<Subject[]> {
  const response = await fetch("/api/subjects");
  return handleResponse(response);
}

export async function createSubject(subject: InsertSubject): Promise<Subject> {
  const response = await fetch("/api/subjects", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(subject),
  });
  return handleResponse(response);
}

export async function updateSubject(
  id: number,
  updates: Partial<InsertSubject>
): Promise<Subject> {
  const response = await fetch(`/api/subjects/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(updates),
  });
  return handleResponse(response);
}

export async function deleteSubject(id: number): Promise<void> {
  const response = await fetch(`/api/subjects/${id}`, {
    method: "DELETE",
  });
  if (!response.ok) {
    throw new Error(`API error: ${response.statusText}`);
  }
}

// Problems
export async function fetchProblems(): Promise<Problem[]> {
  const response = await fetch("/api/problems");
  return handleResponse(response);
}

export async function createProblem(problem: InsertProblem): Promise<Problem> {
  const response = await fetch("/api/problems", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(problem),
  });
  return handleResponse(response);
}

export async function updateProblem(
  id: number,
  updates: Partial<InsertProblem>
): Promise<Problem> {
  const response = await fetch(`/api/problems/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(updates),
  });
  return handleResponse(response);
}

export async function deleteProblem(id: number): Promise<void> {
  const response = await fetch(`/api/problems/${id}`, {
    method: "DELETE",
  });
  if (!response.ok) {
    throw new Error(`API error: ${response.statusText}`);
  }
}

// Study Logs
export async function fetchStudyLogs(): Promise<StudyLog[]> {
  const response = await fetch("/api/logs");
  return handleResponse(response);
}

export async function createStudyLog(log: InsertStudyLog): Promise<StudyLog> {
  const response = await fetch("/api/logs", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(log),
  });
  return handleResponse(response);
}

export async function deleteStudyLog(id: number): Promise<void> {
  const response = await fetch(`/api/logs/${id}`, {
    method: "DELETE",
  });
  if (!response.ok) {
    throw new Error(`API error: ${response.statusText}`);
  }
}

// Personal Events
export async function fetchPersonalEvents(): Promise<PersonalEvent[]> {
  const response = await fetch("/api/events");
  return handleResponse(response);
}

export async function createPersonalEvent(
  event: InsertPersonalEvent
): Promise<PersonalEvent> {
  const response = await fetch("/api/events", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(event),
  });
  return handleResponse(response);
}

export async function deletePersonalEvent(id: number): Promise<void> {
  const response = await fetch(`/api/events/${id}`, {
    method: "DELETE",
  });
  if (!response.ok) {
    throw new Error(`API error: ${response.statusText}`);
  }
}

// Study Files
export async function fetchFilesBySubject(subjectId: number): Promise<StudyFile[]> {
  const response = await fetch(`/api/subjects/${subjectId}/files`);
  return handleResponse(response);
}

export async function createFile(
  subjectId: number,
  file: Omit<InsertStudyFile, "subjectId">
): Promise<StudyFile> {
  const response = await fetch(`/api/subjects/${subjectId}/files`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(file),
  });
  return handleResponse(response);
}

export async function deleteFile(id: number): Promise<void> {
  const response = await fetch(`/api/files/${id}`, {
    method: "DELETE",
  });
  if (!response.ok) {
    throw new Error(`API error: ${response.statusText}`);
  }
}
