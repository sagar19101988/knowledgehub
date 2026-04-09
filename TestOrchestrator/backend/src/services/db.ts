import Database from 'better-sqlite3';
import path from 'path';

// Connect to SQLite DB (creates file if it doesn't exist)
const dbPath = path.resolve(process.cwd(), 'orchestrator.db');
const db = new Database(dbPath, { verbose: console.log });

// Initialize database schema
export const initDb = () => {
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS user_integrations (
      user_id TEXT PRIMARY KEY,
      llm_provider TEXT,
      llm_api_key_encrypted TEXT,
      jira_config_encrypted TEXT,
      ado_config_encrypted TEXT,
      FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
    );
  `);
  console.log('✅ SQLite Database initialized securely.');
};

export default db;
