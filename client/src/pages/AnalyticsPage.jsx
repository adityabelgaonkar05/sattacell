import { useParams, Link } from "react-router-dom";
import { MarketAnalytics } from "@/components/markets/MarketAnalytics";
import { useMarket } from "@/hooks/useMarkets";
import { Button } from "@/components/ui/button";
import { ArrowLeft, BarChart3 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/Skeleton";

export function AnalyticsPage() {
    const { id } = useParams();
    const { market, loading, error } = useMarket(id);

    if (loading) {
        return (
            <div className="space-y-4">
                <Skeleton className="h-10 w-48" />
                <Skeleton className="h-[400px] w-full" />
            </div>
        );
    }

    if (error) {
        return (
            <Card className="border-destructive/50">
                <CardContent className="p-8 text-center">
                    <div className="text-destructive font-mono">[ERROR] {error}</div>
                </CardContent>
            </Card>
        );
    }

    if (!market) {
        return (
            <Card>
                <CardContent className="p-8 text-center text-muted-foreground">
                    Market not found
                </CardContent>
            </Card>
        );
    }

    return (
        <div className="space-y-6">
            {/* Navigation */}
            <div className="flex items-center justify-between">
                <Link to={`/markets/${id}`}>
                    <Button variant="ghost" className="gap-2 text-muted-foreground hover:text-primary">
                        <ArrowLeft className="h-4 w-4" />
                        Back to Market
                    </Button>
                </Link>
            </div>

            {/* Header */}
            <div className="flex items-center gap-3">
                <BarChart3 className="h-6 w-6 text-primary" />
                <div>
                    <h1 className="text-2xl font-display font-bold text-primary">Market Analytics</h1>
                    <p className="text-muted-foreground font-mono text-sm truncate max-w-md">
                        {market.title}
                    </p>
                </div>
            </div>

            {/* Analytics Component */}
            <MarketAnalytics marketId={id} outcomes={market.outcomes} />
        </div>
    );
}
