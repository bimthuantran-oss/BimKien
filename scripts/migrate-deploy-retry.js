// Neon's free-tier database scales to zero when idle and can take longer than
// Prisma's fixed 10s advisory-lock timeout to wake up, causing `prisma migrate
// deploy` to fail with P1002 on a cold compute. The first attempt's connection
// wakes it up; retrying with backoff lets a subsequent attempt succeed warm.
const { execSync } = require('node:child_process');

const MAX_ATTEMPTS = 4;
const DELAYS_MS = [0, 5000, 10000, 15000];

function sleep(ms) {
  execSync(`node -e "setTimeout(()=>{}, ${ms})"`, { stdio: 'ignore' });
}

for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
  if (DELAYS_MS[attempt - 1] > 0) {
    console.log(`Waiting ${DELAYS_MS[attempt - 1]}ms before retry (attempt ${attempt}/${MAX_ATTEMPTS})...`);
    sleep(DELAYS_MS[attempt - 1]);
  }
  try {
    execSync('npx prisma migrate deploy', { stdio: 'inherit' });
    process.exit(0);
  } catch {
    console.log(`Migrate attempt ${attempt}/${MAX_ATTEMPTS} failed.`);
    if (attempt === MAX_ATTEMPTS) {
      console.error('All migrate deploy attempts failed.');
      process.exit(1);
    }
  }
}
