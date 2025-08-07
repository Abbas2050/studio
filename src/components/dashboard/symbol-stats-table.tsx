
'use client';

import { useState, useMemo, useEffect } from 'react';
import type { SymbolStat } from '@/lib/types';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { cn, formatCompactNumber } from '@/lib/utils';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { Progress } from '../ui/progress';
import { SymbolDetailPopup } from './symbol-detail-popup';
import { PaginationControls } from './pagination-controls';

type SymbolStatsTableProps = {
  data: SymbolStat[];
  loading: boolean;
};

const ROWS_PER_PAGE = 15;

export function SymbolStatsTable({ data, loading }: SymbolStatsTableProps) {
  const [search, setSearch] = useState('');
  const [selectedSymbol, setSelectedSymbol] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  const filteredData = useMemo(() => {
    return data.filter(stat =>
      stat.symbol.toLowerCase().includes(search.toLowerCase()) ||
      stat.name.toLowerCase().includes(search.toLowerCase())
    );
  }, [data, search]);
  
  useEffect(() => {
      setCurrentPage(1);
  }, [search]);
  
  const totalPages = Math.ceil(filteredData.length / ROWS_PER_PAGE);
  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * ROWS_PER_PAGE;
    return filteredData.slice(startIndex, startIndex + ROWS_PER_PAGE);
  }, [filteredData, currentPage]);


  const handleSymbolClick = (symbol: SymbolStat) => {
    if (symbol.isGroup) {
      setSelectedSymbol(symbol.symbol);
    }
  };

  const renderSkeleton = (key: number) => (
    <TableRow key={key}>
      {Array.from({ length: 4 }).map((_, i) => (
        <TableCell key={i}><Skeleton className="h-5 w-full" /></TableCell>
      ))}
    </TableRow>
  );
  
  return (
    <>
      <Card className="bg-card/80 backdrop-blur-sm border-border/50 shadow-lg shadow-primary/5 transition-all duration-300 hover:shadow-primary/10 flex flex-col">
        <CardHeader>
          <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
            <div>
              <CardTitle className="font-headline text-2xl">Market Watch</CardTitle>
              <CardDescription>Real-time trading volume data</CardDescription>
            </div>
            <Input
              placeholder="Search Symbol..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="max-w-xs bg-secondary/50"
            />
          </div>
        </CardHeader>
        <CardContent className="flex-grow">
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
                  Array.from({ length: 8 }).map((_, i) => renderSkeleton(i))
                ) : paginatedData.length > 0 ? (
                  paginatedData.map((stat) => (
                    <TableRow key={stat.symbol} className="transition-colors hover:bg-secondary/30" onClick={() => handleSymbolClick(stat)}>
                      <TableCell>
                        <div className={cn("font-medium", stat.isGroup ? "text-primary/90 cursor-pointer hover:underline" : "text-foreground")}>{stat.symbol}</div>
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
        <CardFooter>
            <PaginationControls
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
            />
        </CardFooter>
      </Card>
      {selectedSymbol && (
        <SymbolDetailPopup
          symbol={selectedSymbol}
          open={!!selectedSymbol}
          onOpenChange={(isOpen) => !isOpen && setSelectedSymbol(null)}
        />
      )}
    </>
  );
}
