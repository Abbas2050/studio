
"use client";

import { useState, useEffect, useCallback } from 'react';
import type { AccountStats, SymbolStat, Account } from '@/lib/types';
import { DashboardHeader } from '@/components/dashboard/dashboard-header';
import { InfoCard } from '@/components/dashboard/info-card';
import { AccountsTable } from '@/components/dashboard/accounts-table';
import { SymbolStatsTable } from '@/components/dashboard/symbol-stats-table';
import { DollarSign, BarChart, TrendingUp, Scale, CreditCard } from 'lucide-react';
import { Preloader } from '@/components/dashboard/preloader';
import { cn } from '@/lib/utils';

export default function Home() {
  const [accountData, setAccountData] = useState<{ summary: AccountStats; accounts: Account[] } | null>(null);
  const [symbolStats, setSymbolStats] = useState<SymbolStat[]>([]);
  const [accountsLoading, setAccountsLoading] = useState(true);
  const [symbolsLoading, setSymbolsLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [initialLoad, setInitialLoad] = useState(true);

  const fetchAccountData = useCallback(async () => {
    setAccountsLoading(true);
    try {
      const response = await fetch('/api/account-stats');
      const data = await response.json();
      setAccountData(data);
    } catch (error) {
      console.error("Failed to fetch account data:", error);
    } finally {
      setAccountsLoading(false);
    }
  }, []);

  const fetchSymbolData = useCallback(async () => {
    setSymbolsLoading(true);
    try {
      const response = await fetch('/api/symbol-stats');
      const data = await response.json();
      setSymbolStats(data);
    } catch (error) {
      console.error("Failed to fetch symbol stats:", error);
    } finally {
      setSymbolsLoading(false);
    }
  }, []);

  const handleRefresh = useCallback(() => {
    fetchAccountData();
    fetchSymbolData();
    setLastUpdated(new Date());
  }, [fetchAccountData, fetchSymbolData]);

  useEffect(() => {
    handleRefresh();
    const interval = setInterval(handleRefresh, 60000); // Refresh every 1 minute
    return () => clearInterval(interval);
  }, [handleRefresh]);
  
  useEffect(() => {
    if (!accountsLoading && !symbolsLoading && initialLoad) {
      // Use a timeout to allow the fade-out animation to be seen
      setTimeout(() => setInitialLoad(false), 500);
    }
  }, [accountsLoading, symbolsLoading, initialLoad]);

  const summaryStats = [
    {
      title: 'Total Equity',
      value: accountData?.summary?.equity,
      icon: DollarSign,
    },
    {
      title: 'Total Credit',
      value: accountData?.summary?.credit,
      icon: CreditCard,
    },
    {
      title: 'Total Floating PNL',
      value: accountData?.summary?.floatingPnl,
      icon: BarChart,
    },
    {
      title: 'Total Margin',
      value: accountData?.summary?.margin,
      icon: Scale,
    },
  ];

  return (
    <div className="flex min-h-screen w-full flex-col bg-background text-foreground">
      <Preloader loading={initialLoad} />

      <main className={cn("flex flex-1 flex-col p-4 md:p-6 lg:p-8 transition-opacity duration-500", initialLoad ? 'opacity-0' : 'opacity-100')}>
        <DashboardHeader
          onRefresh={handleRefresh}
          loading={accountsLoading || symbolsLoading}
          lastUpdated={lastUpdated}
        />
        <div className="flex-1 space-y-6">
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {summaryStats.map((stat, i) => (
              <InfoCard
                key={i}
                title={stat.title}
                value={stat.value}
                icon={stat.icon}
                loading={accountsLoading}
              />
            ))}
          </div>

          <div className="grid grid-cols-1 gap-6">
            <SymbolStatsTable loading={symbolsLoading} data={symbolStats} />
            <AccountsTable loading={accountsLoading} data={accountData?.accounts ?? []} />
          </div>
        </div>
      </main>
    </div>
  );
}
