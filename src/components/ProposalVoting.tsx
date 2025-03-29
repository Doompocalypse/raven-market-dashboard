
import { useState, useEffect } from "react";
import { getProposals, ProposalData, voteOnProposal, executeProposal, subscribeToProposalUpdates } from "@/services/api";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { useWalletContext } from "@/contexts/WalletContext";

const ProposalVoting = () => {
  const { connected } = useWalletContext();
  const [proposals, setProposals] = useState<ProposalData[]>([]);
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchProposals = async () => {
    setLoading(true);
    try {
      const data = await getProposals();
      setProposals(data.filter(p => p.status === 'active'));
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch proposal data.",
        variant: "destructive",
      });
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProposals();

    // Set up Socket.io for real-time updates
    const unsubscribe = subscribeToProposalUpdates((updatedProposal) => {
      setProposals(prevProposals => {
        const index = prevProposals.findIndex(p => p.id === updatedProposal.id);
        if (index === -1) {
          if (updatedProposal.status === 'active') {
            return [...prevProposals, updatedProposal];
          }
          return prevProposals;
        }
        
        if (updatedProposal.status !== 'active') {
          return prevProposals.filter(p => p.id !== updatedProposal.id);
        }
        
        const updatedProposals = [...prevProposals];
        updatedProposals[index] = updatedProposal;
        return updatedProposals;
      });
      
      toast({
        title: "Proposal Updated",
        description: `"${updatedProposal.title}" has been updated.`,
      });
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const handleVote = async (proposalId: string) => {
    if (!connected) {
      toast({
        title: "Wallet not connected",
        description: "Please connect your wallet to vote on proposals.",
        variant: "destructive",
      });
      return;
    }

    setActionLoading(proposalId);
    try {
      await voteOnProposal(proposalId);
      
      // Update the proposal in state
      setProposals(prevProposals => 
        prevProposals.map(p => 
          p.id === proposalId ? { ...p, votes: p.votes + 1 } : p
        )
      );
      
      toast({
        title: "Vote Successful",
        description: "Your vote has been recorded.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to vote on proposal.",
        variant: "destructive",
      });
      console.error(error);
    } finally {
      setActionLoading(null);
    }
  };

  const handleExecute = async (proposalId: string) => {
    if (!connected) {
      toast({
        title: "Wallet not connected",
        description: "Please connect your wallet to execute proposals.",
        variant: "destructive",
      });
      return;
    }

    setActionLoading(proposalId);
    try {
      await executeProposal(proposalId);
      
      // Remove the proposal from the list
      setProposals(prevProposals => 
        prevProposals.filter(p => p.id !== proposalId)
      );
      
      toast({
        title: "Execution Successful",
        description: "The proposal has been executed.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to execute proposal.",
        variant: "destructive",
      });
      console.error(error);
    } finally {
      setActionLoading(null);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Active Proposals</CardTitle>
        <CardDescription>Vote on and execute faction vault proposals</CardDescription>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <Loader2 className="animate-spin h-8 w-8" />
          </div>
        ) : (
          <div className="space-y-4 proposal-list">
            {proposals.length === 0 && (
              <div className="text-center py-12 text-muted-foreground">
                No active proposals at this time
              </div>
            )}
            {proposals.map((proposal) => (
              <Card key={proposal.id} className="overflow-hidden">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">{proposal.title}</CardTitle>
                  <CardDescription className="line-clamp-2">
                    {proposal.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="pb-2">
                  <div className="flex justify-between items-center mb-2">
                    <div className="text-sm text-muted-foreground">
                      Proposer: {proposal.proposer.slice(0, 6)}...{proposal.proposer.slice(-4)}
                    </div>
                    <div>
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-secondary">
                        Votes: {proposal.votes}/{proposal.requiredVotes}
                      </span>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <Button
                      onClick={() => handleVote(proposal.id)}
                      disabled={actionLoading !== null || !connected}
                      variant="outline"
                      className="w-full"
                    >
                      {actionLoading === proposal.id ? (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      ) : null}
                      Vote
                    </Button>
                    <Button
                      onClick={() => handleExecute(proposal.id)}
                      disabled={actionLoading !== null || proposal.votes < proposal.requiredVotes || !connected}
                      className="w-full"
                    >
                      {actionLoading === proposal.id ? (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      ) : null}
                      Execute
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ProposalVoting;
