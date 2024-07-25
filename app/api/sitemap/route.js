import { NextResponse } from 'next/server';
import { generateSitemap } from '@/lib/sitemap';

export async function GET() {
  const sitemap = await generateSitemap();
  return NextResponse.json(sitemap, {
    headers: {
      'Content-Type': 'application/xml',
    },
  });
}
