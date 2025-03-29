import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer } from "recharts";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useTokenPriceData } from "@/hooks/useTokenPriceData";
import { TrendingUp, TrendingDown, RefreshCw } from "lucide-react";
import { format } from "date-fns";

interface PriceChartProps {
  tokenSymbol: string;
  onRefresh?: () => void;
  className?: string;
}

const PriceChart = ({ tokenSymbol, onRefresh, className = "" }: PriceChartProps) => {
  const { data: tokenData, isLoading, isError, refetch } = useTokenPriceData(tokenSymbol);
  const [timeRange, setTimeRange] = useState<"24h" | "7d" | "30d" | "all">("7d");
  
  const handleRefresh = () => {
    refetch();
    if (onRefresh) onRefresh();
  };
  
  const formatChartData = (data = tokenData?.priceHistory) => {
    if (!data || data.length === 0) return [];
    
    let filteredData = [...data];
    
    if (timeRange === "24h") {
      filteredData = filteredData.slice(-24);
    } else if (timeRange === "7d") {
      filteredData = filteredData.slice(-7);
    } else if (timeRange === "30d") {
      // Use all data as we're already getting 30 days
    }
    
    return filteredData.map(point => ({
      date: new Date(point.timestamp),
      formattedDate: format(new Date(point.timestamp), 'MMM d'),
      value: point.price,
    }));
  };
  
  const chartData = formatChartData();
  
  const getPercentChangeColor = (change: number | undefined) => {
    if (!change) return "text-muted-foreground";
    return change >= 0 ? "text-green-500" : "text-red-500";
  };
  
  const formatCurrency = (value: number | undefined) => {
    if (value === undefined) return "$0.00";
    return new Intl.NumberFormat('en-US', { 
      style: 'currency', 
      currency: 'USD',
      minimumFractionDigits: value < 1 ? 4 : 2,
      maximumFractionDigits: value < 1 ? 4 : 2
    }).format(value);
  };
  
  const formatLargeNumber = (value: number | undefined) => {
    if (value === undefined) return "$0";
    if (value >= 1_000_000_000) {
      return `$${(value / 1_000_000_000).toFixed(2)}B`;
    }
    if (value >= 1_000_000) {
      return `$${(value / 1_000_000).toFixed(2)}M`;
    }
    return formatCurrency(value);
  };
  
  if (isLoading) {
    return (
      <Card className={className}>
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center justify-between">
            <Skeleton className="h-6 w-24" />
            <Skeleton className="h-6 w-16" />
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[200px] mt-4">
            <Skeleton className="h-full w-full" />
          </div>
        </CardContent>
      </Card>
    );
  }
  
  if (isError || !tokenData) {
    return (
      <Card className={className}>
        <CardHeader className="pb-2">
          <CardTitle>Price Chart Error</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center h-[200px] gap-4">
            <p className="text-muted-foreground">Failed to load price data</p>
            <button 
              onClick={handleRefresh}
              className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-md"
            >
              <RefreshCw className="h-4 w-4" /> Try Again
            </button>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  const isPositiveChange = tokenData.percentChange24h >= 0;
  
  return (
    <Card className={className}>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            {tokenData.symbol} - {tokenData.name}
            <Badge className={getPercentChangeColor(tokenData.percentChange24h)} variant="outline">
              <span className="flex items-center gap-1">
                {isPositiveChange ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                {Math.abs(tokenData.percentChange24h).toFixed(2)}%
              </span>
            </Badge>
          </CardTitle>
          <div className="font-mono font-bold text-lg">
            {formatCurrency(tokenData.currentPrice)}
          </div>
        </div>
        <div className="flex justify-between items-center text-xs text-muted-foreground mt-1">
          <div>Vol: {formatLargeNumber(tokenData.volume24h)}</div>
          <div>MCap: {formatLargeNumber(tokenData.marketCap)}</div>
        </div>
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={{
            price: {
              color: isPositiveChange ? "#22c55e" : "#ef4444",
            },
          }}
          className="h-[200px]"
        >
          <LineChart data={chartData}>
            <XAxis 
              dataKey="formattedDate"
              tick={{ fontSize: 12 }}
              axisLine={false}
              tickLine={false}
              padding={{ left: 10, right: 10 }}
              minTickGap={20}
            />
            <YAxis 
              domain={["dataMin - 1", "dataMax + 1"]}
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12 }}
              tickFormatter={(value) => {
                if (typeof value === 'number') {
                  return tokenData.currentPrice < 1 ? value.toFixed(3) : value.toFixed(0);
                }
                return value;
              }}
              width={40}
            />
            <ChartTooltip
              content={
                <ChartTooltipContent
                  labelClassName="font-mono"
                  labelFormatter={(label) => {
                    if (typeof label === "object" && label instanceof Date) {
                      return format(label, "MMM d, yyyy");
                    }
                    return String(label);
                  }}
                  formatter={(value) => {
                    if (typeof value === 'number') {
                      return [`$${value.toFixed(tokenData.currentPrice < 1 ? 4 : 2)}`, "Price"];
                    }
                    return [`${value}`, "Price"];
                  }}
                />
              }
            />
            <Line
              type="monotone"
              dataKey="value"
              name="price"
              stroke="var(--color-price)"
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 4, stroke: "var(--color-price)", strokeWidth: 2, fill: "var(--background)" }}
            />
          </LineChart>
        </ChartContainer>
        
        <div className="flex justify-between items-center mt-4">
          <ToggleGroup type="single" value={timeRange} onValueChange={(value) => value && setTimeRange(value as any)}>
            <ToggleGroupItem value="24h" size="sm">24H</ToggleGroupItem>
            <ToggleGroupItem value="7d" size="sm">7D</ToggleGroupItem>
            <ToggleGroupItem value="30d" size="sm">30D</ToggleGroupItem>
          </ToggleGroup>
          
          <button 
            onClick={handleRefresh} 
            className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground"
          >
            <RefreshCw className="h-3 w-3" /> Refresh
          </button>
        </div>
      </CardContent>
    </Card>
  );
};

export default PriceChart;
