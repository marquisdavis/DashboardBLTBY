'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useAccount, useReadContract } from 'wagmi';
import { formatUnits } from 'viem';

// Define contract ABIs
const BLTBY_ABI = [
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
    name: 'totalSupply',
    inputs: [],
    outputs: [{ name: 'supply', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
];

const EQTBLT_ABI = [
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
    name: 'getVestingSchedule',
    inputs: [{ name: '_owner', type: 'address' }],
    outputs: [
      { name: 'startTime', type: 'uint256' },
      { name: 'endTime', type: 'uint256' },
      { name: 'totalAmount', type: 'uint256' },
      { name: 'vestedAmount', type: 'uint256' },
    ],
    stateMutability: 'view',
    type: 'function',
  },
];

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

const MEMBERSHIP_NFT_ABI = [
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
    name: 'tokenOfOwnerByIndex',
    inputs: [
      { name: '_owner', type: 'address' },
      { name: '_index', type: 'uint256' },
    ],
    outputs: [{ name: 'tokenId', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    constant: true,
    name: 'getMembershipDetails',
    inputs: [{ name: '_tokenId', type: 'uint256' }],
    outputs: [
      { name: 'rank', type: 'uint8' },
      { name: 'level', type: 'uint8' },
      { name: 'joinDate', type: 'uint256' },
      { name: 'votingPower', type: 'uint8' },
    ],
    stateMutability: 'view',
    type: 'function',
  },
];

// Contract addresses (these would be updated with actual deployed addresses)
const CONTRACT_ADDRESSES = {
  BLTBY: '0x1234567890123456789012345678901234567890', // Placeholder
  EQTBLT: '0x2345678901234567890123456789012345678901', // Placeholder
  GOVERNANCE_TOKEN: '0x3456789012345678901234567890123456789012', // Placeholder
  MEMBERSHIP_NFT: '0x4567890123456789012345678901234567890123', // Placeholder
  FRAMER_TOKEN: '0x5678901234567890123456789012345678901234', // Placeholder
  GUILD_MEMBERSHIP: '0x6789012345678901234567890123456789012345', // Placeholder
  LEADERSHIP_NFT: '0x7890123456789012345678901234567890123456', // Placeholder
};

// Define the context type
type TokenDataContextType = {
  bltbyBalance: string | null;
  eqtbltBalance: string | null;
  governanceBalance: string | null;
  votingPower: string | null;
  vestingInfo: {
    startDate: string | null;
    endDate: string | null;
    vestedPercentage: number | null;
    vestedAmount: string | null;
    totalAmount: string | null;
  };
  membershipInfo: {
    hasNFT: boolean;
    rank: string | null;
    level: number | null;
    joinDate: string | null;
    votingPowerBoost: string | null;
  };
  refreshData: () => void;
  isLoading: boolean;
};

// Create the context
const TokenDataContext = createContext<TokenDataContextType | undefined>(undefined);

// Provider component
export function TokenDataProvider({ children }: { children: ReactNode }) {
  const { address, isConnected } = useAccount();
  const [isLoading, setIsLoading] = useState(true);
  
  // Token balances
  const [bltbyBalance, setBltbyBalance] = useState<string | null>(null);
  const [eqtbltBalance, setEqtbltBalance] = useState<string | null>(null);
  const [governanceBalance, setGovernanceBalance] = useState<string | null>(null);
  const [votingPower, setVotingPower] = useState<string | null>(null);
  
  // Vesting information
  const [vestingInfo, setVestingInfo] = useState({
    startDate: null,
    endDate: null,
    vestedPercentage: null,
    vestedAmount: null,
    totalAmount: null,
  });
  
  // Membership information
  const [membershipInfo, setMembershipInfo] = useState({
    hasNFT: false,
    rank: null,
    level: null,
    joinDate: null,
    votingPowerBoost: null,
  });

  // BLTBY Balance
  const { data: bltbyData } = useReadContract({
    address: CONTRACT_ADDRESSES.BLTBY as `0x${string}`,
    abi: BLTBY_ABI,
    functionName: 'balanceOf',
    args: address ? [address] : undefined,
    query: {
      enabled: !!address && isConnected,
    },
  });

  // EQTBLT Balance
  const { data: eqtbltData } = useReadContract({
    address: CONTRACT_ADDRESSES.EQTBLT as `0x${string}`,
    abi: EQTBLT_ABI,
    functionName: 'balanceOf',
    args: address ? [address] : undefined,
    query: {
      enabled: !!address && isConnected,
    },
  });

  // Governance Token Balance
  const { data: governanceData } = useReadContract({
    address: CONTRACT_ADDRESSES.GOVERNANCE_TOKEN as `0x${string}`,
    abi: GOVERNANCE_TOKEN_ABI,
    functionName: 'balanceOf',
    args: address ? [address] : undefined,
    query: {
      enabled: !!address && isConnected,
    },
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

  // Vesting Schedule
  const { data: vestingData } = useReadContract({
    address: CONTRACT_ADDRESSES.EQTBLT as `0x${string}`,
    abi: EQTBLT_ABI,
    functionName: 'getVestingSchedule',
    args: address ? [address] : undefined,
    query: {
      enabled: !!address && isConnected,
    },
  });

  // Membership NFT Balance
  const { data: membershipBalance } = useReadContract({
    address: CONTRACT_ADDRESSES.MEMBERSHIP_NFT as `0x${string}`,
    abi: MEMBERSHIP_NFT_ABI,
    functionName: 'balanceOf',
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
    if (!isConnected || !address) {
      setIsLoading(false);
      return;
    }

    // Process BLTBY balance
    if (bltbyData !== undefined) {
      setBltbyBalance(formatUnits(bltbyData as bigint, 18));
    }

    // Process EQTBLT balance
    if (eqtbltData !== undefined) {
      setEqtbltBalance(formatUnits(eqtbltData as bigint, 18));
    }

    // Process Governance Token balance
    if (governanceData !== undefined) {
      setGovernanceBalance(formatUnits(governanceData as bigint, 18));
    }

    // Process Voting Power
    if (votesData !== undefined) {
      setVotingPower(formatUnits(votesData as bigint, 18));
    }

    // Process Vesting Schedule
    if (vestingData !== undefined && Array.isArray(vestingData) && vestingData.length === 4) {
      const [startTime, endTime, totalAmount, vestedAmount] = vestingData as [bigint, bigint, bigint, bigint];
      
      const startDate = new Date(Number(startTime) * 1000).toLocaleDateString();
      const endDate = new Date(Number(endTime) * 1000).toLocaleDateString();
      
      const totalAmountFormatted = formatUnits(totalAmount, 18);
      const vestedAmountFormatted = formatUnits(vestedAmount, 18);
      
      const vestedPercentage = totalAmount > 0n 
        ? Number((vestedAmount * 100n) / totalAmount)
        : 0;
      
      setVestingInfo({
        startDate,
        endDate,
        vestedPercentage,
        vestedAmount: vestedAmountFormatted,
        totalAmount: totalAmountFormatted,
      });
    }

    // Process Membership NFT
    if (membershipBalance !== undefined) {
      const hasNFT = (membershipBalance as bigint) > 0n;
      setMembershipInfo(prev => ({ ...prev, hasNFT }));
      
      // If user has an NFT, we would fetch the token ID and then the membership details
      // This would require additional contract calls that would be implemented in a real application
      if (hasNFT) {
        // Mock data for now
        setMembershipInfo({
          hasNFT: true,
          rank: 'Builder',
          level: 5,
          joinDate: 'Jan 15, 2025',
          votingPowerBoost: 'Enhanced',
        });
      }
    }

    setIsLoading(false);
  }, [
    isConnected, 
    address, 
    bltbyData, 
    eqtbltData, 
    governanceData, 
    votesData, 
    vestingData, 
    membershipBalance
  ]);

  const value = {
    bltbyBalance,
    eqtbltBalance,
    governanceBalance,
    votingPower,
    vestingInfo,
    membershipInfo,
    refreshData,
    isLoading,
  };

  return (
    <TokenDataContext.Provider value={value}>
      {children}
    </TokenDataContext.Provider>
  );
}

// Hook to use the context
export function useTokenData() {
  const context = useContext(TokenDataContext);
  if (context === undefined) {
    throw new Error('useTokenData must be used within a TokenDataProvider');
  }
  return context;
}
