
'use client';

import { useState, useEffect } from 'react';
import { Modal } from '@/components/ui/modal';
import { Skeleton } from '@/components/ui/skeleton';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { cn } from '@/lib/utils';
import { formatCompactNumber } from '@/lib/utils';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface SymbolDetailPopupProps {
  symbol: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface SubSymbolStat {
    symbol: string;
    buyVolume: number;
    sellVolume: number;
    netVolume: number;
}

export function SymbolDetailPopup({ symbol, open, onOpenChange }: SymbolDetailPopupProps) {
  const [subStats, setSubStats] = useState<SubSymbolStat[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (open) {
      setLoading(true);
      setError(null);
      fetch(`/api/symbol-details/${symbol}`)
        .then(res => {
          if (!res.ok) {
            throw new Error('Failed to fetch symbol details');
          }
          return res.json();
        })
        .then((data: SubSymbolStat[]) => {
          setSubStats(data);
        })
        .catch(err => {
          setError(err.message);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [open, symbol]);
  
  return (
    <Modal
      title={`Sub-Symbol Details for: ${symbol}`}
      open={open}
      onOpenChange={onOpenChange}
    >
      {loading ? (
         <div className="space-y-2">
           <Skeleton className="h-8 w-full" />
           <Skeleton className="h-8 w-full" />
           <Skeleton className="h-8 w-full" />
         </div>
      ) : error ? (
        <div className="text-red-500">{error}</div>
      ) : subStats.length === 0 ? (
        <p>No sub-symbols found.</p>
      ) : (
        <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Sub-Symbol</TableHead>
              <TableHead className="text-right">Buy Volume</TableHead>
              <TableHead className="text-right">Sell Volume</TableHead>
              <TableHead className="text-right">Net Volume</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {subStats.map((stat) => (
              <TableRow key={stat.symbol}>
                <TableCell className="font-medium">{stat.symbol}</TableCell>
                <TableCell className="text-right text-green-400">{formatCompactNumber(stat.buyVolume)}</TableCell>
                <TableCell className="text-right text-red-400">{formatCompactNumber(stat.sellVolume)}</TableCell>
                <TableCell className={cn("text-right font-semibold", stat.netVolume >= 0 ? 'text-green-400' : 'text-red-400')}>
                  <div className="flex items-center justify-end gap-1">
                    {stat.netVolume >= 0 ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
                    {stat.netVolume >= 0 ? '+' : ''}{formatCompactNumber(stat.netVolume)}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        </div>
      )}
    </Modal>
  );
}

