import initSqlJs from 'sql.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import bcrypt from 'bcryptjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dbPath = path.join(__dirname, '../../database/kivo.db');

async function resetUser() {
    console.log('🔄 Resetting admin user...');

    const SQL = await initSqlJs();

    if (!fs.existsSync(dbPath)) {
        console.error('❌ Database not found at', dbPath);
        process.exit(1);
    }

    const buffer = fs.readFileSync(dbPath);
    const db = new SQL.Database(buffer);

    // Delete all users first
    db.run("DELETE FROM users");
    console.log('🗑️  Deleted all users');

    // Create new user with new credentials
    const newEmail = 'admin@kivo.app';
    const newPassword = 'admin2026';
    const newName = 'admin';

    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(newPassword, salt);

    db.run(`INSERT INTO users (email, password_hash, nombre) VALUES ('${newEmail}', '${hash}', '${newName}')`);
    console.log('✅ New user created!');
    console.log('');
    console.log('📧 Email:', newEmail);
    console.log('🔑 Password:', newPassword);
    console.log('👤 Name:', newName);

    // Save database
    const data = db.export();
    const bufferOut = Buffer.from(data);
    fs.writeFileSync(dbPath, bufferOut);

    console.log('');
    console.log('✅ Database saved!');
    db.close();
}

resetUser().catch(console.error);
