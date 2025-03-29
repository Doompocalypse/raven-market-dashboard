
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Navbar from "@/components/Navbar";
import { useWalletContext } from "@/contexts/WalletContext";
import { useToast } from "@/hooks/use-toast";
import { 
  ArrowDown, 
  Plus, 
  Minus, 
  Settings,
  Info,
  TrendingUp,
  Percent
} from "lucide-react";
import { Separator } from "@/components/ui/separator";

const Liquidity = () => {
  const { connected } = useWalletContext();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("add");
  const [token1, setToken1] = useState("SOL");
  const [token2, setToken2] = useState("USDC");
  const [amount1, setAmount1] = useState("");
  const [amount2, setAmount2] = useState("");
  const [loading, setLoading] = useState(false);
  const [slippage, setSlippage] = useState("0.5");
  const [showSettings, setShowSettings] = useState(false);

  const tokens = [
    { symbol: "SOL", name: "Solana", balance: "1.25" },
    { symbol: "USDC", name: "USD Coin", balance: "156.45" },
    { symbol: "DMC", name: "Raven DMC", balance: "500.00" },
  ];

  const myPositions = [
    { 
      id: "pos1", 
      token0: "SOL", 
      token1: "USDC", 
      amountToken0: 0.5, 
      amountToken1: 62.5,
      apr: 12.5,
      value: 125,
      createdAt: new Date().toLocaleDateString()
    },
    { 
      id: "pos2", 
      token0: "DMC", 
      token1: "USDC", 
      amountToken0: 100, 
      amountToken1: 25,
      apr: 38.2,
      value: 50,
      createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toLocaleDateString()
    }
  ];

  const handleAmount1Change = (value: string) => {
    setAmount1(value);
    // Simple price calculation for demo
    if (value && !isNaN(Number(value))) {
      let rate = 1;
      if (token1 === "SOL" && token2 === "USDC") rate = 125;
      if (token1 === "SOL" && token2 === "DMC") rate = 500;
      if (token1 === "USDC" && token2 === "SOL") rate = 0.008;
      if (token1 === "USDC" && token2 === "DMC") rate = 4;
      if (token1 === "DMC" && token2 === "SOL") rate = 0.002;
      if (token1 === "DMC" && token2 === "USDC") rate = 0.25;
      
      setAmount2((Number(value) * rate).toFixed(6));
    } else {
      setAmount2("");
    }
  };

  const handleAmount2Change = (value: string) => {
    setAmount2(value);
    // Reverse rate calculation
    if (value && !isNaN(Number(value))) {
      let rate = 1;
      if (token2 === "SOL" && token1 === "USDC") rate = 125;
      if (token2 === "SOL" && token1 === "DMC") rate = 500;
      if (token2 === "USDC" && token1 === "SOL") rate = 0.008;
      if (token2 === "USDC" && token1 === "DMC") rate = 4;
      if (token2 === "DMC" && token1 === "SOL") rate = 0.002;
      if (token2 === "DMC" && token1 === "USDC") rate = 0.25;
      
      setAmount1((Number(value) * rate).toFixed(6));
    } else {
      setAmount1("");
    }
  };

  const handleAddLiquidity = () => {
    if (!connected) {
      toast({
        title: "Wallet not connected",
        description: "Please connect your wallet to add liquidity.",
        variant: "destructive",
      });
      return;
    }

    if (!amount1 || !amount2 || isNaN(Number(amount1)) || isNaN(Number(amount2)) || Number(amount1) <= 0 || Number(amount2) <= 0) {
      toast({
        title: "Invalid amount",
        description: "Please enter valid amounts for both tokens.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      toast({
        title: "Liquidity Added Successfully",
        description: `Added ${amount1} ${token1} and ${amount2} ${token2} to the pool.`,
      });
      setAmount1("");
      setAmount2("");
      setLoading(false);
    }, 2000);
  };

  const handleRemoveLiquidity = (positionId: string) => {
    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      toast({
        title: "Liquidity Removed Successfully",
        description: `Removed position ${positionId}.`,
      });
      setLoading(false);
    }, 2000);
  };

  const handleSlippageChange = (value: string) => {
    if (!value || (Number(value) >= 0 && Number(value) <= 100)) {
      setSlippage(value);
    }
  };

  const getTokenBalance = (symbol: string) => {
    const token = tokens.find(t => t.symbol === symbol);
    return token ? token.balance : "0.00";
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <main className="flex-grow container py-8 px-4 max-w-screen-xl">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          <div className="lg:col-span-1">
            <Card className="w-full">
              <CardHeader className="pb-3">
                <div className="flex justify-between items-center">
                  <CardTitle>Liquidity</CardTitle>
                  <Button 
                    variant="ghost" 
                    size="icon"
                    onClick={() => setShowSettings(!showSettings)}
                  >
                    <Settings className="h-5 w-5" />
                  </Button>
                </div>
                <CardDescription>Provide liquidity to earn fees</CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                  <TabsList className="grid w-full grid-cols-2 mb-6">
                    <TabsTrigger value="add">Add</TabsTrigger>
                    <TabsTrigger value="remove">Remove</TabsTrigger>
                  </TabsList>
                  
                  {showSettings && (
                    <div className="mb-6 p-4 bg-secondary/30 rounded-md">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium">Slippage Tolerance</span>
                        <div className="flex items-center">
                          <Info className="h-4 w-4 text-muted-foreground mr-1" />
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button 
                          variant={slippage === "0.1" ? "secondary" : "outline"}
                          size="sm"
                          onClick={() => setSlippage("0.1")}
                          className="h-8"
                        >
                          0.1%
                        </Button>
                        <Button 
                          variant={slippage === "0.5" ? "secondary" : "outline"}
                          size="sm"
                          onClick={() => setSlippage("0.5")}
                          className="h-8"
                        >
                          0.5%
                        </Button>
                        <Button 
                          variant={slippage === "1.0" ? "secondary" : "outline"}
                          size="sm"
                          onClick={() => setSlippage("1.0")}
                          className="h-8"
                        >
                          1.0%
                        </Button>
                        <div className="relative flex items-center">
                          <Input
                            className="w-20 pr-6 h-8"
                            value={slippage}
                            onChange={(e) => handleSlippageChange(e.target.value)}
                          />
                          <span className="absolute right-2 text-muted-foreground">
                            %
                          </span>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  <TabsContent value="add" className="space-y-6">
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <div className="text-sm font-medium">Token 1</div>
                        <div className="text-xs text-muted-foreground">
                          Balance: {connected ? getTokenBalance(token1) : "Connect wallet"}
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <div className="flex-1 flex items-center rounded-md border border-input bg-background">
                          <Input
                            className="border-0 flex-1"
                            placeholder="0.0"
                            value={amount1}
                            onChange={(e) => handleAmount1Change(e.target.value)}
                            type="number"
                            min="0"
                            step="0.000001"
                          />
                          <Select value={token1} onValueChange={setToken1}>
                            <SelectTrigger className="w-[120px] border-0 focus:ring-0">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {tokens.filter(t => t.symbol !== token2).map(token => (
                                <SelectItem key={token.symbol} value={token.symbol}>
                                  {token.symbol} - {token.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      <div className="flex justify-between px-2">
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => handleAmount1Change(getTokenBalance(token1))}
                          className="text-xs text-primary hover:text-primary"
                          disabled={!connected}
                        >
                          Max
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => handleAmount1Change((Number(getTokenBalance(token1)) / 2).toString())}
                          className="text-xs text-primary hover:text-primary"
                          disabled={!connected}
                        >
                          Half
                        </Button>
                      </div>
                    </div>

                    <div className="flex justify-center">
                      <div className="bg-secondary w-8 h-8 rounded-full flex items-center justify-center">
                        <Plus className="h-4 w-4" />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <div className="text-sm font-medium">Token 2</div>
                        <div className="text-xs text-muted-foreground">
                          Balance: {connected ? getTokenBalance(token2) : "Connect wallet"}
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <div className="flex-1 flex items-center rounded-md border border-input bg-background">
                          <Input
                            className="border-0 flex-1"
                            placeholder="0.0"
                            value={amount2}
                            onChange={(e) => handleAmount2Change(e.target.value)}
                            type="number"
                            min="0"
                            step="0.000001"
                          />
                          <Select value={token2} onValueChange={setToken2}>
                            <SelectTrigger className="w-[120px] border-0 focus:ring-0">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {tokens.filter(t => t.symbol !== token1).map(token => (
                                <SelectItem key={token.symbol} value={token.symbol}>
                                  {token.symbol} - {token.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      <div className="flex justify-between px-2">
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => handleAmount2Change(getTokenBalance(token2))}
                          className="text-xs text-primary hover:text-primary"
                          disabled={!connected}
                        >
                          Max
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => handleAmount2Change((Number(getTokenBalance(token2)) / 2).toString())}
                          className="text-xs text-primary hover:text-primary"
                          disabled={!connected}
                        >
                          Half
                        </Button>
                      </div>
                    </div>

                    {Number(amount1) > 0 && Number(amount2) > 0 && (
                      <div className="p-3 bg-secondary/30 rounded-lg space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Rate</span>
                          <span>1 {token1} = {Number(amount2) / Number(amount1)} {token2}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Share of Pool</span>
                          <span>~0.01%</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="flex items-center gap-1 text-muted-foreground">
                            <TrendingUp className="h-4 w-4" />
                            Estimated APR
                          </span>
                          <span className="text-green-500">24.5%</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="flex items-center gap-1 text-muted-foreground">
                            <Percent className="h-4 w-4" />
                            Slippage
                          </span>
                          <span>{slippage}%</span>
                        </div>
                      </div>
                    )}

                    <Button
                      className="w-full"
                      onClick={handleAddLiquidity}
                      disabled={loading || !connected || !amount1 || !amount2}
                    >
                      {loading ? "Adding Liquidity..." : 
                       !connected ? "Connect Wallet to Add Liquidity" : 
                       "Add Liquidity"}
                    </Button>
                  </TabsContent>
                  
                  <TabsContent value="remove">
                    {myPositions.length > 0 ? (
                      <div className="space-y-4">
                        <p className="text-sm text-muted-foreground">Select a position to remove liquidity:</p>
                        {myPositions.map((position) => (
                          <Card key={position.id} className="overflow-hidden">
                            <CardContent className="p-4">
                              <div className="flex justify-between items-center mb-2">
                                <div className="font-medium">{position.token0}/{position.token1}</div>
                                <div className="text-xs text-muted-foreground">Created {position.createdAt}</div>
                              </div>
                              <div className="space-y-2 mb-4">
                                <div className="flex justify-between text-sm">
                                  <span className="text-muted-foreground">Amount</span>
                                  <span>{position.amountToken0} {position.token0} + {position.amountToken1} {position.token1}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                  <span className="text-muted-foreground">Value</span>
                                  <span>${position.value.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                  <span className="text-muted-foreground">APR</span>
                                  <span className="text-green-500">{position.apr}%</span>
                                </div>
                              </div>
                              <Button
                                variant="outline"
                                className="w-full border-destructive text-destructive hover:bg-destructive/10"
                                onClick={() => handleRemoveLiquidity(position.id)}
                                disabled={loading}
                              >
                                <Minus className="h-4 w-4 mr-2" />
                                Remove Liquidity
                              </Button>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <p className="text-muted-foreground">You have no active liquidity positions.</p>
                        <Button 
                          variant="link" 
                          onClick={() => setActiveTab("add")}
                          className="mt-2"
                        >
                          Add Liquidity
                        </Button>
                      </div>
                    )}
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>
          
          <div className="lg:col-span-2">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle>My Liquidity Positions</CardTitle>
                <CardDescription>Overview of your active liquidity positions</CardDescription>
              </CardHeader>
              <CardContent>
                {myPositions.length > 0 ? (
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {myPositions.map((position) => (
                        <Card key={position.id} className="overflow-hidden border border-border/60">
                          <div className="bg-gradient-to-r from-primary/20 to-accent/20 h-2"></div>
                          <CardContent className="p-4">
                            <div className="flex justify-between items-center mb-3">
                              <div className="font-medium text-lg">{position.token0}/{position.token1}</div>
                              <div className="text-xs px-2 py-1 bg-secondary rounded-full">Active</div>
                            </div>
                            
                            <div className="space-y-3">
                              <div>
                                <div className="text-xs text-muted-foreground mb-1">Pooled Tokens</div>
                                <div className="flex justify-between">
                                  <div className="text-sm">{position.amountToken0} {position.token0}</div>
                                  <div className="text-sm">${(position.amountToken0 * (position.token0 === "SOL" ? 125 : position.token0 === "USDC" ? 1 : 0.25)).toFixed(2)}</div>
                                </div>
                                <div className="flex justify-between">
                                  <div className="text-sm">{position.amountToken1} {position.token1}</div>
                                  <div className="text-sm">${(position.amountToken1 * (position.token1 === "SOL" ? 125 : position.token1 === "USDC" ? 1 : 0.25)).toFixed(2)}</div>
                                </div>
                              </div>
                              
                              <Separator />
                              
                              <div>
                                <div className="text-xs text-muted-foreground mb-1">APR</div>
                                <div className="flex items-center">
                                  <div className="text-lg font-medium text-green-500">{position.apr}%</div>
                                  <TrendingUp className="h-4 w-4 text-green-500 ml-1" />
                                </div>
                              </div>
                              
                              <Separator />
                              
                              <div className="flex justify-between">
                                <div>
                                  <div className="text-xs text-muted-foreground mb-1">Unclaimed fees</div>
                                  <div className="text-sm">~$2.45</div>
                                </div>
                                <div>
                                  <div className="text-xs text-muted-foreground mb-1">Total value</div>
                                  <div className="text-sm font-medium">${position.value.toFixed(2)}</div>
                                </div>
                              </div>
                              
                              <div className="flex gap-2 pt-2">
                                <Button 
                                  variant="outline" 
                                  size="sm" 
                                  className="flex-1 border-primary text-primary hover:bg-primary/10"
                                >
                                  Claim Fees
                                </Button>
                                <Button 
                                  variant="outline"
                                  size="sm"
                                  className="flex-1 border-destructive text-destructive hover:bg-destructive/10"
                                  onClick={() => handleRemoveLiquidity(position.id)}
                                >
                                  Remove
                                </Button>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                    
                    <div className="bg-secondary/30 rounded-lg p-4">
                      <div className="text-sm font-medium mb-2">Liquidity Overview</div>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div>
                          <div className="text-xs text-muted-foreground">Total Value</div>
                          <div className="text-lg font-medium">$175.00</div>
                        </div>
                        <div>
                          <div className="text-xs text-muted-foreground">Unclaimed Fees</div>
                          <div className="text-lg font-medium">$4.90</div>
                        </div>
                        <div>
                          <div className="text-xs text-muted-foreground">Average APR</div>
                          <div className="text-lg font-medium text-green-500">25.35%</div>
                        </div>
                        <div>
                          <div className="text-xs text-muted-foreground">Active Positions</div>
                          <div className="text-lg font-medium">{myPositions.length}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <div className="mb-4">
                      <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-secondary/30">
                        <Plus className="h-6 w-6 text-muted-foreground" />
                      </div>
                    </div>
                    <h3 className="text-lg font-medium">No active positions</h3>
                    <p className="text-muted-foreground mt-2 mb-4">
                      Add liquidity to start earning fees and rewards
                    </p>
                    <Button onClick={() => setActiveTab("add")}>
                      Add Liquidity
                    </Button>
                  </div>
                )}
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

export default Liquidity;
