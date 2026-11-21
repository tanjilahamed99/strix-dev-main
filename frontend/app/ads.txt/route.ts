export const dynamic = 'force-static';

export async function GET() {
  const content = 'google.com, pub-9387112526186086, DIRECT, f08c47fec0942fa0\n';

  return new Response(content, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=86400',
    },
  });
}
