import { revalidateTag } from 'next/cache'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)

  const password = searchParams.get('password')

  if (password !== process.env.REVALIDATE_PASSWORD) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  revalidateTag('hikes', 'max')

  return NextResponse.json({
    success: true,
  })
}
