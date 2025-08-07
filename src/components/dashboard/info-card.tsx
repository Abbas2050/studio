
'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
import type { LucideIcon } from 'lucide-react';

type InfoCardProps = {
  title: string;
  value?: number;
  icon: LucideIcon;
  loading: boolean;
};

const formatCurrency = (value: number) => {
    if (value === undefined || value === null) return '$0.00';
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value);
};

export function InfoCard({ title, value, icon: Icon, loading }: InfoCardProps) {
  if (loading) {
    return (
      <Card className="bg-card/50">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            <Skeleton className="h-4 w-32" />
          </CardTitle>
          <Skeleton className="h-6 w-6" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-8 w-40" />
        </CardContent>
      </Card>
    );
  }
  
  const isNegative = value !== undefined && value < 0;

  return (
    <Card className="bg-card/80 backdrop-blur-sm border-border/50 shadow-lg shadow-primary/5 hover:border-primary/50">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
        <Icon className="h-5 w-5 text-primary" />
      </CardHeader>
      <CardContent>
        <div className={cn("text-2xl font-bold font-headline", isNegative ? "text-red-400" : "text-foreground")}>
            {formatCurrency(value ?? 0)}
        </div>
      </CardContent>
    </Card>
  );
}
