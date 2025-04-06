'use client';

import DashboardLayout from '@/components/layout/dashboard-layout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAccount } from 'wagmi';
import { useState } from 'react';

export default function NFTsPage() {
  const { isConnected } = useAccount();
  const [activeTab, setActiveTab] = useState('membership');

  // Mock data for NFTs
  const nftCategories = {
    membership: {
      title: 'Membership NFTs',
      description: 'Your Built By DAO membership rank and status',
      nfts: [
        {
          id: 1,
          name: 'Builder Rank',
          image: '/placeholder-nft.png',
          description: 'Level 5 membership in the Built By DAO ecosystem',
          attributes: [
            { trait: 'Rank', value: 'Builder' },
            { trait: 'Level', value: '5' },
            { trait: 'Joined', value: 'Jan 2025' },
            { trait: 'Voting Power', value: 'Enhanced' }
          ]
        }
      ]
    },
    framer: {
      title: 'Framer NFTs',
      description: 'Commemorative NFTs for founding members',
      nfts: [
        {
          id: 2,
          name: 'Genesis Framer',
          image: '/placeholder-nft.png',
          description: 'Awarded to founding members who helped frame the DAO',
          attributes: [
            { trait: 'Type', value: 'Genesis' },
            { trait: 'Series', value: '1' },
            { trait: 'Issued', value: 'Dec 2024' },
            { trait: 'Rarity', value: 'Legendary' }
          ]
        }
      ]
    },
    guild: {
      title: 'Guild Memberships',
      description: 'Your memberships in various DAO guilds',
      nfts: [
        {
          id: 3,
          name: 'Development Guild',
          image: '/placeholder-nft.png',
          description: 'Member of the Development Guild',
          attributes: [
            { trait: 'Guild', value: 'Development' },
            { trait: 'Joined', value: 'Feb 2025' },
            { trait: 'Status', value: 'Active' },
            { trait: 'Projects', value: '3' }
          ]
        },
        {
          id: 4,
          name: 'Design Guild',
          image: '/placeholder-nft.png',
          description: 'Member of the Design Guild',
          attributes: [
            { trait: 'Guild', value: 'Design' },
            { trait: 'Joined', value: 'Mar 2025' },
            { trait: 'Status', value: 'Active' },
            { trait: 'Projects', value: '1' }
          ]
        }
      ]
    },
    leadership: {
      title: 'Leadership NFTs',
      description: 'Special NFTs for DAO leaders and contributors',
      nfts: [
        {
          id: 5,
          name: 'Contributor Badge',
          image: '/placeholder-nft.png',
          description: 'Awarded for significant contributions to the DAO',
          attributes: [
            { trait: 'Type', value: 'Contributor' },
            { trait: 'Awarded', value: 'Mar 2025' },
            { trait: 'Status', value: 'Active' },
            { trait: 'Perks', value: 'Early Governance Access' }
          ]
        }
      ]
    }
  };

  return (
    <DashboardLayout title="NFTs">
      {isConnected ? (
        <div className="w-full space-y-6">
          {/* NFT Navigation */}
          <div className="flex flex-wrap gap-2 border-b pb-2">
            <Button 
              variant={activeTab === 'membership' ? 'default' : 'outline'}
              onClick={() => setActiveTab('membership')}
            >
              Membership
            </Button>
            <Button 
              variant={activeTab === 'framer' ? 'default' : 'outline'}
              onClick={() => setActiveTab('framer')}
            >
              Framer
            </Button>
            <Button 
              variant={activeTab === 'guild' ? 'default' : 'outline'}
              onClick={() => setActiveTab('guild')}
            >
              Guild
            </Button>
            <Button 
              variant={activeTab === 'leadership' ? 'default' : 'outline'}
              onClick={() => setActiveTab('leadership')}
            >
              Leadership
            </Button>
          </div>

          {/* NFT Category Overview */}
          <Card className="p-6">
            <h2 className="text-2xl font-bold mb-2">{nftCategories[activeTab].title}</h2>
            <p className="text-gray-500 mb-4">{nftCategories[activeTab].description}</p>
          </Card>

          {/* NFT Gallery */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {nftCategories[activeTab].nfts.length > 0 ? (
              nftCategories[activeTab].nfts.map((nft) => (
                <Card key={nft.id} className="overflow-hidden">
                  <div className="aspect-square bg-gray-100 flex items-center justify-center">
                    {/* Placeholder for NFT image */}
                    <div className="w-full h-full bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center">
                      <span className="text-2xl font-bold text-indigo-300">{nft.name.substring(0, 1)}</span>
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="text-lg font-semibold">{nft.name}</h3>
                    <p className="text-sm text-gray-500 mb-4">{nft.description}</p>
                    
                    <div className="space-y-2">
                      <h4 className="text-xs font-medium text-gray-500 uppercase">Attributes</h4>
                      <div className="grid grid-cols-2 gap-2">
                        {nft.attributes.map((attr, index) => (
                          <div key={index} className="bg-gray-50 p-2 rounded">
                            <p className="text-xs text-gray-500">{attr.trait}</p>
                            <p className="text-sm font-medium">{attr.value}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </Card>
              ))
            ) : (
              <div className="col-span-full text-center py-12">
                <p className="text-gray-500">You don't have any {activeTab} NFTs yet</p>
                {activeTab === 'guild' && (
                  <Button className="mt-4">Join a Guild</Button>
                )}
              </div>
            )}
          </div>

          {/* Membership Rank Progression (only for membership tab) */}
          {activeTab === 'membership' && (
            <Card className="p-6">
              <h3 className="text-xl font-bold mb-4">Rank Progression</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500">Current Rank</span>
                  <span className="font-medium">Builder (Level 5)</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500">Next Rank</span>
                  <span className="font-medium">Creator (Level 6)</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500">Progress</span>
                  <span className="font-medium">65%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div className="bg-indigo-600 h-2.5 rounded-full" style={{ width: '65%' }}></div>
                </div>
                <div className="pt-2">
                  <h4 className="text-sm font-medium mb-2">Requirements for Next Rank:</h4>
                  <ul className="text-sm text-gray-600 space-y-1 list-disc pl-5">
                    <li>Complete 2 more DAO projects</li>
                    <li>Participate in 3 more governance votes</li>
                    <li>Maintain active status for 30 more days</li>
                  </ul>
                </div>
              </div>
            </Card>
          )}

          {/* Guild Benefits (only for guild tab) */}
          {activeTab === 'guild' && nftCategories[activeTab].nfts.length > 0 && (
            <Card className="p-6">
              <h3 className="text-xl font-bold mb-4">Guild Benefits</h3>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="border rounded-lg p-4">
                    <h4 className="font-medium mb-2">Development Guild</h4>
                    <ul className="text-sm text-gray-600 space-y-1 list-disc pl-5">
                      <li>Access to developer resources and tools</li>
                      <li>Priority for technical bounties</li>
                      <li>Specialized training workshops</li>
                      <li>Enhanced EQTBLT earning rate</li>
                    </ul>
                  </div>
                  <div className="border rounded-lg p-4">
                    <h4 className="font-medium mb-2">Design Guild</h4>
                    <ul className="text-sm text-gray-600 space-y-1 list-disc pl-5">
                      <li>Access to premium design assets</li>
                      <li>Priority for design bounties</li>
                      <li>Specialized training workshops</li>
                      <li>Enhanced EQTBLT earning rate</li>
                    </ul>
                  </div>
                </div>
                <Button className="w-full">View Guild Dashboard</Button>
              </div>
            </Card>
          )}

          {/* Leadership Perks (only for leadership tab) */}
          {activeTab === 'leadership' && nftCategories[activeTab].nfts.length > 0 && (
            <Card className="p-6">
              <h3 className="text-xl font-bold mb-4">Leadership Perks</h3>
              <div className="space-y-4">
                <div className="border rounded-lg p-4">
                  <h4 className="font-medium mb-2">Contributor Benefits</h4>
                  <ul className="text-sm text-gray-600 space-y-1 list-disc pl-5">
                    <li>Early access to governance proposals</li>
                    <li>Enhanced voting power (1.5x)</li>
                    <li>Priority for staking rewards</li>
                    <li>Access to contributor-only events</li>
                    <li>Special badge displayed in DAO forums</li>
                  </ul>
                </div>
                <Button className="w-full">View Leadership Dashboard</Button>
              </div>
            </Card>
          )}
        </div>
      ) : (
        <div className="text-center py-12">
          <h2 className="text-xl font-semibold mb-2">Connect your wallet</h2>
          <p className="text-gray-500 mb-4">Please connect your wallet to view your NFTs</p>
        </div>
      )}
    </DashboardLayout>
  );
}
