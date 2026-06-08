// scripts/create-admin.ts
import { db } from '@/lib/db/drizzle';
import { users } from '@/lib/db/drizzle/schema';
import { eq } from 'drizzle-orm';
import { randomUUID } from 'crypto';
import { scrypt, randomBytes } from 'crypto';
import { promisify } from 'util';

const scryptAsync = promisify(scrypt);

async function hashPassword(password: string): Promise<string> {
  const salt = randomBytes(16).toString('hex');
  const derivedKey = (await scryptAsync(password, salt, 64)) as Buffer;
  return `${salt}:${derivedKey.toString('hex')}`;
}

async function createOrUpdateAdmin() {
  const adminEmail = 'hohiho410@gmail.com';
  const adminUsername = 'Admin';
  const adminPassword = 'Amane0978';
  
  console.log('🔧 Checking admin user...');
  
  // Cek apakah admin sudah ada
  const existingAdmin = await db.select().from(users).where(eq(users.email, adminEmail));
  
  if (existingAdmin.length > 0) {
    console.log('📝 Admin already exists, updating...');
    
    const hashedPassword = await hashPassword(adminPassword);
    
    await db.update(users)
      .set({ 
        password: hashedPassword,
        role: 'admin', 
        rank: 'Supreme Administrator',
        level: 99,
        xp: 999999,
        isVerified: true,
        username: adminUsername,
        initials: 'AD',
      })
      .where(eq(users.email, adminEmail));
      
    console.log('✅ Admin updated successfully!');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('📧 Email:', adminEmail);
    console.log('🔑 Password:', adminPassword);
    console.log('👤 Role: admin');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    return;
  }
  
  // Buat admin baru
  console.log('📝 Creating new admin...');
  const hashedPassword = await hashPassword(adminPassword);
  const userId = randomUUID();
  
  await db.insert(users).values({
    id: userId,
    username: adminUsername,
    email: adminEmail,
    password: hashedPassword,
    isVerified: true,
    role: 'admin',
    rank: 'Supreme Administrator',
    level: 99,
    xp: 999999,
    totalReports: 0,
    initials: 'AD',
    lastLogin: new Date(),
  });
  
  console.log('✅ Admin created successfully!');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('📧 Email:', adminEmail);
  console.log('🔑 Password:', adminPassword);
  console.log('👤 Role: admin');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
}

// Jalankan script
createOrUpdateAdmin()
  .then(() => {
    console.log('🎉 Done!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Error:', error);
    process.exit(1);
  });