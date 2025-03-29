
import { useState, useEffect } from "react";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { useToast } from "@/hooks/use-toast";
import { getStakingData, stakeTokens, unstakeTokens, claimRewards, StakingData } from "@/services/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { useWalletContext } from "@/contexts/WalletContext";

const StakingDashboard = () => {
  const { connected } = useWalletContext();
  const [amount, setAmount] = useState("");
  const [stakingData, setStakingData] = useState<StakingData | null>(null);
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchStakingData = async () => {
    if (!connected) return;
    
    setLoading(true);
    try {
      const data = await getStakingData();
      setStakingData(data);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch staking data.",
        variant: "destructive",
      });
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (connected) {
      fetchStakingData();
    }
  }, [connected]);

  const handleStake = async () => {
    if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) {
      toast({
        title: "Invalid amount",
        description: "Please enter a valid amount to stake.",
        variant: "destructive",
      });
      return;
    }

    setActionLoading("stake");
    try {
      await stakeTokens(Number(amount));
      await fetchStakingData();
      toast({
        title: "Success",
        description: `Staked ${amount} LP tokens successfully.`,
      });
      setAmount("");
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to stake tokens.",
        variant: "destructive",
      });
      console.error(error);
    } finally {
      setActionLoading(null);
    }
  };

  const handleUnstake = async () => {
    if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) {
      toast({
        title: "Invalid amount",
        description: "Please enter a valid amount to unstake.",
        variant: "destructive",
      });
      return;
    }

    if (stakingData && Number(amount) > stakingData.stakedAmount) {
      toast({
        title: "Invalid amount",
        description: "You cannot unstake more than you have staked.",
        variant: "destructive",
      });
      return;
    }

    setActionLoading("unstake");
    try {
      await unstakeTokens(Number(amount));
      await fetchStakingData();
      toast({
        title: "Success",
        description: `Unstaked ${amount} LP tokens successfully.`,
      });
      setAmount("");
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to unstake tokens.",
        variant: "destructive",
      });
      console.error(error);
    } finally {
      setActionLoading(null);
    }
  };

  const handleClaim = async () => {
    setActionLoading("claim");
    try {
      await claimRewards();
      await fetchStakingData();
      toast({
        title: "Success",
        description: "Rewards claimed successfully.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to claim rewards.",
        variant: "destructive",
      });
      console.error(error);
    } finally {
      setActionLoading(null);
    }
  };

  if (!connected) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle>LP Staking Dashboard</CardTitle>
          <CardDescription>Stake your LP tokens to earn rewards</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <p className="text-muted-foreground">Connect your wallet to view staking information</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>LP Staking Dashboard</CardTitle>
        <CardDescription>Stake your DMC/USDC/SOL LP tokens to earn rewards</CardDescription>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <Loader2 className="animate-spin h-8 w-8" />
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-6">
            <div className="flex flex-col space-y-4">
              <div className="flex flex-col space-y-2">
                <label htmlFor="amount" className="text-sm font-medium">
                  Amount
                </label>
                <div className="flex space-x-2">
                  <Input
                    id="amount"
                    placeholder="Enter LP token amount"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    type="number"
                    min="0"
                    step="0.01"
                  />
                  <Button
                    variant="outline"
                    onClick={() => stakingData && setAmount(stakingData.stakedAmount.toString())}
                    disabled={!stakingData || stakingData.stakedAmount <= 0}
                  >
                    Max
                  </Button>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <Button
                  onClick={handleStake}
                  disabled={actionLoading !== null}
                  className="w-full"
                >
                  {actionLoading === "stake" ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : null}
                  Stake
                </Button>
                <Button
                  onClick={handleUnstake}
                  disabled={actionLoading !== null}
                  variant="outline"
                  className="w-full"
                >
                  {actionLoading === "unstake" ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : null}
                  Unstake
                </Button>
              </div>

              <div className="space-y-3 pt-4">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Current Staked</span>
                  <span className="text-sm font-medium">
                    {stakingData ? `${stakingData.stakedAmount.toLocaleString()} LP` : "-"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Claimable Rewards</span>
                  <span className="text-sm font-medium">
                    {stakingData ? `${stakingData.claimableRewards.toLocaleString()} DMC` : "-"}
                  </span>
                </div>
                <Button
                  onClick={handleClaim}
                  disabled={!stakingData || stakingData.claimableRewards <= 0 || actionLoading !== null}
                  variant="secondary"
                  className="w-full mt-2"
                >
                  {actionLoading === "claim" ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : null}
                  Claim Rewards
                </Button>
              </div>
            </div>

            <div className="flex flex-col justify-center items-center space-y-4">
              <div className="circular-progress-container">
                <CircularProgressbar
                  value={stakingData ? stakingData.estimatedApy : 0}
                  maxValue={200}
                  text={`${stakingData ? stakingData.estimatedApy.toFixed(1) : 0}%`}
                  styles={buildStyles({
                    pathColor: "#8B5CF6",
                    textColor: "#F6F6F7",
                    trailColor: "#1F2937",
                  })}
                />
              </div>
              <div className="text-center">
                <h4 className="text-lg font-medium">Estimated APY</h4>
                <p className="text-sm text-muted-foreground">
                  Annual Percentage Yield
                </p>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default StakingDashboard;
