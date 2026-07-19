import { execSync } from 'child_process';

async function globalSetup() {
  console.log('Seeding the test database...');
  try {
    // We execute the deterministic seed script
    execSync('npm run db:seed:test', { stdio: 'inherit' });
    console.log('Database seeding complete.');
  } catch (error) {
    console.error('Failed to seed the database:', error);
    throw error;
  }
}

export default globalSetup;
