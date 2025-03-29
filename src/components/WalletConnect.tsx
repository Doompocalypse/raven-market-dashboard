
import { Button } from "@/components/ui/button";
import { useWalletContext } from "@/contexts/WalletContext";
import { Loader2 } from "lucide-react";

const WalletConnect = () => {
  const { publicKey, connected, connecting, connect, disconnect } = useWalletContext();

  const handleConnect = async () => {
    try {
      await connect();
    } catch (error) {
      console.error("Connection error:", error);
    }
  };

  const handleDisconnect = async () => {
    try {
      await disconnect();
    } catch (error) {
      console.error("Disconnection error:", error);
    }
  };

  return (
    <div>
      {!connected ? (
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
      ) : (
        <Button
          onClick={handleDisconnect}
          variant="outline"
          className="border-accent text-accent hover:bg-accent/10"
        >
          {publicKey
            ? `${publicKey.toString().slice(0, 4)}...${publicKey.toString().slice(-4)}`
            : "Disconnect"}
        </Button>
      )}
    </div>
  );
};

export default WalletConnect;
