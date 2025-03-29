
import React, { createContext, useContext, FC, ReactNode, useMemo, useState, useEffect } from 'react';
import {
  ConnectionProvider,
  WalletProvider,
  useWallet,
} from '@solana/wallet-adapter-react';
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';
import { PhantomWalletAdapter } from '@solana/wallet-adapter-wallets';
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui';
import { clusterApiUrl, Connection, PublicKey } from '@solana/web3.js';
import { supabase } from "@/integrations/supabase/client";

// Import the wallet adapter CSS
import '@solana/wallet-adapter-react-ui/styles.css';

type WalletContextProps = {
  publicKey: PublicKey | null;
  connected: boolean;
  connecting: boolean;
  disconnecting: boolean;
  connect: () => Promise<void>;
  disconnect: () => Promise<void>;
  user: any;
  session: any;
  signOut: () => Promise<void>;
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
  const [user, setUser] = useState(null);
  const [session, setSession] = useState(null);
  
  useEffect(() => {
    // Check if there's an active session when the component mounts
    const getSession = async () => {
      const { data } = await supabase.auth.getSession();
      setSession(data.session);
      setUser(data.session?.user || null);
    };
    
    getSession();

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user || null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signOut = async () => {
    try {
      if (connected) {
        await disconnect();
      }
      await supabase.auth.signOut();
      setUser(null);
      setSession(null);
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };
  
  return (
    <WalletContext.Provider
      value={{
        publicKey,
        connected,
        connecting,
        disconnecting,
        connect,
        disconnect,
        user,
        session,
        signOut,
      }}
    >
      {children}
    </WalletContext.Provider>
  );
};
