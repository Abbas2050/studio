"use client";

import { useState, useEffect, useCallback } from 'react';
import type { AccountStats, SymbolStat, Account } from '@/lib/types';
import { SidebarProvider, Sidebar, SidebarContent, SidebarHeader, SidebarMenu, SidebarMenuItem, SidebarMenuButton, SidebarInset } from '@/components/ui/sidebar';
import { DashboardHeader } from '@/components/dashboard/dashboard-header';
import { SymbolCard } from '@/components/dashboard/symbol-card';
import { AccountsTable } from '@/components/dashboard/accounts-table';
import { SymbolStatsTable } from '@/components/dashboard/symbol-stats-table';
import { BookUser, CandlestickChart, Landmark, LineChart } from 'lucide-react';

export default function Home() {
  const [data, setData] = useState<{ summary: AccountStats; accounts: Account[] } | null>(null);
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
      setData(accountData);
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
    <SidebarProvider>
      <div className="flex min-h-screen w-full flex-col bg-background text-foreground">
        <Sidebar>
          <SidebarHeader>
            <div className="flex items-center gap-2 p-2">
              <CandlestickChart className="w-8 h-8 text-primary" />
              <h2 className="text-xl font-headline font-bold">TradeVision</h2>
            </div>
          </SidebarHeader>
          <SidebarContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton isActive>
                  <LineChart />
                  <span>Dashboard</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton>
                  <Landmark />
                  <span>Accounts</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton>
                  <BookUser />
                  <span>Contacts</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarContent>
        </Sidebar>
        <SidebarInset>
          <main className="flex-1 p-4 md:p-6 lg:p-8">
            <DashboardHeader
              onRefresh={fetchData}
              loading={loading}
              lastUpdated={lastUpdated}
            />
            <div className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                {loading
                  ? Array.from({ length: 4 }).map((_, i) => <SymbolCard key={i} loading={true} />)
                  : symbolStats.slice(0, 4).map((stat) => <SymbolCard key={stat.symbol} data={stat} loading={false} />)}
              </div>

              <div className="grid grid-cols-1 gap-6">
                <AccountsTable loading={loading} data={data?.accounts ?? []} />
                <SymbolStatsTable loading={loading} data={symbolStats} />
              </div>
            </div>
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
