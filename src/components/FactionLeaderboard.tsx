
import { useState, useEffect } from "react";
import { getFactions, FactionData } from "@/services/api";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Loader2 } from "lucide-react";

const FactionLeaderboard = () => {
  const [factions, setFactions] = useState<FactionData[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const fetchFactions = async () => {
    setLoading(true);
    try {
      const data = await getFactions();
      setFactions(data.sort((a, b) => b.totalStaked - a.totalStaked));
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch faction data.",
        variant: "destructive",
      });
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFactions();
  }, []);

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Faction Leaderboard</CardTitle>
        <CardDescription>Current faction standings by political power</CardDescription>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <Loader2 className="animate-spin h-8 w-8" />
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Rank</TableHead>
                <TableHead>Faction</TableHead>
                <TableHead>Political Power</TableHead>
                <TableHead className="text-right">Total Staked</TableHead>
                <TableHead className="text-right">APY Boost</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {factions.map((faction, index) => (
                <TableRow key={faction.id} className="faction-row">
                  <TableCell className="font-medium">{index + 1}</TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <span className="mr-2 text-lg">{faction.icon}</span>
                      {faction.name}
                    </div>
                  </TableCell>
                  <TableCell>{faction.politicalPower.toLocaleString()}</TableCell>
                  <TableCell className="text-right">{faction.totalStaked.toLocaleString()} LP</TableCell>
                  <TableCell className="text-right text-green-500">+{faction.apyBoost.toFixed(1)}%</TableCell>
                </TableRow>
              ))}
              {factions.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-6 text-muted-foreground">
                    No faction data available
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
};

export default FactionLeaderboard;
