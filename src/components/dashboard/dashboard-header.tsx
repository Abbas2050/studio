
'use client';

import { RefreshCw, Moon, Sun } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useTheme } from '@/hooks/use-theme';
import { useEffect, useState } from 'react';

type DashboardHeaderProps = {
  onRefresh: () => void;
  loading: boolean;
  lastUpdated: Date | null;
};

export function DashboardHeader({ onRefresh, loading, lastUpdated }: DashboardHeaderProps) {
  const { theme, toggleTheme } = useTheme();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <header className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8">
      <div>
        <h1 className="text-3xl md:text-4xl font-headline font-bold text-primary tracking-tighter">
          TradeVision Dashboard
        </h1>
        <p className="text-muted-foreground mt-1">
          Your real-time market command center.
        </p>
      </div>
      <div className="flex items-center gap-2 mt-4 sm:mt-0">
        {lastUpdated && (
            <p className="text-sm text-muted-foreground hidden md:block">
              Last updated: {lastUpdated.toLocaleTimeString()}
            </p>
        )}
        <Button onClick={onRefresh} disabled={loading} variant="outline" size="icon" className="bg-card hover:bg-secondary">
          <RefreshCw className={cn('h-4 w-4', loading && 'animate-spin')} />
          <span className="sr-only">Refresh data</span>
        </Button>
        {isClient && (
          <Button onClick={toggleTheme} variant="outline" size="icon" className="bg-card hover:bg-secondary">
            <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            <span className="sr-only">Toggle theme</span>
          </Button>
        )}
      </div>
    </header>
  );
}
