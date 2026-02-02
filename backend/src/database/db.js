import initSqlJs from 'sql.js';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Database path
const dbPath = process.env.DATABASE_PATH || path.join(__dirname, '../../../database/kivo.db');
const schemaPath = path.join(__dirname, '../../../database/schema.sql');

let db;
let SQL;

export async function getDatabase() {
  if (!db) {
    await initializeDatabase();
  }
  return db;
}

export async function initializeDatabase() {
  // Initialize SQL.js
  SQL = await initSqlJs();
  
  // Ensure database directory exists
  const dbDir = path.dirname(dbPath);
  if (!fs.existsSync(dbDir)) {
    fs.mkdirSync(dbDir, { recursive: true });
  }
  
  // Load existing database or create new one
  if (fs.existsSync(dbPath)) {
    const buffer = fs.readFileSync(dbPath);
    db = new SQL.Database(buffer);
    console.log('✅ Database loaded from file');
  } else {
    db = new SQL.Database();
    console.log('📦 Creating new database...');
    
    // Execute schema
    if (fs.existsSync(schemaPath)) {
      const schema = fs.readFileSync(schemaPath, 'utf-8');
      db.run(schema);
      console.log('✅ Database schema created');
      saveDatabase();
    } else {
      console.error('❌ Schema file not found:', schemaPath);
    }
  }
  
  // Check if tables exist
  const result = db.exec("SELECT name FROM sqlite_master WHERE type='table' AND name='users'");
  if (result.length === 0) {
    // Tables don't exist, create them
    if (fs.existsSync(schemaPath)) {
      const schema = fs.readFileSync(schemaPath, 'utf-8');
      db.run(schema);
      console.log('✅ Database schema created');
      saveDatabase();
    }
  }
  
  return db;
}

export function saveDatabase() {
  if (db) {
    const data = db.export();
    const buffer = Buffer.from(data);
    fs.writeFileSync(dbPath, buffer);
  }
}

export function closeDatabase() {
  if (db) {
    saveDatabase();
    db.close();
    db = null;
  }
}

// Helper functions to match better-sqlite3 API style
export function dbPrepare(sql) {
  return {
    get(...params) {
      const stmt = db.prepare(sql);
      stmt.bind(params);
      if (stmt.step()) {
        const result = stmt.getAsObject();
        stmt.free();
        return result;
      }
      stmt.free();
      return undefined;
    },
    all(...params) {
      const results = [];
      const stmt = db.prepare(sql);
      stmt.bind(params);
      while (stmt.step()) {
        results.push(stmt.getAsObject());
      }
      stmt.free();
      return results;
    },
    run(...params) {
      db.run(sql, params);
      saveDatabase();
      return {
        lastInsertRowid: db.exec("SELECT last_insert_rowid()")[0]?.values[0]?.[0],
        changes: db.getRowsModified()
      };
    }
  };
}
