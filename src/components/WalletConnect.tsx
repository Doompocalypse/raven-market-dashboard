
import { Button } from "@/components/ui/button";
import { useWalletContext } from "@/contexts/WalletContext";
import { Loader2, LogOut, User } from "lucide-react";
import { Link } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const WalletConnect = () => {
  const { publicKey, connected, connecting, connect, user, signOut } = useWalletContext();

  const handleConnect = async () => {
    try {
      await connect();
    } catch (error) {
      console.error("Connection error:", error);
    }
  };

  // User is logged in via email/Google or wallet
  if (user || connected) {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="border-accent text-accent hover:bg-accent/10">
            {publicKey
              ? `${publicKey.toString().slice(0, 4)}...${publicKey.toString().slice(-4)}`
              : user?.email?.split('@')[0] || "Account"}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>My Account</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem disabled>
            <User className="mr-2 h-4 w-4" />
            <span>Profile</span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={signOut}>
            <LogOut className="mr-2 h-4 w-4" />
            <span>Log out</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  // User is not logged in
  return (
    <div className="flex space-x-2">
      <Button
        asChild
        variant="outline"
        className="border-accent text-accent hover:bg-accent/10"
      >
        <Link to="/auth">Sign In</Link>
      </Button>
      
      <Button
        onClick={handleConnect}
        disabled={connecting}
        className="bg-accent hover:bg-accent/90"
      >
        {connecting ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Connecting
          </>
        ) : (
          "Connect Wallet"
        )}
      </Button>
    </div>
  );
};

export default WalletConnect;
