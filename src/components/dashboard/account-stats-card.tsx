'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Skeleton } from '@/components/ui/skeleton';
import type { AccountStats } from '@/lib/types';
import { cn } from '@/lib/utils';

type AccountStatsCardProps = {
  stats: { summary: AccountStats } | null;
  loading: boolean;
};

const formatCurrency = (value: number) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value);

const StatItem = ({ label, value, className }: { label: string; value: string | React.ReactNode; className?: string }) => (
  <div className="flex flex-col items-center text-center p-2 rounded-lg bg-secondary/30">
    <p className="text-xs sm:text-sm text-muted-foreground">{label}</p>
    <p className={cn("text-lg sm:text-xl font-semibold font-headline", className)}>{value}</p>
  </div>
);

export function AccountStatsCard({ stats, loading }: AccountStatsCardProps) {
  const summary = stats?.summary;

  if (loading || !summary) {
    return (
      <Card className="w-full">
        <CardHeader>
          <Skeleton className="h-7 w-48" />
          <Skeleton className="h-4 w-64 mt-1" />
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {Array.from({length: 4}).map((_, i) => (
              <div key={i} className="space-y-2 p-2 rounded-lg bg-secondary/30">
                <Skeleton className="h-5 w-20 mx-auto" />
                <Skeleton className="h-7 w-32 mx-auto" />
              </div>
            ))}
          </div>
          <div className="mt-6 space-y-2">
            <Skeleton className="h-5 w-28" />
            <Skeleton className="h-4 w-full" />
          </div>
        </CardContent>
      </Card>
    );
  }

  const getMarginLevelColor = (level: number) => {
    if (level < 200) return 'bg-destructive';
    if (level < 500) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  return (
    <Card className="w-full bg-card/80 backdrop-blur-sm border-border/50 shadow-lg shadow-primary/5">
      <CardHeader>
        <CardTitle className="font-headline text-2xl">Accounts Summary</CardTitle>
        <CardDescription>Live summary of all your trading accounts.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <StatItem label="Total Balance" value={formatCurrency(summary.balance)} className="text-primary" />
          <StatItem label="Total Equity" value={formatCurrency(summary.equity)} />
          <StatItem label="Total Margin" value={formatCurrency(summary.margin)} />
          <StatItem label="Free Margin" value={formatCurrency(summary.freeMargin)} />
        </div>
        <div>
          <div className="flex justify-between items-baseline mb-1">
            <p className="text-sm text-muted-foreground">Aggregated Margin Level</p>
            <p className="text-2xl font-bold font-headline text-primary">
              {summary.marginLevel.toFixed(2)}%
            </p>
          </div>
          <Progress value={Math.min(summary.marginLevel / 10, 100)} className="h-3 [&>*]:transition-all" indicatorClassName={getMarginLevelColor(summary.marginLevel)} />
           <p className="text-xs text-muted-foreground mt-2">
             A percentage value indicating the health of your accounts. Levels below 200% may trigger a margin call.
           </p>
        </div>
      </CardContent>
    </Card>
  );
}
