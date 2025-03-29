
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Navbar from "@/components/Navbar";
import ProposalVoting from "@/components/ProposalVoting";
import { connectSocket, disconnectSocket, getFactions, FactionData } from "@/services/api";
import { useQuery } from "@tanstack/react-query";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Shield, Users } from "lucide-react";

const Governance = () => {
  const [selectedFaction, setSelectedFaction] = useState<string | null>(null);
  
  // Connect to Socket.io when the component mounts
  useEffect(() => {
    connectSocket();
    
    // Disconnect when the component unmounts
    return () => {
      disconnectSocket();
    };
  }, []);

  const { data: factions = [] } = useQuery({
    queryKey: ["factions"],
    queryFn: getFactions
  });

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <main className="flex-grow container py-8 px-4 max-w-screen-xl">
        <div className="grid gap-6">
          {/* Header */}
          <Card className="border-none bg-gradient-to-r from-primary/10 to-accent/10">
            <CardHeader className="pb-3">
              <CardTitle className="text-3xl flex items-center">
                <Shield className="mr-3 h-8 w-8" /> Governance
              </CardTitle>
              <CardDescription className="text-lg">
                Vote on protocol proposals and shape the future of Raven DMM
              </CardDescription>
            </CardHeader>
          </Card>

          {/* Tabs for different governance aspects */}
          <Tabs defaultValue="proposals" className="w-full">
            <TabsList className="grid grid-cols-2 mb-6">
              <TabsTrigger value="proposals" className="text-sm flex items-center">
                <Shield className="mr-2 h-4 w-4" /> Active Proposals
              </TabsTrigger>
              <TabsTrigger value="factions" className="text-sm flex items-center">
                <Users className="mr-2 h-4 w-4" /> Factions
              </TabsTrigger>
            </TabsList>
            
            {/* Proposals Tab */}
            <TabsContent value="proposals">
              <Card>
                <CardHeader>
                  <CardTitle>Active Proposals</CardTitle>
                  <CardDescription>
                    Vote on important protocol decisions. Each proposal requires at least 3 votes to be executable.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {selectedFaction ? (
                    <div className="mb-4">
                      <p className="font-medium">Filtered by faction: {
                        factions.find((f: FactionData) => f.id === selectedFaction)?.name
                      } <button 
                          onClick={() => setSelectedFaction(null)}
                          className="text-primary text-sm ml-2 underline"
                        >
                          Clear filter
                        </button>
                      </p>
                    </div>
                  ) : null}
                  <ProposalVoting factionFilter={selectedFaction} />
                </CardContent>
              </Card>
            </TabsContent>
            
            {/* Factions Tab */}
            <TabsContent value="factions">
              <Card>
                <CardHeader>
                  <CardTitle>Faction Overview</CardTitle>
                  <CardDescription>
                    View faction statistics and filter proposals by faction
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {factions.map((faction: FactionData) => (
                      <Card 
                        key={faction.id} 
                        className={`cursor-pointer hover:border-primary transition-colors ${
                          selectedFaction === faction.id ? 'border-primary' : ''
                        }`}
                        onClick={() => setSelectedFaction(faction.id)}
                      >
                        <CardHeader className="pb-2">
                          <div className="flex justify-between items-center">
                            <CardTitle className="text-xl flex items-center">
                              <span className="text-2xl mr-2">{faction.icon}</span> {faction.name}
                            </CardTitle>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-2">
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Political Power:</span>
                              <span className="font-medium">{faction.politicalPower}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Total Staked:</span>
                              <span className="font-medium">{faction.totalStaked.toLocaleString()} DMC</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">APY Boost:</span>
                              <span className="font-medium text-accent">+{faction.apyBoost}%</span>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
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

export default Governance;
