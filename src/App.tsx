
import React from 'react';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { WalletContextProvider } from "@/contexts/WalletContext";
import Index from "./pages/Index";
import Analytics from "./pages/Analytics";
import Swap from "./pages/Swap";
import Liquidity from "./pages/Liquidity";
import Governance from "./pages/Governance";
import NotFound from "./pages/NotFound";

// Create a client with explicit configuration
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      refetchOnWindowFocus: false,
    },
  },
});

const App = () => (
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <WalletContextProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/analytics" element={<Analytics />} />
              <Route path="/swap" element={<Swap />} />
              <Route path="/liquidity" element={<Liquidity />} />
              <Route path="/governance" element={<Governance />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </WalletContextProvider>
    </QueryClientProvider>
  </React.StrictMode>
);

export default App;
