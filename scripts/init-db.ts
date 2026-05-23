const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: '.env.local' });

async function initDatabase() {
  const connection = await mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'password',
    multipleStatements: true,
  });

  const sql = fs.readFileSync(path.join(__dirname, '../database.sql'), 'utf8');
  
  try {
    await connection.query(sql);
    console.log('✅ Database Triablazer berhasil diinisialisasi!');
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await connection.end();
  }
}

initDatabase();