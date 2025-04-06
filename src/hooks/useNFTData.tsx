'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useAccount, useReadContract } from 'wagmi';

// Define contract ABIs
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

const FRAMER_TOKEN_ABI = [
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
    name: 'getFramerDetails',
    inputs: [{ name: '_tokenId', type: 'uint256' }],
    outputs: [
      { name: 'type', type: 'uint8' },
      { name: 'series', type: 'uint8' },
      { name: 'issuedDate', type: 'uint256' },
      { name: 'rarity', type: 'uint8' },
    ],
    stateMutability: 'view',
    type: 'function',
  },
];

const GUILD_MEMBERSHIP_ABI = [
  {
    constant: true,
    name: 'balanceOf',
    inputs: [
      { name: '_owner', type: 'address' },
      { name: '_id', type: 'uint256' },
    ],
    outputs: [{ name: 'balance', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    constant: true,
    name: 'getGuildDetails',
    inputs: [{ name: '_id', type: 'uint256' }],
    outputs: [
      { name: 'name', type: 'string' },
      { name: 'joinDate', type: 'uint256' },
      { name: 'status', type: 'uint8' },
      { name: 'projects', type: 'uint8' },
    ],
    stateMutability: 'view',
    type: 'function',
  },
];

const LEADERSHIP_NFT_ABI = [
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
    name: 'getLeadershipDetails',
    inputs: [{ name: '_tokenId', type: 'uint256' }],
    outputs: [
      { name: 'type', type: 'uint8' },
      { name: 'awardedDate', type: 'uint256' },
      { name: 'status', type: 'uint8' },
      { name: 'perks', type: 'uint8' },
    ],
    stateMutability: 'view',
    type: 'function',
  },
];

// Contract addresses (these would be updated with actual deployed addresses)
const CONTRACT_ADDRESSES = {
  MEMBERSHIP_NFT: '0x4567890123456789012345678901234567890123', // Placeholder
  FRAMER_TOKEN: '0x5678901234567890123456789012345678901234', // Placeholder
  GUILD_MEMBERSHIP: '0x6789012345678901234567890123456789012345', // Placeholder
  LEADERSHIP_NFT: '0x7890123456789012345678901234567890123456', // Placeholder
};

// Guild IDs
const GUILD_IDS = {
  DEVELOPMENT: 1,
  DESIGN: 2,
  MARKETING: 3,
  COMMUNITY: 4,
};

// Define the context type
type NFTDataContextType = {
  membershipNFT: {
    hasNFT: boolean;
    tokenId: string | null;
    rank: string | null;
    level: number | null;
    joinDate: string | null;
    votingPowerBoost: string | null;
    progressToNextRank: number | null;
  };
  framerNFT: {
    hasNFT: boolean;
    tokenId: string | null;
    type: string | null;
    series: number | null;
    issuedDate: string | null;
    rarity: string | null;
  };
  guildMemberships: {
    development: {
      isMember: boolean;
      joinDate: string | null;
      status: string | null;
      projects: number | null;
    };
    design: {
      isMember: boolean;
      joinDate: string | null;
      status: string | null;
      projects: number | null;
    };
  };
  leadershipNFT: {
    hasNFT: boolean;
    tokenId: string | null;
    type: string | null;
    awardedDate: string | null;
    status: string | null;
    perks: string | null;
  };
  refreshData: () => void;
  isLoading: boolean;
};

// Create the context
const NFTDataContext = createContext<NFTDataContextType | undefined>(undefined);

// Helper function to convert rank number to string
function getRankName(rank: number): string {
  const ranks = [
    'Novice',
    'Apprentice',
    'Journeyman',
    'Craftsman',
    'Builder',
    'Creator',
    'Master',
    'Grandmaster',
    'Architect',
    'Visionary'
  ];
  return ranks[rank] || 'Unknown';
}

// Helper function to convert status number to string
function getStatusName(status: number): string {
  const statuses = ['Inactive', 'Active', 'Distinguished', 'Elite'];
  return statuses[status] || 'Unknown';
}

// Helper function to convert rarity number to string
function getRarityName(rarity: number): string {
  const rarities = ['Common', 'Uncommon', 'Rare', 'Epic', 'Legendary', 'Mythic'];
  return rarities[rarity] || 'Unknown';
}

// Helper function to convert type number to string for Framer NFT
function getFramerTypeName(type: number): string {
  const types = ['Genesis', 'Early Adopter', 'Community Builder', 'Innovator'];
  return types[type] || 'Unknown';
}

// Helper function to convert type number to string for Leadership NFT
function getLeadershipTypeName(type: number): string {
  const types = ['Contributor', 'Guild Leader', 'Council Member', 'Executive'];
  return types[type] || 'Unknown';
}

// Helper function to convert perks number to string
function getPerksName(perks: number): string {
  const perksNames = [
    'Basic',
    'Early Governance Access',
    'Enhanced Voting Power',
    'Priority Staking',
    'All Perks'
  ];
  return perksNames[perks] || 'Unknown';
}

// Provider component
export function NFTDataProvider({ children }: { children: ReactNode }) {
  const { address, isConnected } = useAccount();
  const [isLoading, setIsLoading] = useState(true);
  
  // Membership NFT state
  const [membershipNFT, setMembershipNFT] = useState({
    hasNFT: false,
    tokenId: null,
    rank: null,
    level: null,
    joinDate: null,
    votingPowerBoost: null,
    progressToNextRank: null,
  });
  
  // Framer NFT state
  const [framerNFT, setFramerNFT] = useState({
    hasNFT: false,
    tokenId: null,
    type: null,
    series: null,
    issuedDate: null,
    rarity: null,
  });
  
  // Guild Memberships state
  const [guildMemberships, setGuildMemberships] = useState({
    development: {
      isMember: false,
      joinDate: null,
      status: null,
      projects: null,
    },
    design: {
      isMember: false,
      joinDate: null,
      status: null,
      projects: null,
    },
  });
  
  // Leadership NFT state
  const [leadershipNFT, setLeadershipNFT] = useState({
    hasNFT: false,
    tokenId: null,
    type: null,
    awardedDate: null,
    status: null,
    perks: null,
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

  // Framer NFT Balance
  const { data: framerBalance } = useReadContract({
    address: CONTRACT_ADDRESSES.FRAMER_TOKEN as `0x${string}`,
    abi: FRAMER_TOKEN_ABI,
    functionName: 'balanceOf',
    args: address ? [address] : undefined,
    query: {
      enabled: !!address && isConnected,
    },
  });

  // Development Guild Membership
  const { data: developmentGuildBalance } = useReadContract({
    address: CONTRACT_ADDRESSES.GUILD_MEMBERSHIP as `0x${string}`,
    abi: GUILD_MEMBERSHIP_ABI,
    functionName: 'balanceOf',
    args: address ? [address, BigInt(GUILD_IDS.DEVELOPMENT)] : undefined,
    query: {
      enabled: !!address && isConnected,
    },
  });

  // Design Guild Membership
  const { data: designGuildBalance } = useReadContract({
    address: CONTRACT_ADDRESSES.GUILD_MEMBERSHIP as `0x${string}`,
    abi: GUILD_MEMBERSHIP_ABI,
    functionName: 'balanceOf',
    args: address ? [address, BigInt(GUILD_IDS.DESIGN)] : undefined,
    query: {
      enabled: !!address && isConnected,
    },
  });

  // Leadership NFT Balance
  const { data: leadershipBalance } = useReadContract({
    address: CONTRACT_ADDRESSES.LEADERSHIP_NFT as `0x${string}`,
    abi: LEADERSHIP_NFT_ABI,
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

    // Process Membership NFT
    if (membershipBalance !== undefined) {
      const hasNFT = (membershipBalance as bigint) > 0n;
      
      if (hasNFT) {
        // In a real implementation, we would fetch the token ID and then the membership details
        // For now, we'll use mock data
        setMembershipNFT({
          hasNFT: true,
          tokenId: '1',
          rank: 'Builder',
          level: 5,
          joinDate: 'Jan 15, 2025',
          votingPowerBoost: 'Enhanced',
          progressToNextRank: 65,
        });
      } else {
        setMembershipNFT({
          hasNFT: false,
          tokenId: null,
          rank: null,
          level: null,
          joinDate: null,
          votingPowerBoost: null,
          progressToNextRank: null,
        });
      }
    }

    // Process Framer NFT
    if (framerBalance !== undefined) {
      const hasNFT = (framerBalance as bigint) > 0n;
      
      if (hasNFT) {
        // Mock data for now
        setFramerNFT({
          hasNFT: true,
          tokenId: '2',
          type: 'Genesis',
          series: 1,
          issuedDate: 'Dec 2024',
          rarity: 'Legendary',
        });
      } else {
        setFramerNFT({
          hasNFT: false,
          tokenId: null,
          type: null,
          series: null,
          issuedDate: null,
          rarity: null,
        });
      }
    }

    // Process Development Guild Membership
    if (developmentGuildBalance !== undefined) {
      const isMember = (developmentGuildBalance as bigint) > 0n;
      
      if (isMember) {
        // Mock data for now
        setGuildMemberships(prev => ({
          ...prev,
          development: {
            isMember: true,
            joinDate: 'Feb 2025',
            status: 'Active',
            projects: 3,
          }
        }));
      } else {
        setGuildMemberships(prev => ({
          ...prev,
          development: {
            isMember: false,
            joinDate: null,
            status: null,
            projects: null,
          }
        }));
      }
    }

    // Process Design Guild Membership
    if (designGuildBalance !== undefined) {
      const isMember = (designGuildBalance as bigint) > 0n;
      
      if (isMember) {
        // Mock data for now
        setGuildMemberships(prev => ({
          ...prev,
          design: {
            isMember: true,
            joinDate: 'Mar 2025',
            status: 'Active',
            projects: 1,
          }
        }));
      } else {
        setGuildMemberships(prev => ({
          ...prev,
          design: {
            isMember: false,
            joinDate: null,
            status: null,
            projects: null,
          }
        }));
      }
    }

    // Process Leadership NFT
    if (leadershipBalance !== undefined) {
      const hasNFT = (leadershipBalance as bigint) > 0n;
      
      if (hasNFT) {
        // Mock data for now
        setLeadershipNFT({
          hasNFT: true,
          tokenId: '5',
          type: 'Contributor',
          awardedDate: 'Mar 2025',
          status: 'Active',
          perks: 'Early Governance Access',
        });
      } else {
        setLeadershipNFT({
          hasNFT: false,
          tokenId: null,
          type: null,
          awardedDate: null,
          status: null,
          perks: null,
        });
      }
    }

    setIsLoading(false);
  }, [
    isConnected, 
    address, 
    membershipBalance, 
    framerBalance, 
    developmentGuildBalance, 
    designGuildBalance, 
    leadershipBalance
  ]);

  const value = {
    membershipNFT,
    framerNFT,
    guildMemberships,
    leadershipNFT,
    refreshData,
    isLoading,
  };

  return (
    <NFTDataContext.Provider value={value}>
      {children}
    </NFTDataContext.Provider>
  );
}

// Hook to use the context
export function useNFTData() {
  const context = useContext(NFTDataContext);
  if (context === undefined) {
    throw new Error('useNFTData must be used within a NFTDataProvider');
  }
  return context;
}
