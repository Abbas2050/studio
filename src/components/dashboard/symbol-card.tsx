'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ChartContainer, ChartConfig } from '@/components/ui/chart';
import { Area, AreaChart } from 'recharts';
import { TrendingUp, TrendingDown } from 'lucide-react';
import type { SymbolStat } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';

type SymbolCardProps = {
  data?: SymbolStat;
  loading: boolean;
};

export function SymbolCard({ data, loading }: SymbolCardProps) {
  if (loading || !data) {
    return (
      <Card className="animate-pulse">
        <CardHeader>
          <div className="flex justify-between items-center">
            <Skeleton className="h-6 w-24" />
            <Skeleton className="h-4 w-12" />
          </div>
          <Skeleton className="h-4 w-40 mt-1" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-8 w-32 mb-2" />
          <Skeleton className="h-5 w-20 mb-4" />
          <Skeleton className="h-[50px] w-full" />
        </CardContent>
      </Card>
    );
  }

  const isPositive = data.changePercent >= 0;

  const chartConfig = {
    value: {
      label: "Price",
      color: isPositive ? "hsl(var(--chart-2))" : "hsl(var(--chart-1))",
    },
  } satisfies ChartConfig;

  return (
    <Card className="overflow-hidden transition-all hover:border-primary/50 hover:shadow-lg hover:shadow-primary/10">
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="font-headline text-2xl">{data.symbol}</CardTitle>
          <Badge variant={isPositive ? 'default' : 'destructive'} className={cn(
            'flex items-center gap-1', 
            isPositive ? 'bg-green-500/20 text-green-400 border-green-500/30' : 'bg-red-500/20 text-red-400 border-red-500/30'
          )}>
            {isPositive ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
            <span>{data.changePercent.toFixed(2)}%</span>
          </Badge>
        </div>
        <CardDescription className="truncate">{data.name}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="mb-2">
          <p className="text-3xl font-bold font-headline">{data.price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 5 })}</p>
          <p className={cn("text-sm font-semibold", isPositive ? 'text-green-400' : 'text-red-400')}>
            {isPositive ? '+' : ''}{data.change.toFixed(2)}
          </p>
        </div>
        <ChartContainer config={chartConfig} className="h-[50px] w-full">
          <AreaChart
            accessibilityLayer
            data={data.history}
            margin={{ left: 0, right: 0, top: 0, bottom: 0 }}
          >
            <defs>
              <linearGradient id={`gradient-${data.symbol}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--color-value)" stopOpacity={0.4} />
                <stop offset="95%" stopColor="var(--color-value)" stopOpacity={0} />
              </linearGradient>
            </defs>
            <Area
              dataKey="value"
              type="natural"
              fill={`url(#gradient-${data.symbol})`}
              stroke="var(--color-value)"
              strokeWidth={2}
              stackId="a"
              dot={false}
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
