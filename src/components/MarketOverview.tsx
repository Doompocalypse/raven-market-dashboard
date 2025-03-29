
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import PriceChart from "@/components/PriceChart";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const MarketOverview = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Market Overview</CardTitle>
        <CardDescription>Real-time token price data</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="sol" className="space-y-4">
          <TabsList className="grid grid-cols-3 w-full">
            <TabsTrigger value="sol">SOL</TabsTrigger>
            <TabsTrigger value="usdc">USDC</TabsTrigger>
            <TabsTrigger value="dmc">DMC</TabsTrigger>
          </TabsList>
          <TabsContent value="sol" className="mt-2 space-y-4">
            <PriceChart tokenSymbol="SOL" className="h-full" />
          </TabsContent>
          <TabsContent value="usdc" className="mt-2 space-y-4">
            <PriceChart tokenSymbol="USDC" className="h-full" />
          </TabsContent>
          <TabsContent value="dmc" className="mt-2 space-y-4">
            <PriceChart tokenSymbol="DMC" className="h-full" />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default MarketOverview;
