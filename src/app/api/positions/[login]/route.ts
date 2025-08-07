
import { NextResponse } from 'next/server';
import type { Position } from '@/lib/types';

export const dynamic = 'force-dynamic';

export async function GET(
  request: Request,
  { params }: { params: { login: string } }
) {
  const login = params.login;
  if (!login) {
    return NextResponse.json({ message: 'Login parameter is required' }, { status: 400 });
  }

  try {
    const response = await fetch(`https://api.skylinkstrader.com/Position/GetPositionsByLogin?login=${login}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch positions for login ${login}: ${response.statusText}`);
    }
    const positions: Position[] = await response.json();
    return NextResponse.json(positions);
  } catch (error) {
    console.error(`Error fetching positions for login ${login}:`, error);
    return NextResponse.json({ message: `Error fetching position data for login ${login}` }, { status: 500 });
  }
}
