import Database from 'better-sqlite3';
import path from 'path';

const db = new Database('wellmind.db');

// Initialize database schema
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    role TEXT DEFAULT 'user',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS mood_logs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    mood TEXT NOT NULL,
    note TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
  );

  CREATE TABLE IF NOT EXISTS chat_sessions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    title TEXT DEFAULT 'New Conversation',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
  );

  CREATE TABLE IF NOT EXISTS chat_messages (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    session_id INTEGER NOT NULL,
    role TEXT NOT NULL,
    content TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (session_id) REFERENCES chat_sessions(id)
  );

  CREATE TABLE IF NOT EXISTS wellness_content (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    type TEXT NOT NULL, -- 'meditation', 'breathing', 'affirmation'
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    duration TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );
`);

// Seed some initial wellness content if empty
const contentCount = db.prepare('SELECT COUNT(*) as count FROM wellness_content').get() as { count: number };
if (contentCount.count === 0) {
  const insertContent = db.prepare('INSERT INTO wellness_content (type, title, content, duration) VALUES (?, ?, ?, ?)');
  
  insertContent.run('meditation', 'Morning Gratitude', 'Focus on three things you are grateful for today...', '5 min');
  insertContent.run('meditation', 'Stress Relief', 'Deep body scan to release tension from head to toe...', '10 min');
  insertContent.run('breathing', 'Box Breathing', 'Inhale 4s, Hold 4s, Exhale 4s, Hold 4s...', '3 min');
  insertContent.run('breathing', '4-7-8 Technique', 'Inhale 4s, Hold 7s, Exhale 8s...', '5 min');
  insertContent.run('affirmation', 'Daily Confidence', 'I am capable, I am strong, I am enough.', null);
}

export default db;
