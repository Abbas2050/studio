'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ChartContainer, ChartConfig } from '@/components/ui/chart';
import { Area, AreaChart } from 'recharts';
import { ArrowUp, ArrowDown } from 'lucide-react';
import type { SymbolStat } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';

type SymbolCardProps = {
  data?: SymbolStat;
  loading: boolean;
};

export function SymbolCard({ data, loading }: SymbolCardProps) {
  if (loading || !data) {
    return (
      <Card className="animate-pulse bg-card/50">
        <CardHeader className="p-4">
          <div className="flex justify-between items-center">
            <Skeleton className="h-6 w-20" />
            <Skeleton className="h-4 w-12" />
          </div>
          <Skeleton className="h-4 w-28 mt-1" />
        </CardHeader>
        <CardContent className="p-4 pt-0">
          <Skeleton className="h-7 w-24 mb-2" />
          <Skeleton className="h-[40px] w-full" />
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
    <Card className="overflow-hidden transition-all bg-card/80 backdrop-blur-sm border-border/50 shadow-lg shadow-primary/5 hover:border-primary/50 hover:shadow-primary/10">
      <CardHeader className="p-4">
        <div className="flex justify-between items-start">
          <CardTitle className="font-headline text-lg">{data.symbol}</CardTitle>
          <div className={cn("flex items-center gap-1 text-xs font-semibold", isPositive ? 'text-green-400' : 'text-red-400')}>
             {isPositive ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />}
            <span>{data.changePercent.toFixed(2)}%</span>
          </div>
        </div>
        <CardDescription className="text-xs truncate">{data.name}</CardDescription>
      </CardHeader>
      <CardContent className="p-4 pt-0">
        <div className="mb-2">
          <p className="text-2xl font-bold font-headline">{data.price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 5 })}</p>
        </div>
        <ChartContainer config={chartConfig} className="h-[40px] w-full">
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
