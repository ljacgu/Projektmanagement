import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, timestamp, serial } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const subjects = pgTable("subjects", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  examDate: text("exam_date").notNull(),
  color: text("color").notNull(),
  studyScore: integer("study_score").notNull().default(0),
  targetHours: integer("target_hours").notNull().default(10),
  studiedMinutes: integer("studied_minutes").notNull().default(0),
  grade: integer("grade"), // Optional: German scale stored as int (10-50 for 1.0-5.0)
  notes: text("notes"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const problems = pgTable("problems", {
  id: serial("id").primaryKey(),
  subjectId: integer("subject_id").notNull().references(() => subjects.id, { onDelete: "cascade" }),
  description: text("description").notNull(),
  status: text("status").notNull().default("active"), // "active" | "solved" | "refresh"
  createdAt: text("created_at").notNull(),
});

export const studyLogs = pgTable("study_logs", {
  id: serial("id").primaryKey(),
  subjectId: integer("subject_id").notNull().references(() => subjects.id, { onDelete: "cascade" }),
  durationMinutes: integer("duration_minutes").notNull(),
  description: text("description").notNull(),
  date: text("date").notNull(),
  solvedProblemId: integer("solved_problem_id").references(() => problems.id, { onDelete: "set null" }),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const personalEvents = pgTable("personal_events", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description"),
  date: text("date").notNull(),
  type: text("type").notNull(), // "class" | "appointment" | "training" | "other"
  color: text("color").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const studyFiles = pgTable("study_files", {
  id: serial("id").primaryKey(),
  subjectId: integer("subject_id").notNull().references(() => subjects.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  type: text("type").notNull(),
  url: text("url").notNull(),
  size: text("size").notNull(),
  uploadedAt: text("uploaded_at").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// Insert schemas
export const insertSubjectSchema = createInsertSchema(subjects).omit({
  id: true,
  createdAt: true,
});

export const insertProblemSchema = createInsertSchema(problems).omit({
  id: true,
});

export const insertStudyLogSchema = createInsertSchema(studyLogs).omit({
  id: true,
  createdAt: true,
});

export const insertPersonalEventSchema = createInsertSchema(personalEvents).omit({
  id: true,
  createdAt: true,
});

export const insertStudyFileSchema = createInsertSchema(studyFiles).omit({
  id: true,
  createdAt: true,
});

// Types
export type Subject = typeof subjects.$inferSelect;
export type InsertSubject = z.infer<typeof insertSubjectSchema>;

export type Problem = typeof problems.$inferSelect;
export type InsertProblem = z.infer<typeof insertProblemSchema>;

export type StudyLog = typeof studyLogs.$inferSelect;
export type InsertStudyLog = z.infer<typeof insertStudyLogSchema>;

export type PersonalEvent = typeof personalEvents.$inferSelect;
export type InsertPersonalEvent = z.infer<typeof insertPersonalEventSchema>;

export type StudyFile = typeof studyFiles.$inferSelect;
export type InsertStudyFile = z.infer<typeof insertStudyFileSchema>;
