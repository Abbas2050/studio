import { NextResponse } from 'next/server';
import type { Account, AccountStats } from '@/lib/types';

export const dynamic = 'force-dynamic';

function createDummyAccount(): Account {
  const balance = 50000 + Math.random() * 150000;
  const equity = balance - Math.random() * 5000;
  const margin = equity / (10 + Math.random() * 40);
  const freeMargin = equity - margin;
  const marginLevel = margin > 0 ? (equity / margin) * 100 : 0;
  const profit = equity - balance;
  const floatingPnl = (Math.random() - 0.5) * balance * 0.05;

  return {
    login: Math.floor(1000000 + Math.random() * 9000000),
    balance,
    margin,
    freeMargin,
    marginLevel,
    leverage: 100 + Math.floor(Math.random() * 5) * 100,
    profit,
    swap: (Math.random() - 0.8) * 100,
    floatingPnl,
    equity,
  }
}

function getAccountStats(accounts: Account[]): AccountStats {
    return accounts.reduce((acc, account) => {
        acc.balance += account.balance;
        acc.equity += account.equity;
        acc.margin += account.margin;
        acc.freeMargin += account.freeMargin;
        return acc;
    }, { balance: 0, equity: 0, margin: 0, freeMargin: 0, marginLevel: 0 });
}


export async function GET() {
  // Simulate network latency
  await new Promise(resolve => setTimeout(resolve, 500));

  const accounts = Array.from({ length: 5 }, createDummyAccount);
  const summary = getAccountStats(accounts);
  
  const totalMargin = summary.margin;
  summary.marginLevel = totalMargin > 0 ? (summary.equity / totalMargin) * 100 : 0;

  return NextResponse.json({
    summary,
    accounts
  });
}
