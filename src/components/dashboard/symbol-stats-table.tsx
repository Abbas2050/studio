
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
import { cn } from '@/lib/utils';
import { Badge } from '../ui/badge';
import { TrendingUp, TrendingDown } from 'lucide-react';

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
    <TableRow key={key}>
      {Array.from({ length: 4 }).map((_, i) => (
        <TableCell key={i}><Skeleton className="h-5 w-full" /></TableCell>
      ))}
    </TableRow>
  );

  return (
    <Card className="bg-card/80 backdrop-blur-sm border-border/50 shadow-lg shadow-primary/5">
      <CardHeader>
        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
          <div>
            <CardTitle className="font-headline text-2xl">Market Watch</CardTitle>
            <CardDescription>Volume analysis for symbols.</CardDescription>
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
                <TableHead>Symbol</TableHead>
                <TableHead className="text-right">Buy Volume</TableHead>
                <TableHead className="text-right">Sell Volume</TableHead>
                <TableHead className="text-right">Net Volume</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => renderSkeleton(i))
              ) : filteredData.length > 0 ? (
                filteredData.map((stat) => (
                  <TableRow key={stat.symbol}>
                    <TableCell>
                      <div className="font-medium">{stat.symbol}</div>
                      <div className="text-xs text-muted-foreground">{stat.name}</div>
                    </TableCell>
                    <TableCell className="text-right text-green-400">{stat.buyVolume.toFixed(2)}</TableCell>
                    <TableCell className="text-right text-red-400">{stat.sellVolume.toFixed(2)}</TableCell>
                    <TableCell className={cn("text-right font-semibold", stat.netVolume >= 0 ? 'text-green-400' : 'text-red-400')}>
                      <div className="flex items-center justify-end gap-1">
                        {stat.netVolume >= 0 ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
                        {stat.netVolume.toFixed(2)}
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={4} className="text-center">
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
