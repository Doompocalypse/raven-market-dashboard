
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Navbar from "@/components/Navbar";
import { useWalletContext } from "@/contexts/WalletContext";
import { useToast } from "@/hooks/use-toast";
import { Loader2, ChevronDown, RefreshCw } from "lucide-react";
import PriceChart from "@/components/PriceChart";

const Swap = () => {
  const { connected } = useWalletContext();
  const [fromToken, setFromToken] = useState("SOL");
  const [toToken, setToToken] = useState("USDC");
  const [fromAmount, setFromAmount] = useState("");
  const [toAmount, setToAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const tokens = [
    { symbol: "SOL", name: "Solana" },
    { symbol: "USDC", name: "USD Coin" },
    { symbol: "DMC", name: "DOOMCOIN" }, // Updated name here
  ];

  const handleSwap = () => {
    if (!connected) {
      toast({
        title: "Wallet not connected",
        description: "Please connect your wallet to swap tokens.",
        variant: "destructive",
      });
      return;
    }

    if (!fromAmount || isNaN(Number(fromAmount)) || Number(fromAmount) <= 0) {
      toast({
        title: "Invalid amount",
        description: "Please enter a valid amount to swap.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      toast({
        title: "Swap Successful",
        description: `Swapped ${fromAmount} ${fromToken} for ${toAmount} ${toToken}`,
      });
      setFromAmount("");
      setToAmount("");
      setLoading(false);
    }, 2000);
  };

  const handleFromAmountChange = (value: string) => {
    setFromAmount(value);
    // Simple price calculation - for demo only
    if (value && !isNaN(Number(value))) {
      let rate = 1;
      if (fromToken === "SOL" && toToken === "USDC") rate = 125;
      if (fromToken === "SOL" && toToken === "DMC") rate = 500;
      if (fromToken === "USDC" && toToken === "SOL") rate = 0.008;
      if (fromToken === "USDC" && toToken === "DMC") rate = 4;
      if (fromToken === "DMC" && toToken === "SOL") rate = 0.002;
      if (fromToken === "DMC" && toToken === "USDC") rate = 0.25;
      
      setToAmount((Number(value) * rate).toFixed(6));
    } else {
      setToAmount("");
    }
  };

  const switchTokens = () => {
    setFromToken(toToken);
    setToToken(fromToken);
    setFromAmount(toAmount);
    setToAmount(fromAmount);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <main className="flex-grow container py-8 px-4 max-w-screen-xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Price Chart Section */}
          <div className="space-y-6">
            <h2 className="text-2xl font-bold">Market Data</h2>
            <div className="space-y-6">
              <PriceChart tokenSymbol={fromToken} />
            </div>
          </div>
          
          {/* Swap Interface */}
          <div className="flex justify-center">
            <Card className="w-full max-w-md">
              <CardHeader className="pb-3">
                <CardTitle>Swap Tokens</CardTitle>
                <CardDescription>Exchange tokens with Raven DMM</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <div className="text-sm font-medium">From</div>
                      <div className="text-xs text-muted-foreground">
                        {connected ? "Balance: 0.00" : "Connect wallet to see balance"}
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <div className="flex-1 flex items-center rounded-md border border-input bg-background">
                        <Input
                          className="border-0 flex-1"
                          placeholder="0.0"
                          value={fromAmount}
                          onChange={(e) => handleFromAmountChange(e.target.value)}
                          type="number"
                          min="0"
                          step="0.000001"
                        />
                        <Select value={fromToken} onValueChange={setFromToken}>
                          <SelectTrigger className="w-[120px] border-0 focus:ring-0">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {tokens.filter(t => t.symbol !== toToken).map(token => (
                              <SelectItem key={token.symbol} value={token.symbol}>
                                {token.symbol} - {token.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-center">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={switchTokens}
                      className="h-8 w-8 rounded-full bg-muted"
                    >
                      <RefreshCw className="h-4 w-4" />
                    </Button>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <div className="text-sm font-medium">To</div>
                      <div className="text-xs text-muted-foreground">
                        {connected ? "Balance: 0.00" : "Connect wallet to see balance"}
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <div className="flex-1 flex items-center rounded-md border border-input bg-background">
                        <Input
                          className="border-0 flex-1"
                          placeholder="0.0"
                          value={toAmount}
                          readOnly
                        />
                        <Select value={toToken} onValueChange={setToToken}>
                          <SelectTrigger className="w-[120px] border-0 focus:ring-0">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {tokens.filter(t => t.symbol !== fromToken).map(token => (
                              <SelectItem key={token.symbol} value={token.symbol}>
                                {token.symbol} - {token.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>

                  <div className="py-1 px-2 rounded-md bg-accent/10 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Rate</span>
                      <span>
                        1 {fromToken} = {fromToken === toToken ? "1" : fromToken === "SOL" && toToken === "USDC" ? "125" : 
                        fromToken === "SOL" && toToken === "DMC" ? "500" : 
                        fromToken === "USDC" && toToken === "SOL" ? "0.008" : 
                        fromToken === "USDC" && toToken === "DMC" ? "4" : 
                        fromToken === "DMC" && toToken === "SOL" ? "0.002" : "0.25"} {toToken}
                      </span>
                    </div>
                  </div>

                  <Button
                    className="w-full"
                    onClick={handleSwap}
                    disabled={loading || !connected || !fromAmount}
                  >
                    {loading ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : null}
                    {!connected ? "Connect Wallet to Swap" : "Swap"}
                  </Button>
                </div>
              </CardContent>
            </Card>
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

export default Swap;
