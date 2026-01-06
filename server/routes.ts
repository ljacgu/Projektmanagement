import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import {
  insertSubjectSchema,
  insertProblemSchema,
  insertStudyLogSchema,
  insertPersonalEventSchema,
  insertStudyFileSchema,
} from "@shared/schema";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  // Subjects
  app.get("/api/subjects", async (_req, res) => {
    try {
      const subjects = await storage.getSubjects();
      res.json(subjects);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch subjects" });
    }
  });

  app.post("/api/subjects", async (req, res) => {
    try {
      const validatedData = insertSubjectSchema.parse(req.body);
      const subject = await storage.createSubject(validatedData);
      res.json(subject);
    } catch (error) {
      res.status(400).json({ error: "Invalid subject data" });
    }
  });

  app.patch("/api/subjects/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const subject = await storage.updateSubject(id, req.body);
      if (!subject) {
        return res.status(404).json({ error: "Subject not found" });
      }
      res.json(subject);
    } catch (error) {
      res.status(400).json({ error: "Failed to update subject" });
    }
  });

  app.delete("/api/subjects/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      await storage.deleteSubject(id);
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: "Failed to delete subject" });
    }
  });

  // Problems
  app.get("/api/problems", async (_req, res) => {
    try {
      const problems = await storage.getProblems();
      res.json(problems);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch problems" });
    }
  });

  app.post("/api/problems", async (req, res) => {
    try {
      const validatedData = insertProblemSchema.parse(req.body);
      const problem = await storage.createProblem(validatedData);
      res.json(problem);
    } catch (error) {
      res.status(400).json({ error: "Invalid problem data" });
    }
  });

  app.patch("/api/problems/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const problem = await storage.updateProblem(id, req.body);
      if (!problem) {
        return res.status(404).json({ error: "Problem not found" });
      }
      res.json(problem);
    } catch (error) {
      res.status(400).json({ error: "Failed to update problem" });
    }
  });

  app.delete("/api/problems/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      await storage.deleteProblem(id);
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: "Failed to delete problem" });
    }
  });

  // Study Logs
  app.get("/api/logs", async (_req, res) => {
    try {
      const logs = await storage.getStudyLogs();
      res.json(logs);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch logs" });
    }
  });

  app.post("/api/logs", async (req, res) => {
    try {
      const validatedData = insertStudyLogSchema.parse(req.body);
      const log = await storage.createStudyLog(validatedData);
      
      // Update subject's studied minutes and score
      const subject = await storage.getSubject(validatedData.subjectId);
      if (subject) {
        const newStudiedMinutes = subject.studiedMinutes + validatedData.durationMinutes;
        const targetMinutes = subject.targetHours * 60;
        const newScore = Math.min(100, Math.floor((newStudiedMinutes / targetMinutes) * 100));
        
        await storage.updateSubject(validatedData.subjectId, {
          studiedMinutes: newStudiedMinutes,
          studyScore: newScore,
        });

        // If a problem was solved, update its status
        if (validatedData.solvedProblemId) {
          await storage.updateProblem(validatedData.solvedProblemId, {
            status: "refresh",
          });
        }
      }
      
      res.json(log);
    } catch (error) {
      res.status(400).json({ error: "Invalid log data" });
    }
  });

  app.delete("/api/logs/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      await storage.deleteStudyLog(id);
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: "Failed to delete log" });
    }
  });

  // Personal Events
  app.get("/api/events", async (_req, res) => {
    try {
      const events = await storage.getPersonalEvents();
      res.json(events);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch events" });
    }
  });

  app.post("/api/events", async (req, res) => {
    try {
      const validatedData = insertPersonalEventSchema.parse(req.body);
      const event = await storage.createPersonalEvent(validatedData);
      res.json(event);
    } catch (error) {
      res.status(400).json({ error: "Invalid event data" });
    }
  });

  app.delete("/api/events/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      await storage.deletePersonalEvent(id);
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: "Failed to delete event" });
    }
  });

  // Study Files
  app.get("/api/subjects/:subjectId/files", async (req, res) => {
    try {
      const subjectId = parseInt(req.params.subjectId);
      const files = await storage.getFilesBySubject(subjectId);
      res.json(files);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch files" });
    }
  });

  app.post("/api/subjects/:subjectId/files", async (req, res) => {
    try {
      const subjectId = parseInt(req.params.subjectId);
      const validatedData = insertStudyFileSchema.parse({
        ...req.body,
        subjectId,
      });
      const file = await storage.createFile(validatedData);
      res.json(file);
    } catch (error) {
      res.status(400).json({ error: "Invalid file data" });
    }
  });

  app.delete("/api/files/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      await storage.deleteFile(id);
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: "Failed to delete file" });
    }
  });

  return httpServer;
}
