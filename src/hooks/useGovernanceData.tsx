'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useAccount, useReadContract } from 'wagmi';

// Define contract ABIs
const GOVERNANCE_TOKEN_ABI = [
  {
    constant: true,
    name: 'balanceOf',
    inputs: [{ name: '_owner', type: 'address' }],
    outputs: [{ name: 'balance', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    constant: true,
    name: 'getVotes',
    inputs: [{ name: '_owner', type: 'address' }],
    outputs: [{ name: 'votes', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    constant: true,
    name: 'delegates',
    inputs: [{ name: '_owner', type: 'address' }],
    outputs: [{ name: 'delegatee', type: 'address' }],
    stateMutability: 'view',
    type: 'function',
  },
];

const GOVERNANCE_ABI = [
  {
    constant: true,
    name: 'getProposalCount',
    inputs: [],
    outputs: [{ name: 'count', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    constant: true,
    name: 'getProposal',
    inputs: [{ name: '_proposalId', type: 'uint256' }],
    outputs: [
      { name: 'id', type: 'uint256' },
      { name: 'title', type: 'string' },
      { name: 'description', type: 'string' },
      { name: 'status', type: 'uint8' },
      { name: 'votesFor', type: 'uint256' },
      { name: 'votesAgainst', type: 'uint256' },
      { name: 'votesAbstain', type: 'uint256' },
      { name: 'endDate', type: 'uint256' },
      { name: 'proposer', type: 'address' },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    constant: true,
    name: 'getActiveProposals',
    inputs: [],
    outputs: [{ name: 'proposalIds', type: 'uint256[]' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    constant: true,
    name: 'getUserVotingHistory',
    inputs: [{ name: '_user', type: 'address' }],
    outputs: [
      { name: 'proposalIds', type: 'uint256[]' },
      { name: 'votes', type: 'uint8[]' },
      { name: 'timestamps', type: 'uint256[]' },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    constant: true,
    name: 'getDelegationInfo',
    inputs: [{ name: '_user', type: 'address' }],
    outputs: [
      { name: 'delegatedTo', type: 'address' },
      { name: 'delegatedFrom', type: 'address[]' },
      { name: 'delegatedPower', type: 'uint256' },
    ],
    stateMutability: 'view',
    type: 'function',
  },
];

// Contract addresses (these would be updated with actual deployed addresses)
const CONTRACT_ADDRESSES = {
  GOVERNANCE_TOKEN: '0x3456789012345678901234567890123456789012', // Placeholder
  GOVERNANCE: '0x8901234567890123456789012345678901234567', // Placeholder
};

// Define the context type
type GovernanceDataContextType = {
  proposals: {
    active: Array<{
      id: string;
      title: string;
      description: string;
      status: string;
      votes: {
        for: number;
        against: number;
        abstain: number;
      };
      endDate: string;
      proposer: string;
    }>;
    past: Array<{
      id: string;
      title: string;
      description: string;
      status: string;
      votes: {
        for: number;
        against: number;
        abstain: number;
      };
      endDate: string;
      proposer: string;
    }>;
  };
  voting: {
    votingPower: string | null;
    delegatedFrom: Array<string>;
    delegatedTo: string;
    votingHistory: Array<{
      proposalId: string;
      vote: string;
      date: string;
    }>;
  };
  delegation: {
    activeDelegations: Array<{
      address: string;
      power: string;
    }>;
    delegationOptions: Array<{
      address: string;
      name: string;
      delegatedPower: string;
      delegators: number;
    }>;
  };
  refreshData: () => void;
  isLoading: boolean;
};

// Create the context
const GovernanceDataContext = createContext<GovernanceDataContextType | undefined>(undefined);

// Helper function to convert status number to string
function getProposalStatusName(status: number): string {
  const statuses = ['Pending', 'Active', 'Passed', 'Rejected', 'Canceled', 'Queued', 'Executed'];
  return statuses[status] || 'Unknown';
}

// Helper function to convert vote number to string
function getVoteTypeName(vote: number): string {
  const votes = ['Against', 'For', 'Abstain'];
  return votes[vote] || 'Unknown';
}

// Provider component
export function GovernanceDataProvider({ children }: { children: ReactNode }) {
  const { address, isConnected } = useAccount();
  const [isLoading, setIsLoading] = useState(true);
  
  // Proposals state
  const [proposals, setProposals] = useState({
    active: [],
    past: [],
  });
  
  // Voting state
  const [voting, setVoting] = useState({
    votingPower: null,
    delegatedFrom: [],
    delegatedTo: 'Self',
    votingHistory: [],
  });
  
  // Delegation state
  const [delegation, setDelegation] = useState({
    activeDelegations: [],
    delegationOptions: [
      {
        address: '0x7890...1234',
        name: 'Guardian Council Member',
        delegatedPower: '250,000.00',
        delegators: 45,
      },
      {
        address: '0x3456...7890',
        name: 'Lead Developer',
        delegatedPower: '180,000.00',
        delegators: 32,
      },
      {
        address: '0x2345...6789',
        name: 'Community Manager',
        delegatedPower: '120,000.00',
        delegators: 28,
      },
    ],
  });

  // Voting Power
  const { data: votesData } = useReadContract({
    address: CONTRACT_ADDRESSES.GOVERNANCE_TOKEN as `0x${string}`,
    abi: GOVERNANCE_TOKEN_ABI,
    functionName: 'getVotes',
    args: address ? [address] : undefined,
    query: {
      enabled: !!address && isConnected,
    },
  });

  // Delegation Info
  const { data: delegationData } = useReadContract({
    address: CONTRACT_ADDRESSES.GOVERNANCE as `0x${string}`,
    abi: GOVERNANCE_ABI,
    functionName: 'getDelegationInfo',
    args: address ? [address] : undefined,
    query: {
      enabled: !!address && isConnected,
    },
  });

  // Active Proposals
  const { data: activeProposalIds } = useReadContract({
    address: CONTRACT_ADDRESSES.GOVERNANCE as `0x${string}`,
    abi: GOVERNANCE_ABI,
    functionName: 'getActiveProposals',
    args: [],
    query: {
      enabled: isConnected,
    },
  });

  // Voting History
  const { data: votingHistoryData } = useReadContract({
    address: CONTRACT_ADDRESSES.GOVERNANCE as `0x${string}`,
    abi: GOVERNANCE_ABI,
    functionName: 'getUserVotingHistory',
    args: address ? [address] : undefined,
    query: {
      enabled: !!address && isConnected,
    },
  });

  // Function to refresh data
  const refreshData = () => {
    setIsLoading(true);
    // The useReadContract hooks will automatically refresh when called again
    setTimeout(() => setIsLoading(false), 1000);
  };

  // Process the data when it changes
  useEffect(() => {
    if (!isConnected) {
      setIsLoading(false);
      return;
    }

    // In a real implementation, we would process the data from the blockchain
    // For now, we'll use mock data to demonstrate the functionality

    // Mock active proposals
    const mockActiveProposals = [
      {
        id: 'PROP-42',
        title: 'Increase BLTBY Staking Rewards',
        description: 'Proposal to increase the staking rewards for BLTBY holders from 5% to 7% APY to incentivize long-term holding.',
        status: 'Active',
        votes: { for: 65, against: 20, abstain: 15 },
        endDate: 'Apr 15, 2025',
        proposer: '0x1234...5678',
      },
      {
        id: 'PROP-43',
        title: 'Add New Development Guild',
        description: 'Create a new specialized guild for blockchain developers with enhanced EQTBLT earning rates.',
        status: 'Active',
        votes: { for: 72, against: 8, abstain: 20 },
        endDate: 'Apr 18, 2025',
        proposer: '0xabcd...ef01',
      },
    ];

    // Mock past proposals
    const mockPastProposals = [
      {
        id: 'PROP-41',
        title: 'Treasury Diversification',
        description: 'Allocate 10% of the treasury to stablecoins to reduce volatility risk.',
        status: 'Passed',
        votes: { for: 82, against: 12, abstain: 6 },
        endDate: 'Mar 30, 2025',
        proposer: '0x2468...1357',
      },
      {
        id: 'PROP-40',
        title: 'Reduce Vesting Period',
        description: 'Reduce the vesting period for EQTBLT to BLTBY conversion from 12 months to 9 months.',
        status: 'Rejected',
        votes: { for: 35, against: 60, abstain: 5 },
        endDate: 'Mar 25, 2025',
        proposer: '0x9876...5432',
      },
    ];

    // Mock voting history
    const mockVotingHistory = [
      {
        proposalId: 'PROP-41',
        vote: 'For',
        date: 'Mar 28, 2025',
      },
      {
        proposalId: 'PROP-40',
        vote: 'Against',
        date: 'Mar 23, 2025',
      },
    ];

    // Update state with mock data
    setProposals({
      active: mockActiveProposals,
      past: mockPastProposals,
    });

    setVoting({
      votingPower: '500.00',
      delegatedFrom: [],
      delegatedTo: 'Self',
      votingHistory: mockVotingHistory,
    });

    // Process Voting Power if available
    if (votesData !== undefined) {
      const votingPower = (votesData as bigint).toString();
      setVoting(prev => ({ ...prev, votingPower }));
    }

    // Process Delegation Info if available
    if (delegationData !== undefined && Array.isArray(delegationData) && delegationData.length === 3) {
      const [delegatedTo, delegatedFrom, delegatedPower] = delegationData as [string, string[], bigint];
      
      // Format delegated to address
      const formattedDelegatedTo = delegatedTo === address ? 'Self' : `${delegatedTo.substring(0, 6)}...${delegatedTo.substring(delegatedTo.length - 4)}`;
      
      // Format delegated from addresses
      const formattedDelegatedFrom = delegatedFrom.map(addr => 
        `${addr.substring(0, 6)}...${addr.substring(addr.length - 4)}`
      );
      
      setVoting(prev => ({ 
        ...prev, 
        delegatedTo: formattedDelegatedTo,
        delegatedFrom: formattedDelegatedFrom,
      }));
      
      // If there are delegations from others, add them to activeDelegations
      if (delegatedFrom.length > 0) {
        const activeDelegations = delegatedFrom.map((addr, index) => ({
          address: `${addr.substring(0, 6)}...${addr.substring(addr.length - 4)}`,
          power: (10 + index * 5).toFixed(2), // Mock power values
        }));
        
        setDelegation(prev => ({ ...prev, activeDelegations }));
      }
    }

    // Process Voting History if available
    if (votingHistoryData !== undefined && Array.isArray(votingHistoryData) && votingHistoryData.length === 3) {
      const [proposalIds, votes, timestamps] = votingHistoryData as [bigint[], number[], bigint[]];
      
      if (proposalIds.length > 0) {
        const votingHistory = proposalIds.map((id, index) => ({
          proposalId: `PROP-${id.toString()}`,
          vote: getVoteTypeName(votes[index]),
          date: new Date(Number(timestamps[index]) * 1000).toLocaleDateString(),
        }));
        
        setVoting(prev => ({ ...prev, votingHistory }));
      }
    }

    setIsLoading(false);
  }, [
    isConnected, 
    address, 
    votesData, 
    delegationData, 
    activeProposalIds, 
    votingHistoryData
  ]);

  const value = {
    proposals,
    voting,
    delegation,
    refreshData,
    isLoading,
  };

  return (
    <GovernanceDataContext.Provider value={value}>
      {children}
    </GovernanceDataContext.Provider>
  );

  
}

// Hook to use the context
export function useGovernanceData() {
  const context = useContext(GovernanceDataContext);
  if (context === undefined) {
    throw new Error('useGovernanceData must be used within a GovernanceDataProvider');
  }
  return context;
}
