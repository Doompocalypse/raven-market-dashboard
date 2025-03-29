
import { useState, useEffect } from "react";
import { getStats, StatsData } from "@/services/api";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2 } from "lucide-react";

const LiveStats = () => {
  const [stats, setStats] = useState<StatsData | null>(null);
  const [loading, setLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const { toast } = useToast();

  const fetchStats = async () => {
    setLoading(true);
    try {
      const data = await getStats();
      setStats(data);
      setLastUpdated(new Date());
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch stats data.",
        variant: "destructive",
      });
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();

    // Update every 30 seconds
    const interval = setInterval(fetchStats, 30000);
    
    return () => clearInterval(interval);
  }, []);

  const formatCurrency = (value: number) => {
    if (value >= 1000000) {
      return `$${(value / 1000000).toFixed(2)}M`;
    } else if (value >= 1000) {
      return `$${(value / 1000).toFixed(2)}K`;
    } else {
      return `$${value.toFixed(2)}`;
    }
  };

  const formatNumber = (value: number) => {
    if (value >= 1000000) {
      return `${(value / 1000000).toFixed(2)}M`;
    } else if (value >= 1000) {
      return `${(value / 1000).toFixed(2)}K`;
    } else {
      return value.toString();
    }
  };

  return (
    <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <StatsCard
        title="Total Swap Volume"
        value={stats ? formatCurrency(stats.totalSwapVolume) : "-"}
        loading={loading}
      />
      <StatsCard
        title="Total Fees Collected"
        value={stats ? formatCurrency(stats.totalFeesCollected) : "-"}
        loading={loading}
      />
      <StatsCard
        title="Active Users (24h)"
        value={stats ? formatNumber(stats.activeUsers24h) : "-"}
        loading={loading}
      />
      <StatsCard
        title="Total Value Locked"
        value={stats ? formatCurrency(stats.tvl) : "-"}
        loading={loading}
      />
    </div>
  );
};

interface StatsCardProps {
  title: string;
  value: string;
  loading: boolean;
}

const StatsCard = ({ title, value, loading }: StatsCardProps) => {
  return (
    <Card className="stats-card">
      <CardContent className="pt-6">
        <div className="text-sm text-muted-foreground mb-1">{title}</div>
        {loading ? (
          <div className="flex items-center h-8">
            <Loader2 className="animate-spin h-5 w-5" />
          </div>
        ) : (
          <div className="text-2xl font-bold">{value}</div>
        )}
      </CardContent>
    </Card>
  );
};

export default LiveStats;
