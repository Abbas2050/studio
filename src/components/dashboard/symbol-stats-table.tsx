
'use client';

import { useState, useMemo } from 'react';
import type { SymbolStat } from '@/lib/types';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { cn, formatCompactNumber } from '@/lib/utils';
import { ArrowUpDown, BarChart, TrendingUp, TrendingDown } from 'lucide-react';
import { Progress } from '../ui/progress';

type SymbolStatsTableProps = {
  data: SymbolStat[];
  loading: boolean;
};

export function SymbolStatsTable({ data, loading }: SymbolStatsTableProps) {
  const [search, setSearch] = useState('');

  const filteredData = useMemo(() => {
    return data.filter(stat =>
      stat.symbol.toLowerCase().includes(search.toLowerCase()) ||
      stat.name.toLowerCase().includes(search.toLowerCase())
    );
  }, [data, search]);

  const renderSkeleton = (key: number) => (
    <TableRow key={key} className="animate-pulse">
        <TableCell><Skeleton className="h-5 w-20" /></TableCell>
        <TableCell className="text-right"><Skeleton className="h-5 w-24 ml-auto" /></TableCell>
        <TableCell className="text-right"><Skeleton className="h-5 w-24 ml-auto" /></TableCell>
        <TableCell className="text-right"><Skeleton className="h-5 w-24 ml-auto" /></TableCell>
    </TableRow>
  );

  return (
    <Card className="bg-card/80 backdrop-blur-sm border-border/50 shadow-lg shadow-primary/5 transition-all duration-300 hover:shadow-primary/10">
      <CardHeader>
        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-md bg-primary/10 border border-primary/20">
              <BarChart className="h-6 w-6 text-primary" />
            </div>
            <div>
              <CardTitle className="font-headline text-2xl text-primary">Symbol Volume Statistics</CardTitle>
              <CardDescription>Real-time trading volume data</CardDescription>
            </div>
          </div>
          <Input
            placeholder="Search Symbol..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="max-w-xs bg-secondary/50"
          />
        </div>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>
                  <div className="flex items-center gap-1">Symbol <ArrowUpDown className="h-3 w-3" /></div>
                </TableHead>
                <TableHead className="text-right">
                  <div className="flex items-center justify-end gap-1">Buy Volume <ArrowUpDown className="h-3 w-3" /></div>
                </TableHead>
                <TableHead className="text-right">
                   <div className="flex items-center justify-end gap-1">Sell Volume <ArrowUpDown className="h-3 w-3" /></div>
                </TableHead>
                <TableHead className="text-right">
                   <div className="flex items-center justify-end gap-1">Net Volume <ArrowUpDown className="h-3 w-3" /></div>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                Array.from({ length: 8 }).map((_, i) => renderSkeleton(i))
              ) : filteredData.length > 0 ? (
                filteredData.map((stat) => (
                  <TableRow key={stat.symbol} className="transition-colors hover:bg-secondary/30">
                    <TableCell>
                      <div className="font-medium text-primary/90">{stat.symbol}</div>
                      <div className="text-xs text-muted-foreground">{stat.name}</div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="font-semibold text-green-400">{formatCompactNumber(stat.buyVolume)}</div>
                      <Progress value={stat.buyVolumePercent} indicatorClassName="bg-green-500" className="h-1.5 mt-1 bg-green-500/20" />
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="font-semibold text-red-400">{formatCompactNumber(stat.sellVolume)}</div>
                       <Progress value={stat.sellVolumePercent} indicatorClassName="bg-red-500" className="h-1.5 mt-1 bg-red-500/20" />
                    </TableCell>
                    <TableCell className={cn("text-right font-semibold", stat.netVolume >= 0 ? 'text-green-400' : 'text-red-400')}>
                      <div className="flex items-center justify-end gap-1">
                        {stat.netVolume >= 0 ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
                        {stat.netVolume >= 0 ? '+' : ''}{formatCompactNumber(stat.netVolume)}
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={4} className="text-center h-24">
                    No symbols found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
