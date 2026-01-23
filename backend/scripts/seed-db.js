import initSqlJs from 'sql.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import bcrypt from 'bcryptjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Paths - relative to root project folder
const dbPath = path.join(__dirname, '../../database/kivo.db');
const schemaPath = path.join(__dirname, '../../database/schema.sql');

async function seed() {
  console.log('🌱 Seeding database...');
  console.log('📂 DB Path:', dbPath);
  console.log('📂 Schema Path:', schemaPath);
  
  // Ensure database directory exists
  const dbDir = path.dirname(dbPath);
  if (!fs.existsSync(dbDir)) {
    fs.mkdirSync(dbDir, { recursive: true });
  }
  
  // Initialize SQL.js
  const SQL = await initSqlJs();
  
  // Load or create database
  let db;
  if (fs.existsSync(dbPath)) {
    const buffer = fs.readFileSync(dbPath);
    db = new SQL.Database(buffer);
    console.log('📦 Database loaded');
  } else {
    db = new SQL.Database();
    console.log('📦 Creating new database...');
    
    // Run schema
    const schema = fs.readFileSync(schemaPath, 'utf-8');
    db.run(schema);
    console.log('✅ Schema created');
  }
  
  // Check if admin exists
  const result = db.exec("SELECT id FROM users WHERE email = 'admin@kivo.app'");
  
  if (result.length === 0 || result[0].values.length === 0) {
    // Create admin user with password "admin"
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash('admin1', salt);
    
    db.run(`INSERT INTO users (email, password_hash, nombre) VALUES ('admin@kivo.app', '${hash}', 'Administrador')`);
    console.log('✅ Admin user created: admin@kivo.app / admin1');
  } else {
    console.log('ℹ️  Admin user already exists');
  }
  
  // Save database
  const data = db.export();
  const buffer = Buffer.from(data);
  fs.writeFileSync(dbPath, buffer);
  
  console.log('✅ Database saved to', dbPath);
  db.close();
}

seed().catch(console.error);
