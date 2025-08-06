
'use client';
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
import type { Trade } from '@/lib/types';
import { ArrowUpRight, ArrowDownLeft } from 'lucide-react';

const generateMockTrades = (): Trade[] => {
    const symbols = ['BTCUSD', 'ETHUSD', 'NVDA', 'TSLA', 'EURUSD', 'XAUUSD'];
    return Array.from({ length: 20 }, (_, i) => {
        const symbol = symbols[Math.floor(Math.random() * symbols.length)];
        const type = Math.random() > 0.5 ? 'BUY' : 'SELL';
        return {
            id: `trade-${i}-${Date.now()}`,
            symbol,
            type,
            volume: Math.random() * 5,
            price: 1000 + Math.random() * 50000,
            time: new Date(Date.now() - Math.random() * 1000 * 60 * 60 * 24).toLocaleTimeString(),
        };
    });
};

export function RecentTrades() {
    const [trades, setTrades] = useState<Trade[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setTrades(generateMockTrades());
        setLoading(false);
    }, []);

    if (loading) {
      return (
        <Card className="h-full bg-card/80 backdrop-blur-sm border-border/50 shadow-lg shadow-primary/5">
            <CardHeader>
                <CardTitle className="font-headline text-2xl">Recent Activity</CardTitle>
                <CardDescription>Live feed of recent trades.</CardDescription>
            </CardHeader>
            <CardContent>
                <ScrollArea className="h-[600px] pr-4">
                    <div className="space-y-4">
                        {Array.from({length: 10}).map((_, i) => (
                             <div key={i} className="flex items-center space-x-4">
                                <Skeleton className="h-10 w-10 rounded-full" />
                                <div className="space-y-2 flex-1">
                                    <Skeleton className="h-4 w-3/4" />
                                    <Skeleton className="h-4 w-1/2" />
                                </div>
                            </div>
                        ))}
                    </div>
                </ScrollArea>
            </CardContent>
        </Card>
      );
    }

    return (
        <Card className="h-full bg-card/80 backdrop-blur-sm border-border/50 shadow-lg shadow-primary/5">
            <CardHeader>
                <CardTitle className="font-headline text-2xl">Recent Activity</CardTitle>
                <CardDescription>Live feed of recent trades.</CardDescription>
            </CardHeader>
            <CardContent>
                <ScrollArea className="h-[600px] pr-4">
                    <div className="space-y-4">
                        {trades.map((trade) => (
                            <div key={trade.id} className="flex items-center">
                                <div className="p-2 mr-3 rounded-full bg-secondary">
                                    {trade.type === 'BUY' ? (
                                        <ArrowUpRight className="h-5 w-5 text-green-400" />
                                    ) : (
                                        <ArrowDownLeft className="h-5 w-5 text-red-400" />
                                    )}
                                </div>
                                <div className="flex-grow">
                                    <p className="font-semibold">{trade.symbol} <span className={cn("font-normal", trade.type === 'BUY' ? 'text-green-400' : 'text-red-400')}>{trade.type}</span></p>
                                    <p className="text-sm text-muted-foreground">
                                        {trade.volume.toFixed(2)} lots at {trade.price.toFixed(2)}
                                    </p>
                                </div>
                                <div className="text-right">
                                    <p className="text-sm font-medium">{trade.time}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </ScrollArea>
            </CardContent>
        </Card>
    );
}
