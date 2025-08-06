"use client";

import { useState, useEffect, useCallback } from 'react';
import type { AccountStats, SymbolStat } from '@/lib/types';
import { DashboardHeader } from '@/components/dashboard/dashboard-header';
import { AccountStatsCard } from '@/components/dashboard/account-stats-card';
import { SymbolCard } from '@/components/dashboard/symbol-card';

export default function Home() {
  const [accountStats, setAccountStats] = useState<AccountStats | null>(null);
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
      setAccountStats(accountData);
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
      <main className="flex-1 p-4 md:p-8 lg:p-10">
        <DashboardHeader
          onRefresh={fetchData}
          loading={loading}
          lastUpdated={lastUpdated}
        />
        <div className="space-y-8">
          <AccountStatsCard stats={accountStats} loading={loading} />
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {loading
              ? Array.from({ length: 8 }).map((_, i) => <SymbolCard key={i} loading={true} />)
              : symbolStats.map((stat) => <SymbolCard key={stat.symbol} data={stat} loading={false} />)}
          </div>
        </div>
      </main>
    </div>
  );
}
