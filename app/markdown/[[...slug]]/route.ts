import { NextRequest, NextResponse } from 'next/server'
import { getMarkdownForSlug, estimateTokenCount } from '@/lib/markdown-twin'
export const runtime = 'edge'
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ slug: string[] }> }
) {
  const slug = (await params).slug?.join('/') || 'index'
  const content = getMarkdownForSlug(slug)
  if (!content) {
    return new NextResponse('Not Found', { status: 404 })
  }
  const tokenCount = estimateTokenCount(content)
  return new NextResponse(content, {
    headers: {
      'Content-Type': 'text/markdown; charset=utf-8',
      'X-Markdown-Tokens': String(tokenCount),
      'X-Robots-Tag': 'noindex',
    },
  })
}
