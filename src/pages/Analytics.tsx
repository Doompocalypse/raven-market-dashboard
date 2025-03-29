
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import FactionLeaderboard from "@/components/FactionLeaderboard";
import LiveStats from "@/components/LiveStats";
import Navbar from "@/components/Navbar";

const Analytics = () => {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <main className="flex-grow container py-8 px-4 max-w-screen-xl">
        <div className="grid gap-6">
          <Card className="border-none bg-gradient-to-r from-primary/5 to-accent/5">
            <CardHeader className="pb-3">
              <CardTitle className="text-3xl">Analytics</CardTitle>
              <CardDescription className="text-lg">
                Real-time statistics for Raven DMM
              </CardDescription>
            </CardHeader>
          </Card>

          <LiveStats />
          
          <Card>
            <CardHeader>
              <CardTitle>Market Overview</CardTitle>
              <CardDescription>Coming soon - detailed market analytics</CardDescription>
            </CardHeader>
            <CardContent className="flex justify-center items-center py-20">
              <div className="text-center text-muted-foreground">
                Advanced analytics features will be available soon
              </div>
            </CardContent>
          </Card>

          <FactionLeaderboard />
        </div>
      </main>

      <footer className="border-t border-border/40 py-6 px-4">
        <div className="container max-w-screen-xl text-center text-sm text-muted-foreground">
          © {new Date().getFullYear()} Raven DMM. All rights reserved.
        </div>
      </footer>
    </div>
  );
};

export default Analytics;
