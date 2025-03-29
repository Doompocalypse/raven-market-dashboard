
import { io } from 'socket.io-client';
import { faker } from '@faker-js/faker';

// For demo purposes, we'll use dummy data
// In a real app, these would be replaced with actual API calls

const API_ENDPOINT = 'https://api.ravendmm.io'; // Dummy API endpoint

// Socket.io connection
const socket = io(API_ENDPOINT, {
  autoConnect: false
});

// Types
export type FactionData = {
  id: string;
  name: string;
  politicalPower: number;
  totalStaked: number;
  apyBoost: number;
  icon: string;
};

export type ProposalData = {
  id: string;
  title: string;
  description: string;
  proposer: string;
  votes: number;
  requiredVotes: number;
  status: 'active' | 'executed' | 'failed';
  factionId: string;
};

export type StatsData = {
  totalSwapVolume: number;
  totalFeesCollected: number;
  activeUsers24h: number;
  tvl: number;
};

export type StakingData = {
  stakedAmount: number;
  estimatedApy: number;
  claimableRewards: number;
};

// Generate mock data
const generateFactions = (): FactionData[] => {
  return Array.from({ length: 5 }, (_, i) => ({
    id: faker.string.uuid(),
    name: ['Ravens', 'Phoenix', 'Dragons', 'Tigers', 'Wolves'][i],
    politicalPower: faker.number.int({ min: 100, max: 1000 }),
    totalStaked: faker.number.int({ min: 10000, max: 1000000 }),
    apyBoost: faker.number.float({ min: 1, max: 5, precision: 0.1 }),
    icon: ['🦅', '🔥', '🐉', '🐯', '🐺'][i],
  })).sort((a, b) => b.totalStaked - a.totalStaked);
};

const generateProposals = (factions: FactionData[]): ProposalData[] => {
  return Array.from({ length: 8 }, (_, i) => ({
    id: faker.string.uuid(),
    title: faker.lorem.sentence(4),
    description: faker.lorem.paragraph(2),
    proposer: faker.finance.ethereumAddress(),
    votes: faker.number.int({ min: 0, max: 5 }),
    requiredVotes: 3,
    status: faker.helpers.arrayElement(['active', 'executed', 'failed']),
    factionId: faker.helpers.arrayElement(factions).id,
  })).filter(p => p.status === 'active');
};

const generateStats = (): StatsData => ({
  totalSwapVolume: faker.number.int({ min: 1000000, max: 10000000 }),
  totalFeesCollected: faker.number.int({ min: 50000, max: 500000 }),
  activeUsers24h: faker.number.int({ min: 500, max: 5000 }),
  tvl: faker.number.int({ min: 5000000, max: 50000000 }),
});

// API methods
export const getStakingData = async (): Promise<StakingData> => {
  // Simulating API call
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        stakedAmount: faker.number.float({ min: 0, max: 10000, precision: 0.01 }),
        estimatedApy: faker.number.float({ min: 10, max: 200, precision: 0.1 }),
        claimableRewards: faker.number.float({ min: 0, max: 1000, precision: 0.01 }),
      });
    }, 500);
  });
};

export const getFactions = async (): Promise<FactionData[]> => {
  // Simulating API call
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(generateFactions());
    }, 500);
  });
};

export const getProposals = async (): Promise<ProposalData[]> => {
  // Simulating API call
  const factions = generateFactions();
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(generateProposals(factions));
    }, 500);
  });
};

export const getStats = async (): Promise<StatsData> => {
  // Simulating API call
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(generateStats());
    }, 500);
  });
};

// Socket.io methods
export const connectSocket = () => {
  socket.connect();
};

export const disconnectSocket = () => {
  socket.disconnect();
};

export const subscribeToProposalUpdates = (callback: (proposal: ProposalData) => void) => {
  socket.on('proposalUpdate', callback);
  return () => {
    socket.off('proposalUpdate', callback);
  };
};

export const voteOnProposal = async (proposalId: string): Promise<void> => {
  // Simulating API call
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve();
    }, 500);
  });
};

export const executeProposal = async (proposalId: string): Promise<void> => {
  // Simulating API call
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve();
    }, 500);
  });
};

export const stakeTokens = async (amount: number): Promise<void> => {
  // Simulating API call
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve();
    }, 500);
  });
};

export const unstakeTokens = async (amount: number): Promise<void> => {
  // Simulating API call
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve();
    }, 500);
  });
};

export const claimRewards = async (): Promise<void> => {
  // Simulating API call
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve();
    }, 500);
  });
};
