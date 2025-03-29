
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import LiveStats from "@/components/LiveStats";
import Navbar from "@/components/Navbar";
import StakingDashboard from "@/components/StakingDashboard";
import FactionLeaderboard from "@/components/FactionLeaderboard";
import { connectSocket, disconnectSocket } from "@/services/api";
import { useEffect } from "react";
import { Wallet, BarChart2, TrendingUp, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const Index = () => {
  // Connect to Socket.io when the component mounts
  useEffect(() => {
    connectSocket();
    
    // Disconnect when the component unmounts
    return () => {
      disconnectSocket();
    };
  }, []);

  const quickActions = [
    {
      title: "Stake LP Tokens",
      description: "Earn rewards by staking your liquidity",
      icon: <Wallet className="h-8 w-8 text-primary" />,
      link: "#staking"
    },
    {
      title: "View Analytics",
      description: "See market performance and trends",
      icon: <BarChart2 className="h-8 w-8 text-accent" />,
      link: "/analytics"
    },
    {
      title: "Swap Tokens",
      description: "Exchange assets with low fees",
      icon: <TrendingUp className="h-8 w-8 text-green-500" />,
      link: "/swap"
    },
    {
      title: "Governance",
      description: "Vote on protocol proposals",
      icon: <Shield className="h-8 w-8 text-blue-500" />,
      link: "/governance"
    }
  ];

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <main className="flex-grow container py-8 px-4 max-w-screen-xl">
        <div className="grid gap-8">
          {/* Welcome Card */}
          <Card className="border-none bg-gradient-to-r from-primary/10 to-accent/10">
            <CardHeader className="pb-3">
              <CardTitle className="text-3xl">Welcome to Raven DMM</CardTitle>
              <CardDescription className="text-lg">
                Decentralized Market Making on Solana
              </CardDescription>
            </CardHeader>
            <CardContent className="pb-6">
              <p className="text-muted-foreground mb-4">
                Provide liquidity, earn rewards, and participate in governance
              </p>
              <div className="flex space-x-4">
                <Button asChild>
                  <Link to="/swap">Start Trading</Link>
                </Button>
                <Button variant="outline" asChild>
                  <Link to="#staking">Stake Now</Link>
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
            {quickActions.map((action, i) => (
              <Link to={action.link} key={i}>
                <Card className="h-full hover:bg-accent/5 transition-colors cursor-pointer border-2 border-transparent hover:border-accent/20">
                  <CardHeader>
                    <div className="mb-2">{action.icon}</div>
                    <CardTitle>{action.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription>{action.description}</CardDescription>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>

          {/* Stats Section */}
          <LiveStats />

          {/* Main Dashboard Content */}
          <div id="staking" className="pt-6">
            <StakingDashboard />
          </div>
          
          <div className="pt-6">
            <FactionLeaderboard />
          </div>
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

export default Index;
