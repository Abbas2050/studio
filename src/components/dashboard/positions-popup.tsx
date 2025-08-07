
'use client';

import { useState, useEffect } from 'react';
import { Modal } from '@/components/ui/modal';
import { Skeleton } from '@/components/ui/skeleton';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import type { Position } from '@/lib/types';
import { Badge } from '../ui/badge';
import { cn } from '@/lib/utils';

interface PositionsPopupProps {
  login: number;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function PositionsPopup({ login, open, onOpenChange }: PositionsPopupProps) {
  const [positions, setPositions] = useState<Position[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (open) {
      setLoading(true);
      setError(null);
      fetch(`/api/positions/${login}`)
        .then(res => {
          if (!res.ok) {
            throw new Error('Failed to fetch positions');
          }
          return res.json();
        })
        .then((data: Position[]) => {
          setPositions(data);
        })
        .catch(err => {
          setError(err.message);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [open, login]);

  const formatCurrency = (value: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value);
  
  return (
    <Modal
      title={`Positions for Account: ${login}`}
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
      ) : positions.length === 0 ? (
        <p>No open positions found for this account.</p>
      ) : (
        <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Symbol</TableHead>
              <TableHead>Action</TableHead>
              <TableHead className="text-right">Volume</TableHead>
              <TableHead className="text-right">Open Price</TableHead>
              <TableHead>Open Time</TableHead>
              <TableHead className="text-right">Profit</TableHead>
              <TableHead className="text-right">Swap</TableHead>
              <TableHead className="text-right">Commission</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {positions.map((pos, index) => (
              <TableRow key={index}>
                <TableCell>{pos.symbol}</TableCell>
                <TableCell>
                  <Badge variant={pos.action === 0 ? 'default' : 'destructive'} className={cn(pos.action === 0 ? 'bg-green-500/80' : 'bg-red-500/80')}>
                    {pos.action === 0 ? 'BUY' : 'SELL'}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">{(pos.volume / 10000).toFixed(2)}</TableCell>
                <TableCell className="text-right">{typeof pos.openPrice === 'number' ? pos.openPrice.toFixed(5) : 'N/A'}</TableCell>
                <TableCell>{new Date(pos.openTime).toLocaleString()}</TableCell>
                <TableCell className={cn("text-right", pos.profit >= 0 ? 'text-green-400' : 'text-red-400')}>{formatCurrency(pos.profit)}</TableCell>
                <TableCell className={cn("text-right", pos.swap >= 0 ? 'text-green-400' : 'text-red-400')}>{formatCurrency(pos.swap)}</TableCell>
                <TableCell className="text-right">{formatCurrency(pos.commission)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        </div>
      )}
    </Modal>
  );
}
