import { RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

type DashboardHeaderProps = {
  onRefresh: () => void;
  loading: boolean;
  lastUpdated: Date | null;
};

export function DashboardHeader({ onRefresh, loading, lastUpdated }: DashboardHeaderProps) {
  return (
    <header className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8">
      <div>
        <h1 className="text-4xl font-headline font-bold text-primary tracking-tighter">
          TradeVision Dashboard
        </h1>
        <p className="text-muted-foreground mt-1">
          Your real-time market command center.
        </p>
      </div>
      <div className="flex items-center gap-4 mt-4 sm:mt-0">
        {lastUpdated && (
            <p className="text-sm text-muted-foreground">
              Last updated: {lastUpdated.toLocaleTimeString()}
            </p>
        )}
        <Button onClick={onRefresh} disabled={loading} variant="outline" size="icon" className="bg-card hover:bg-secondary">
          <RefreshCw className={cn('h-4 w-4', loading && 'animate-spin')} />
          <span className="sr-only">Refresh data</span>
        </Button>
      </div>
    </header>
  );
}
