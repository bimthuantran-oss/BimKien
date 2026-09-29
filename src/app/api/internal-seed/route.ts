import { NextResponse } from 'next/server';
import { main as runSeed } from '../../../../prisma/seed';

// TEMPORARY one-time bootstrap route — remove after the first production
// seed. Guarded by SEED_SECRET so it can only be triggered intentionally.
export async function GET(req: Request) {
  const secret = new URL(req.url).searchParams.get('secret');
  if (!process.env.SEED_SECRET || secret !== process.env.SEED_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    await runSeed();
    return NextResponse.json({ ok: true });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
