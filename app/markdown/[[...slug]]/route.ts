import { NextRequest, NextResponse } from 'next/server'
import { getMarkdownForSlug, estimateTokenCount } from '@/lib/markdown-twin'

export const runtime = 'edge'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string[] }> }
) {
  const slug = (await params).slug?.join('/') || 'index'
  const content = getMarkdownForSlug(slug)

  if (!content) {
    return new NextResponse('Not Found', { status: 404 })
  }

  const accept = request.headers.get('accept') || ''
  const wantsSomethingElse = accept &&
    !accept.includes('text/markdown') &&
    !accept.includes('text/html') &&
    !accept.includes('*/*')

  if (wantsSomethingElse) {
    return new NextResponse('Not Acceptable', {
      status: 406,
      headers: { 'X-Robots-Tag': 'noindex' },
    })
  }

  const tokenCount = estimateTokenCount(content)

  return new NextResponse(content, {
    headers: {
      'Content-Type': 'text/markdown; charset=utf-8',
      'Vary': 'Accept',
      'X-Markdown-Tokens': String(tokenCount),
      'X-Robots-Tag': 'noindex',
      'X-AEO-Version': '1',
    },
  })
}
