
import { createContext, useContext, FC, ReactNode, useMemo, useState, useEffect } from 'react';
import {
  ConnectionProvider,
  WalletProvider,
  useWallet,
} from '@solana/wallet-adapter-react';
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';
import { PhantomWalletAdapter } from '@solana/wallet-adapter-wallets';
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui';
import { clusterApiUrl, Connection, PublicKey } from '@solana/web3.js';

// Import the wallet adapter CSS
import '@solana/wallet-adapter-react-ui/styles.css';

type WalletContextProps = {
  publicKey: PublicKey | null;
  connected: boolean;
  connecting: boolean;
  disconnecting: boolean;
  connect: () => Promise<void>;
  disconnect: () => Promise<void>;
};

const WalletContext = createContext<WalletContextProps | undefined>(undefined);

export const useWalletContext = () => {
  const context = useContext(WalletContext);
  if (!context) {
    throw new Error('useWalletContext must be used within a WalletContextProvider');
  }
  return context;
};

export const WalletContextProvider: FC<{ children: ReactNode }> = ({ children }) => {
  // Set up the Solana network connection
  const network = WalletAdapterNetwork.Mainnet;
  const endpoint = useMemo(() => clusterApiUrl(network), [network]);

  // Set up the wallet adapters
  const wallets = useMemo(() => [new PhantomWalletAdapter()], []);

  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>
          <WalletContextInner>{children}</WalletContextInner>
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
};

const WalletContextInner: FC<{ children: ReactNode }> = ({ children }) => {
  const { publicKey, connected, connecting, disconnecting, connect, disconnect } = useWallet();
  
  return (
    <WalletContext.Provider
      value={{
        publicKey,
        connected,
        connecting,
        disconnecting,
        connect,
        disconnect,
      }}
    >
      {children}
    </WalletContext.Provider>
  );
};
