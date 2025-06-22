export function GET() {
  const serverTime = new Date().toISOString();

  return Response.json({ serverTime });
}

export const dynamic = 'force-dynamic';
