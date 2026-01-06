import {
  type Subject,
  type InsertSubject,
  type Problem,
  type InsertProblem,
  type StudyLog,
  type InsertStudyLog,
  type PersonalEvent,
  type InsertPersonalEvent,
  type StudyFile,
  type InsertStudyFile,
  subjects,
  problems,
  studyLogs,
  personalEvents,
  studyFiles,
} from "@shared/schema";
import { db } from "../db";
import { eq, desc } from "drizzle-orm";

export interface IStorage {
  // Subjects
  getSubjects(): Promise<Subject[]>;
  getSubject(id: number): Promise<Subject | undefined>;
  createSubject(subject: InsertSubject): Promise<Subject>;
  updateSubject(id: number, updates: Partial<InsertSubject>): Promise<Subject | undefined>;
  deleteSubject(id: number): Promise<void>;

  // Problems
  getProblems(): Promise<Problem[]>;
  getProblemsBySubject(subjectId: number): Promise<Problem[]>;
  createProblem(problem: InsertProblem): Promise<Problem>;
  updateProblem(id: number, updates: Partial<InsertProblem>): Promise<Problem | undefined>;
  deleteProblem(id: number): Promise<void>;

  // Study Logs
  getStudyLogs(): Promise<StudyLog[]>;
  getStudyLogsBySubject(subjectId: number): Promise<StudyLog[]>;
  createStudyLog(log: InsertStudyLog): Promise<StudyLog>;
  deleteStudyLog(id: number): Promise<void>;

  // Personal Events
  getPersonalEvents(): Promise<PersonalEvent[]>;
  createPersonalEvent(event: InsertPersonalEvent): Promise<PersonalEvent>;
  deletePersonalEvent(id: number): Promise<void>;

  // Study Files
  getFilesBySubject(subjectId: number): Promise<StudyFile[]>;
  createFile(file: InsertStudyFile): Promise<StudyFile>;
  deleteFile(id: number): Promise<void>;
}

export class DatabaseStorage implements IStorage {
  // Subjects
  async getSubjects(): Promise<Subject[]> {
    return await db.select().from(subjects).orderBy(subjects.examDate);
  }

  async getSubject(id: number): Promise<Subject | undefined> {
    const result = await db.select().from(subjects).where(eq(subjects.id, id));
    return result[0];
  }

  async createSubject(subject: InsertSubject): Promise<Subject> {
    const result = await db.insert(subjects).values(subject).returning();
    return result[0];
  }

  async updateSubject(id: number, updates: Partial<InsertSubject>): Promise<Subject | undefined> {
    const result = await db
      .update(subjects)
      .set(updates)
      .where(eq(subjects.id, id))
      .returning();
    return result[0];
  }

  async deleteSubject(id: number): Promise<void> {
    await db.delete(subjects).where(eq(subjects.id, id));
  }

  // Problems
  async getProblems(): Promise<Problem[]> {
    return await db.select().from(problems).orderBy(desc(problems.createdAt));
  }

  async getProblemsBySubject(subjectId: number): Promise<Problem[]> {
    return await db
      .select()
      .from(problems)
      .where(eq(problems.subjectId, subjectId))
      .orderBy(desc(problems.createdAt));
  }

  async createProblem(problem: InsertProblem): Promise<Problem> {
    const result = await db.insert(problems).values(problem).returning();
    return result[0];
  }

  async updateProblem(id: number, updates: Partial<InsertProblem>): Promise<Problem | undefined> {
    const result = await db
      .update(problems)
      .set(updates)
      .where(eq(problems.id, id))
      .returning();
    return result[0];
  }

  async deleteProblem(id: number): Promise<void> {
    await db.delete(problems).where(eq(problems.id, id));
  }

  // Study Logs
  async getStudyLogs(): Promise<StudyLog[]> {
    return await db.select().from(studyLogs).orderBy(desc(studyLogs.createdAt));
  }

  async getStudyLogsBySubject(subjectId: number): Promise<StudyLog[]> {
    return await db
      .select()
      .from(studyLogs)
      .where(eq(studyLogs.subjectId, subjectId))
      .orderBy(desc(studyLogs.createdAt));
  }

  async createStudyLog(log: InsertStudyLog): Promise<StudyLog> {
    const result = await db.insert(studyLogs).values(log).returning();
    return result[0];
  }

  async deleteStudyLog(id: number): Promise<void> {
    await db.delete(studyLogs).where(eq(studyLogs.id, id));
  }

  // Personal Events
  async getPersonalEvents(): Promise<PersonalEvent[]> {
    return await db.select().from(personalEvents).orderBy(personalEvents.date);
  }

  async createPersonalEvent(event: InsertPersonalEvent): Promise<PersonalEvent> {
    const result = await db.insert(personalEvents).values(event).returning();
    return result[0];
  }

  async deletePersonalEvent(id: number): Promise<void> {
    await db.delete(personalEvents).where(eq(personalEvents.id, id));
  }

  // Study Files
  async getFilesBySubject(subjectId: number): Promise<StudyFile[]> {
    return await db
      .select()
      .from(studyFiles)
      .where(eq(studyFiles.subjectId, subjectId))
      .orderBy(desc(studyFiles.createdAt));
  }

  async createFile(file: InsertStudyFile): Promise<StudyFile> {
    const result = await db.insert(studyFiles).values(file).returning();
    return result[0];
  }

  async deleteFile(id: number): Promise<void> {
    await db.delete(studyFiles).where(eq(studyFiles.id, id));
  }
}

export const storage = new DatabaseStorage();
