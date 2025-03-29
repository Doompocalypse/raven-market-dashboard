
import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { getProposals, voteOnProposal, executeProposal, subscribeToProposalUpdates, ProposalData } from "@/services/api";
import { useToast } from "@/hooks/use-toast";
import { CheckCircle2, XCircle, Clock, ThumbsUp } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";

interface ProposalVotingProps {
  factionFilter?: string | null;
}

const ProposalVoting = ({ factionFilter }: ProposalVotingProps) => {
  const { toast } = useToast();
  const [proposals, setProposals] = useState<ProposalData[]>([]);

  // Fetch proposals
  const { data, isLoading, refetch } = useQuery({
    queryKey: ["proposals"],
    queryFn: getProposals,
  });

  useEffect(() => {
    if (data) {
      setProposals(data);
    }
  }, [data]);

  // Subscribe to proposal updates
  useEffect(() => {
    const unsubscribe = subscribeToProposalUpdates((updatedProposal) => {
      setProposals((prevProposals) => {
        // Find if the proposal already exists
        const existingIndex = prevProposals.findIndex(p => p.id === updatedProposal.id);
        
        if (existingIndex >= 0) {
          // Update existing proposal
          const newProposals = [...prevProposals];
          newProposals[existingIndex] = updatedProposal;
          return newProposals;
        } else {
          // Add new proposal
          return [...prevProposals, updatedProposal];
        }
      });

      toast({
        title: "Proposal Updated",
        description: `${updatedProposal.title} has been updated.`,
      });
    });

    return unsubscribe;
  }, [toast]);

  const handleVote = async (proposalId: string) => {
    try {
      await voteOnProposal(proposalId);
      
      // Update local state optimistically
      setProposals(prevProposals => {
        return prevProposals.map(proposal => {
          if (proposal.id === proposalId) {
            return { ...proposal, votes: proposal.votes + 1 };
          }
          return proposal;
        });
      });

      toast({
        title: "Vote Submitted",
        description: "Your vote has been recorded successfully.",
      });
    } catch (error) {
      toast({
        title: "Vote Failed",
        description: "There was an error submitting your vote.",
        variant: "destructive",
      });
    }
  };

  const handleExecute = async (proposalId: string) => {
    try {
      await executeProposal(proposalId);
      
      // Update local state optimistically
      setProposals(prevProposals => {
        return prevProposals.map(proposal => {
          if (proposal.id === proposalId) {
            return { ...proposal, status: "executed" as const };
          }
          return proposal;
        });
      });

      toast({
        title: "Proposal Executed",
        description: "The proposal has been executed successfully.",
      });
    } catch (error) {
      toast({
        title: "Execution Failed",
        description: "There was an error executing the proposal.",
        variant: "destructive",
      });
    }
  };

  // Get the filtered proposals
  const filteredProposals = factionFilter 
    ? proposals.filter(p => p.factionId === factionFilter)
    : proposals;

  const activeProposals = filteredProposals.filter(p => p.status === "active");

  return (
    <div className="space-y-6">
      {isLoading ? (
        <div className="text-center p-8">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          <p className="mt-2 text-muted-foreground">Loading proposals<span className="loading-dots"></span></p>
        </div>
      ) : activeProposals.length === 0 ? (
        <div className="text-center py-12">
          <Clock className="mx-auto h-12 w-12 text-muted-foreground" />
          <h3 className="mt-4 text-lg font-medium">No active proposals</h3>
          <p className="mt-2 text-muted-foreground">
            {factionFilter ? "This faction has no active proposals." : "Check back later for new proposals to vote on."}
          </p>
        </div>
      ) : (
        <ScrollArea className="proposal-list rounded-md pr-4">
          <div className="space-y-4">
            {activeProposals.map((proposal) => (
              <Card key={proposal.id} className="overflow-hidden border-accent/20">
                <CardContent className="p-0">
                  <div className="p-4">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-lg font-medium">{proposal.title}</h3>
                      <Badge variant={proposal.votes >= proposal.requiredVotes ? "default" : "outline"} className="ml-2">
                        {proposal.votes}/{proposal.requiredVotes} votes
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">{proposal.description}</p>
                    <div className="flex items-center text-xs text-muted-foreground mb-4">
                      <span>Proposed by {proposal.proposer.substring(0, 6)}...{proposal.proposer.substring(proposal.proposer.length - 4)}</span>
                    </div>
                    <div className="flex space-x-3 justify-end">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleVote(proposal.id)}
                        className="flex items-center"
                      >
                        <ThumbsUp className="mr-2 h-4 w-4" />
                        Vote
                      </Button>
                      <Button 
                        size="sm"
                        onClick={() => handleExecute(proposal.id)}
                        disabled={proposal.votes < proposal.requiredVotes}
                        className="flex items-center"
                      >
                        <CheckCircle2 className="mr-2 h-4 w-4" />
                        Execute
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </ScrollArea>
      )}
    </div>
  );
};

export default ProposalVoting;
