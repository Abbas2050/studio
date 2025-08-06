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

  const fetchData = useCallback(async (isManualRefresh = false) => {
    if (!isManualRefresh && loading) return; // Avoid overlapping fetches
    setLoading(true);
    try {
      const [accountRes, symbolsRes] = await Promise.all([
        fetch('/api/account-stats'),
        fetch('/api/symbol-stats'),
      ]);

      if (!accountRes.ok || !symbolsRes.ok) {
        throw new Error('Failed to fetch data');
      }

      const accountData = await accountRes.json();
      const symbolsData = await symbolsRes.json();

      setAccountStats(accountData);
      setSymbolStats(symbolsData);
      setLastUpdated(new Date());
    } catch (error) {
      console.error("Failed to fetch dashboard data:", error);
    } finally {
      setLoading(false);
    }
  }, [loading]);

  useEffect(() => {
    fetchData();
    const interval = setInterval(() => fetchData(), 30000); // Auto-refresh every 30 seconds
    return () => clearInterval(interval);
  }, [fetchData]);

  const handleRefresh = () => {
    fetchData(true);
  };

  return (
    <main className="min-h-screen bg-background text-foreground p-4 sm:p-6 lg:p-8">
      <div className="max-w-screen-2xl mx-auto">
        <DashboardHeader 
          onRefresh={handleRefresh} 
          loading={loading} 
          lastUpdated={lastUpdated} 
        />

        <section className="my-8">
          <h2 className="text-2xl font-headline font-bold mb-4 text-primary">Account Overview</h2>
          <AccountStatsCard stats={accountStats} loading={loading && !accountStats} />
        </section>

        <section>
          <h2 className="text-2xl font-headline font-bold mb-4 text-primary">Market Watch</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {(loading && symbolStats.length === 0) ? (
              Array.from({ length: 8 }).map((_, i) => <SymbolCard key={i} loading={true} />)
            ) : (
              symbolStats.map(symbol => (
                <SymbolCard key={symbol.symbol} data={symbol} loading={loading} />
              ))
            )}
          </div>
        </section>
      </div>
    </main>
  );
}
