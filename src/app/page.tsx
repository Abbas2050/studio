
"use client";

import { useState, useEffect, useCallback } from 'react';
import type { AccountStats, SymbolStat, Account } from '@/lib/types';
import { DashboardHeader } from '@/components/dashboard/dashboard-header';
import { AccountStatsCard } from '@/components/dashboard/account-stats-card';
import { SymbolCard } from '@/components/dashboard/symbol-card';
import { AccountsTable } from '@/components/dashboard/accounts-table';
import { SymbolStatsTable } from '@/components/dashboard/symbol-stats-table';
import { RecentTrades } from '@/components/dashboard/recent-trades';

export default function Home() {
  const [accountData, setAccountData] = useState<{ summary: AccountStats; accounts: Account[] } | null>(null);
  const [symbolStats, setSymbolStats] = useState<SymbolStat[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [accountRes, symbolsRes] = await Promise.all([
        fetch('/api/account-stats'),
        fetch('/api/symbol-stats'),
      ]);
      const accountData = await accountRes.json();
      const symbolsData = await symbolsRes.json();
      setAccountData(accountData);
      setSymbolStats(symbolsData);
      setLastUpdated(new Date());
    } catch (error) {
      console.error("Failed to fetch data:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 30000); // Refresh every 30 seconds
    return () => clearInterval(interval);
  }, [fetchData]);

  return (
    <div className="flex min-h-screen w-full flex-col bg-background text-foreground">
      <main className="flex-1 p-4 md:p-6 lg:p-8">
        <DashboardHeader
          onRefresh={fetchData}
          loading={loading}
          lastUpdated={lastUpdated}
        />
        <div className="space-y-6">
          <AccountStatsCard stats={accountData} loading={loading} />

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            <div className="lg:col-span-2 space-y-6">
               <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                {loading
                  ? Array.from({ length: 4 }).map((_, i) => <SymbolCard key={i} loading={true} />)
                  : symbolStats.slice(0, 4).map((stat) => <SymbolCard key={stat.symbol} data={stat} loading={false} />)}
              </div>
              <AccountsTable loading={loading} data={accountData?.accounts ?? []} />
              <SymbolStatsTable loading={loading} data={symbolStats} />
            </div>
            <div className="lg:col-span-1">
              <RecentTrades />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
