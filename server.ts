import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import db from "./src/db.ts";
import { sendAuthNotification } from "./src/services/emailService.ts";

const JWT_SECRET = process.env.JWT_SECRET || "wellmind-secret-key";

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Auth Middleware
  const authenticateToken = (req: any, res: any, next: any) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) return res.sendStatus(401);

    jwt.verify(token, JWT_SECRET, (err: any, user: any) => {
      if (err) return res.sendStatus(403);
      req.user = user;
      next();
    });
  };

  // --- API Routes ---

  // Auth
  app.post("/api/auth/signup", async (req, res) => {
    const { name, email, password } = req.body;
    try {
      const userCount = db.prepare("SELECT COUNT(*) as count FROM users").get() as any;
      const role = userCount.count === 0 ? 'admin' : 'user';
      
      const hashedPassword = await bcrypt.hash(password, 10);
      const stmt = db.prepare("INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)");
      const result = stmt.run(name, email, hashedPassword, role);
      const token = jwt.sign({ id: result.lastInsertRowid, email, name, role }, JWT_SECRET);
      
      // Send notification
      sendAuthNotification('signup', { name, email });

      res.json({ token, user: { id: result.lastInsertRowid, name, email, role } });
    } catch (e: any) {
      res.status(400).json({ error: e.message });
    }
  });

  app.post("/api/auth/login", async (req, res) => {
    const { email, password } = req.body;
    const user = db.prepare("SELECT * FROM users WHERE email = ?").get(email) as any;
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ error: "Invalid credentials" });
    }
    const token = jwt.sign({ id: user.id, email: user.email, name: user.name, role: user.role }, JWT_SECRET);
    
    // Send notification
    sendAuthNotification('login', { name: user.name, email: user.email });

    res.json({ token, user: { id: user.id, name: user.name, email: user.email, role: user.role } });
  });

  // Mood Tracking
  app.post("/api/mood", authenticateToken, (req: any, res) => {
    const { mood, note } = req.body;
    const stmt = db.prepare("INSERT INTO mood_logs (user_id, mood, note) VALUES (?, ?, ?)");
    stmt.run(req.user.id, mood, note);
    res.json({ success: true });
  });

  app.get("/api/mood/history", authenticateToken, (req: any, res) => {
    const logs = db.prepare("SELECT * FROM mood_logs WHERE user_id = ? ORDER BY created_at DESC LIMIT 30").all(req.user.id);
    res.json(logs);
  });

  // Chat History
  app.get("/api/chats", authenticateToken, (req: any, res) => {
    const sessions = db.prepare("SELECT * FROM chat_sessions WHERE user_id = ? ORDER BY created_at DESC").all(req.user.id);
    res.json(sessions);
  });

  app.post("/api/chats", authenticateToken, (req: any, res) => {
    const { title } = req.body;
    const stmt = db.prepare("INSERT INTO chat_sessions (user_id, title) VALUES (?, ?)");
    const result = stmt.run(req.user.id, title || "New Conversation");
    res.json({ id: result.lastInsertRowid });
  });

  app.get("/api/chats/:id/messages", authenticateToken, (req: any, res) => {
    const messages = db.prepare("SELECT * FROM chat_messages WHERE session_id = ? ORDER BY created_at ASC").all(req.params.id);
    res.json(messages);
  });

  app.post("/api/chats/:id/messages", authenticateToken, (req: any, res) => {
    const { role, content } = req.body;
    const stmt = db.prepare("INSERT INTO chat_messages (session_id, role, content) VALUES (?, ?, ?)");
    stmt.run(req.params.id, role, content);
    res.json({ success: true });
  });

  // Wellness Content
  app.get("/api/wellness", (req, res) => {
    const content = db.prepare("SELECT * FROM wellness_content").all();
    res.json(content);
  });

  // Admin Routes
  app.get("/api/admin/users", authenticateToken, (req: any, res) => {
    if (req.user.role !== 'admin') return res.sendStatus(403);
    const users = db.prepare("SELECT id, name, email, role, created_at FROM users").all();
    res.json(users);
  });

  app.get("/api/admin/stats", authenticateToken, (req: any, res) => {
    if (req.user.role !== 'admin') return res.sendStatus(403);
    const userCount = db.prepare("SELECT COUNT(*) as count FROM users").get() as any;
    const chatCount = db.prepare("SELECT COUNT(*) as count FROM chat_messages").get() as any;
    const moodCount = db.prepare("SELECT COUNT(*) as count FROM mood_logs").get() as any;
    res.json({ users: userCount.count, chats: chatCount.count, moods: moodCount.count });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
