'use client';

import { useEffect, useState } from 'react';
import DashboardLayout from '@/components/layout/dashboard-layout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAccount } from 'wagmi';
import { useTokenData } from '@/hooks/useTokenData';
import { useNFTData } from '@/hooks/useNFTData';
import { useGovernanceData } from '@/hooks/useGovernanceData';

export default function Home() {
  const { isConnected } = useAccount();
  const { bltbyBalance, eqtbltBalance, governanceBalance, isLoading: tokenLoading } = useTokenData();
  const { membershipNFT, isLoading: nftLoading } = useNFTData();
  const { proposals, voting, isLoading: governanceLoading } = useGovernanceData();
  
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Set loading to false when all data is loaded
    if (!tokenLoading && !nftLoading && !governanceLoading) {
      setIsLoading(false);
    }
  }, [tokenLoading, nftLoading, governanceLoading]);

  return (
    <DashboardLayout title="Dashboard">
      {isConnected ? (
        <div className="w-full space-y-6">
          {isLoading ? (
            <Card className="p-6 text-center">
              <p className="text-gray-500">Loading dashboard data...</p>
            </Card>
          ) : (
            <>
              {/* Welcome Card */}
              <Card className="p-6">
                <h2 className="text-2xl font-bold mb-2">Welcome to Built By DAO</h2>
                <p className="text-gray-600 mb-4">
                  Your decentralized platform for community-driven development and governance.
                </p>
                {membershipNFT.hasNFT && (
                  <div className="bg-indigo-50 p-3 rounded-lg">
                    <p className="text-indigo-800">
                      You are a <span className="font-semibold">{membershipNFT.rank} (Level {membershipNFT.level})</span> member
                    </p>
                  </div>
                )}
              </Card>

              {/* Token Overview */}
              <Card className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-bold">Token Overview</h2>
                  <Button variant="outline" size="sm" onClick={() => window.location.href = '/tokens'}>
                    View All Tokens
                  </Button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="border rounded-lg p-4">
                    <h3 className="text-sm text-gray-500 mb-1">BLTBY Balance</h3>
                    <p className="text-2xl font-bold">{bltbyBalance || '0.00'}</p>
                  </div>
                  <div className="border rounded-lg p-4">
                    <h3 className="text-sm text-gray-500 mb-1">EQTBLT Balance</h3>
                    <p className="text-2xl font-bold">{eqtbltBalance || '0.00'}</p>
                  </div>
                  <div className="border rounded-lg p-4">
                    <h3 className="text-sm text-gray-500 mb-1">Governance Token</h3>
                    <p className="text-2xl font-bold">{governanceBalance || '0.00'}</p>
                  </div>
                </div>
              </Card>

              {/* Active Proposals */}
              <Card className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-bold">Active Proposals</h2>
                  <Button variant="outline" size="sm" onClick={() => window.location.href = '/governance'}>
                    View All Proposals
                  </Button>
                </div>
                {proposals.active.length > 0 ? (
                  <div className="space-y-4">
                    {proposals.active.slice(0, 2).map((proposal) => (
                      <div key={proposal.id} className="border rounded-lg p-4">
                        <div className="flex justify-between">
                          <h3 className="font-semibold">{proposal.title}</h3>
                          <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                            {proposal.status}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 mt-1 mb-2 line-clamp-2">{proposal.description}</p>
                        <div className="text-xs text-gray-500">Ends: {proposal.endDate}</div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500">No active proposals at this time.</p>
                )}
              </Card>

              {/* NFT Overview */}
              <Card className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-bold">Your NFTs</h2>
                  <Button variant="outline" size="sm" onClick={() => window.location.href = '/nfts'}>
                    View All NFTs
                  </Button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="border rounded-lg p-4">
                    <h3 className="text-sm text-gray-500 mb-1">Membership</h3>
                    <p className="font-medium">{membershipNFT.hasNFT ? membershipNFT.rank : 'None'}</p>
                  </div>
                  <div className="border rounded-lg p-4">
                    <h3 className="text-sm text-gray-500 mb-1">Framer Status</h3>
                    <p className="font-medium">{membershipNFT.hasNFT ? 'Active' : 'None'}</p>
                  </div>
                  <div className="border rounded-lg p-4">
                    <h3 className="text-sm text-gray-500 mb-1">Guild Memberships</h3>
                    <p className="font-medium">2 Active Guilds</p>
                  </div>
                  <div className="border rounded-lg p-4">
                    <h3 className="text-sm text-gray-500 mb-1">Leadership</h3>
                    <p className="font-medium">Contributor</p>
                  </div>
                </div>
              </Card>

              {/* Voting Power */}
              <Card className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-bold">Governance</h2>
                  <Button variant="outline" size="sm" onClick={() => window.location.href = '/governance'}>
                    View Governance
                  </Button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="border rounded-lg p-4">
                    <h3 className="text-sm text-gray-500 mb-1">Voting Power</h3>
                    <p className="text-2xl font-bold">{voting.votingPower || '0.00'}</p>
                  </div>
                  <div className="border rounded-lg p-4">
                    <h3 className="text-sm text-gray-500 mb-1">Delegated To</h3>
                    <p className="font-medium">{voting.delegatedTo}</p>
                  </div>
                  <div className="border rounded-lg p-4">
                    <h3 className="text-sm text-gray-500 mb-1">Recent Votes</h3>
                    <p className="font-medium">{voting.votingHistory.length} votes</p>
                  </div>
                </div>
              </Card>
            </>
          )}
        </div>
      ) : (
        <div className="text-center py-12">
          <h2 className="text-xl font-semibold mb-2">Connect your wallet</h2>
          <p className="text-gray-500 mb-4">Please connect your wallet to access the Built By DAO dashboard</p>
        </div>
      )}
    </DashboardLayout>
  );
}
