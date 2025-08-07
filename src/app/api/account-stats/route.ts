
import { NextResponse } from 'next/server';
import type { Account, AccountStats } from '@/lib/types';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const response = await fetch('https://api.skylinkstrader.com/Account/GetAllAccounts');
    if (!response.ok) {
      throw new Error(`Failed to fetch accounts: ${response.statusText}`);
    }
    const accounts: Account[] = await response.json();
    
    // Filter out accounts with login < 1000
    const filteredAccounts = accounts.filter(acc => acc.login >= 1000);

    const summary = filteredAccounts.reduce((acc, account) => {
        acc.balance += account.balance;
        acc.equity += account.equity;
        acc.margin += account.margin;
        acc.freeMargin += account.marginFree;
        acc.profit += account.profit;
        acc.floatingPnl += account.floatingPnl;
        acc.credit += account.credit;
        return acc;
    }, { balance: 0, equity: 0, margin: 0, freeMargin: 0, marginLevel: 0, profit: 0, floatingPnl: 0, credit: 0 });

    const totalMargin = summary.margin;
    summary.marginLevel = totalMargin > 0 ? (summary.equity / totalMargin) * 100 : 0;

    return NextResponse.json({
      summary,
      accounts: filteredAccounts
    });
  } catch (error) {
    console.error('Error fetching account stats:', error);
    return NextResponse.json({ message: 'Error fetching account data' }, { status: 500 });
  }
}
