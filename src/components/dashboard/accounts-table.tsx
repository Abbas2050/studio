
'use client';

import { useState, useMemo } from 'react';
import type { Account } from '@/lib/types';
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

type AccountsTableProps = {
  loading: boolean;
  data: Account[];
};

const formatCurrency = (value: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value);

const getColor = (value: number) => (value >= 0 ? 'text-green-400' : 'text-red-400');

export function AccountsTable({ loading, data }: AccountsTableProps) {
  const [search, setSearch] = useState('');

  const filteredAccounts = useMemo(() => {
    if (!data) return [];
    return data.filter(account =>
      account.login.toString().includes(search.toLowerCase())
    );
  }, [data, search]);

  const renderSkeleton = (key: number) => (
    <TableRow key={key}>
      {Array.from({ length: 10 }).map((_, i) => (
        <TableCell key={i}><Skeleton className="h-5 w-full" /></TableCell>
      ))}
    </TableRow>
  );

  return (
    <Card className="bg-card/80 backdrop-blur-sm border-border/50 shadow-lg shadow-primary/5">
      <CardHeader>
        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
          <div>
            <CardTitle className="font-headline text-2xl">Accounts</CardTitle>
            <CardDescription>Detailed view of all trading accounts.</CardDescription>
          </div>
          <Input
            placeholder="Search by Login ID..."
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
                <TableHead>Login</TableHead>
                <TableHead className="text-right">Balance</TableHead>
                <TableHead className="text-right">Equity</TableHead>
                <TableHead className="text-right">Margin</TableHead>
                <TableHead className="text-right">Free Margin</TableHead>
                <TableHead className="text-right">Margin Level</TableHead>
                <TableHead className="text-right">Leverage</TableHead>
                <TableHead className="text-right">Profit</TableHead>
                <TableHead className="text-right">Swap</TableHead>
                <TableHead className="text-right">Floating P/L</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => renderSkeleton(i))
              ) : filteredAccounts.length > 0 ? (
                filteredAccounts.map((acc) => (
                  <TableRow key={acc.login}>
                    <TableCell className="font-medium">{acc.login}</TableCell>
                    <TableCell className="text-right">{formatCurrency(acc.balance)}</TableCell>
                    <TableCell className="text-right font-semibold">{formatCurrency(acc.equity)}</TableCell>
                    <TableCell className="text-right">{formatCurrency(acc.margin)}</TableCell>
                    <TableCell className="text-right">{formatCurrency(acc.freeMargin)}</TableCell>
                    <TableCell className="text-right">
                        <Badge variant={acc.marginLevel < 200 ? 'destructive' : 'default'} className={cn(acc.marginLevel < 500 && acc.marginLevel >=200 && 'bg-yellow-500/80')}>
                            {acc.marginLevel.toFixed(2)}%
                        </Badge>
                    </TableCell>
                    <TableCell className="text-right">1:{acc.leverage}</TableCell>
                    <TableCell className={cn("text-right", getColor(acc.profit))}>{formatCurrency(acc.profit)}</TableCell>
                    <TableCell className={cn("text-right", getColor(acc.swap))}>{formatCurrency(acc.swap)}</TableCell>
                    <TableCell className={cn("text-right font-bold", getColor(acc.floatingPnl))}>{formatCurrency(acc.floatingPnl)}</TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={10} className="text-center">
                    No accounts found.
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
