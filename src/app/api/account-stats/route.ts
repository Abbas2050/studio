import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
  // Simulate network latency
  await new Promise(resolve => setTimeout(resolve, 500));

  const balance = 100000 + Math.random() * 5000;
  const equity = balance - Math.random() * 2000;
  const margin = equity / (10 + Math.random() * 5);
  const freeMargin = equity - margin;
  const marginLevel = (equity / margin) * 100;

  return NextResponse.json({
    balance,
    equity,
    margin,
    freeMargin,
    marginLevel,
  });
}
