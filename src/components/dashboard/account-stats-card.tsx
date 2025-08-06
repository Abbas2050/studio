'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Skeleton } from '@/components/ui/skeleton';
import type { AccountStats } from '@/lib/types';
import { cn } from '@/lib/utils';

type AccountStatsCardProps = {
  stats: AccountStats | null;
  loading: boolean;
};

const formatCurrency = (value: number) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value);

const StatItem = ({ label, value, className }: { label: string; value: string | React.ReactNode; className?: string }) => (
  <div>
    <p className="text-sm text-muted-foreground">{label}</p>
    <p className={cn("text-xl font-semibold font-headline", className)}>{value}</p>
  </div>
);

export function AccountStatsCard({ stats, loading }: AccountStatsCardProps) {
  if (loading || !stats) {
    return (
      <Card className="w-full">
        <CardHeader>
          <Skeleton className="h-7 w-48" />
          <Skeleton className="h-4 w-64 mt-1" />
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="space-y-2">
              <Skeleton className="h-5 w-20" />
              <Skeleton className="h-7 w-32" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-5 w-16" />
              <Skeleton className="h-7 w-28" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-5 w-16" />
              <Skeleton className="h-7 w-24" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-5 w-24" />
              <Skeleton className="h-7 w-32" />
            </div>
          </div>
          <div className="mt-8 space-y-2">
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
    <Card className="w-full bg-card/80 backdrop-blur-sm border-primary/20 shadow-lg shadow-primary/5">
      <CardHeader>
        <CardTitle className="font-headline text-2xl">Wallet</CardTitle>
        <CardDescription>Live summary of your trading account.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
          <StatItem label="Balance" value={formatCurrency(stats.balance)} className="text-primary" />
          <StatItem label="Equity" value={formatCurrency(stats.equity)} />
          <StatItem label="Margin Used" value={formatCurrency(stats.margin)} />
          <StatItem label="Free Margin" value={formatCurrency(stats.freeMargin)} />
        </div>
        <div>
          <div className="flex justify-between items-baseline mb-1">
            <p className="text-sm text-muted-foreground">Margin Level</p>
            <p className="text-2xl font-bold font-headline text-accent">
              {stats.marginLevel.toFixed(2)}%
            </p>
          </div>
          <Progress value={Math.min(stats.marginLevel / 10, 100)} className="h-3 [&>*]:transition-all" indicatorClassName={getMarginLevelColor(stats.marginLevel)} />
           <p className="text-xs text-muted-foreground mt-1">
             A percentage value indicating the health of your account. Levels below 200% may trigger a margin call.
           </p>
        </div>
      </CardContent>
    </Card>
  );
}