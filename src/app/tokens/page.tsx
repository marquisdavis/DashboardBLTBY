'use client';

import { useState } from 'react';
import DashboardLayout from '@/components/layout/dashboard-layout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAccount } from 'wagmi';
import * as Tabs from '@radix-ui/react-tabs';

// Mock data for tokens
const mockTokenData = {
  bltby: {
    balance: '15,000.00',
    price: '$0.42',
    marketCap: '$42,000,000',
    circulatingSupply: '100,000,000',
    totalSupply: '250,000,000',
    transactions: [
      { type: 'Received', amount: '5,000.00', from: '0x1234...5678', date: 'Mar 28, 2025' },
      { type: 'Staked', amount: '2,500.00', to: 'Staking Contract', date: 'Mar 25, 2025' },
      { type: 'Sent', amount: '1,000.00', to: '0xabcd...ef01', date: 'Mar 20, 2025' },
    ]
  },
  eqtblt: {
    balance: '25,000.00',
    price: '$0.18',
    marketCap: '$18,000,000',
    circulatingSupply: '100,000,000',
    totalSupply: '250,000,000',
    vestingInfo: {
      totalVested: '50,000.00',
      vestedAmount: '25,000.00',
      nextUnlock: 'Apr 15, 2025',
      percentComplete: 50
    },
    transactions: [
      { type: 'Vesting Unlock', amount: '5,000.00', from: 'Vesting Contract', date: 'Mar 15, 2025' },
      { type: 'Received', amount: '20,000.00', from: 'Initial Distribution', date: 'Dec 15, 2024' },
    ]
  },
  governance: {
    balance: '10,000.00',
    votingPower: '12,500.00',
    delegatedTo: 'Self',
    delegatedFrom: [
      { address: '0x7890...1234', amount: '2,500.00' }
    ],
    transactions: [
      { type: 'Received Delegation', amount: '2,500.00', from: '0x7890...1234', date: 'Mar 10, 2025' },
      { type: 'Received', amount: '10,000.00', from: 'Governance Distribution', date: 'Feb 01, 2025' },
    ]
  }
};

export default function TokensPage() {
  const { isConnected } = useAccount();
  const [activeTab, setActiveTab] = useState('bltby');

  return (
    <DashboardLayout title="Tokens">
      {isConnected ? (
        <div className="w-full space-y-6">
          <Tabs.Root defaultValue="bltby" onValueChange={setActiveTab}>
            <Tabs.List className="flex border-b mb-4">
              <Tabs.Trigger 
                value="bltby" 
                className={`px-4 py-2 ${activeTab === 'bltby' ? 'border-b-2 border-blue-500 font-semibold' : 'text-gray-500'}`}
              >
                BLTBY Token
              </Tabs.Trigger>
              <Tabs.Trigger 
                value="eqtblt" 
                className={`px-4 py-2 ${activeTab === 'eqtblt' ? 'border-b-2 border-blue-500 font-semibold' : 'text-gray-500'}`}
              >
                EQTBLT Token
              </Tabs.Trigger>
              <Tabs.Trigger 
                value="governance" 
                className={`px-4 py-2 ${activeTab === 'governance' ? 'border-b-2 border-blue-500 font-semibold' : 'text-gray-500'}`}
              >
                Governance Token
              </Tabs.Trigger>
            </Tabs.List>
            
            {/* BLTBY Token Tab */}
            <Tabs.Content value="bltby" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card className="p-4">
                  <h3 className="text-sm text-gray-500 mb-1">Balance</h3>
                  <p className="text-2xl font-bold">{mockTokenData.bltby.balance}</p>
                  <p className="text-sm text-gray-500 mt-1">≈ ${parseFloat(mockTokenData.bltby.balance.replace(/,/g, '')) * 0.42}</p>
                </Card>
                <Card className="p-4">
                  <h3 className="text-sm text-gray-500 mb-1">Price</h3>
                  <p className="text-2xl font-bold">{mockTokenData.bltby.price}</p>
                  <p className="text-sm text-green-500 mt-1">+5.2% (24h)</p>
                </Card>
                <Card className="p-4">
                  <h3 className="text-sm text-gray-500 mb-1">Market Cap</h3>
                  <p className="text-2xl font-bold">{mockTokenData.bltby.marketCap}</p>
                </Card>
              </div>
              
              <Card className="p-6">
                <h3 className="text-lg font-semibold mb-4">Token Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Circulating Supply</p>
                    <p className="font-medium">{mockTokenData.bltby.circulatingSupply}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Total Supply</p>
                    <p className="font-medium">{mockTokenData.bltby.totalSupply}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Token Type</p>
                    <p className="font-medium">ERC-20</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Contract Address</p>
                    <p className="font-medium">0x1234...5678</p>
                  </div>
                </div>
              </Card>
              
              <Card className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold">Recent Transactions</h3>
                  <Button variant="outline" size="sm">View All</Button>
                </div>
                <div className="space-y-4">
                  {mockTokenData.bltby.transactions.map((tx, index) => (
                    <div key={index} className="flex justify-between items-center border-b pb-2">
                      <div>
                        <p className="font-medium">{tx.type}</p>
                        <p className="text-sm text-gray-500">
                          {tx.from ? `From: ${tx.from}` : `To: ${tx.to}`}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">{tx.amount} BLTBY</p>
                        <p className="text-sm text-gray-500">{tx.date}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card className="p-6">
                  <h3 className="text-lg font-semibold mb-4">Staking</h3>
                  <div className="space-y-2 mb-4">
                    <p className="text-sm text-gray-500">Available to Stake</p>
                    <p className="text-xl font-bold">15,000.00 BLTBY</p>
                  </div>
                  <div className="space-y-2 mb-4">
                    <p className="text-sm text-gray-500">Current APY</p>
                    <p className="text-xl font-bold text-green-500">7.5%</p>
                  </div>
                  <Button className="w-full">Stake BLTBY</Button>
                </Card>
                
                <Card className="p-6">
                  <h3 className="text-lg font-semibold mb-4">Liquidity</h3>
                  <div className="space-y-2 mb-4">
                    <p className="text-sm text-gray-500">Total Liquidity</p>
                    <p className="text-xl font-bold">$8,500,000</p>
                  </div>
                  <div className="space-y-2 mb-4">
                    <p className="text-sm text-gray-500">Your Liquidity</p>
                    <p className="text-xl font-bold">$0.00</p>
                  </div>
                  <Button className="w-full">Add Liquidity</Button>
                </Card>
              </div>
            </Tabs.Content>
            
            {/* EQTBLT Token Tab */}
            <Tabs.Content value="eqtblt" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card className="p-4">
                  <h3 className="text-sm text-gray-500 mb-1">Balance</h3>
                  <p className="text-2xl font-bold">{mockTokenData.eqtblt.balance}</p>
                  <p className="text-sm text-gray-500 mt-1">≈ ${parseFloat(mockTokenData.eqtblt.balance.replace(/,/g, '')) * 0.18}</p>
                </Card>
                <Card className="p-4">
                  <h3 className="text-sm text-gray-500 mb-1">Price</h3>
                  <p className="text-2xl font-bold">{mockTokenData.eqtblt.price}</p>
                  <p className="text-sm text-green-500 mt-1">+2.8% (24h)</p>
                </Card>
                <Card className="p-4">
                  <h3 className="text-sm text-gray-500 mb-1">Market Cap</h3>
                  <p className="text-2xl font-bold">{mockTokenData.eqtblt.marketCap}</p>
                </Card>
              </div>
              
              <Card className="p-6">
                <h3 className="text-lg font-semibold mb-4">Vesting Information</h3>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-500 mb-1">Total Vested</p>
                      <p className="font-medium">{mockTokenData.eqtblt.vestingInfo.totalVested} EQTBLT</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 mb-1">Vested Amount</p>
                      <p className="font-medium">{mockTokenData.eqtblt.vestingInfo.vestedAmount} EQTBLT</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 mb-1">Next Unlock</p>
                      <p className="font-medium">{mockTokenData.eqtblt.vestingInfo.nextUnlock}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 mb-1">Vesting Complete</p>
                      <p className="font-medium">{mockTokenData.eqtblt.vestingInfo.percentComplete}%</p>
                    </div>
                  </div>
                  
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: `${mockTokenData.eqtblt.vestingInfo.percentComplete}%` }}></div>
                  </div>
                </div>
              </Card>
              
              {/* Rest of EQTBLT content... */}
            </Tabs.Content>
            
            {/* Governance Token Tab */}
            <Tabs.Content value="governance" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card className="p-4">
                  <h3 className="text-sm text-gray-500 mb-1">Balance</h3>
                  <p className="text-2xl font-bold">{mockTokenData.governance.balance}</p>
                </Card>
                <Card className="p-4">
                  <h3 className="text-sm text-gray-500 mb-1">Voting Power</h3>
                  <p className="text-2xl font-bold">{mockTokenData.governance.votingPower}</p>
                </Card>
                <Card className="p-4">
                  <h3 className="text-sm text-gray-500 mb-1">Delegated To</h3>
                  <p className="text-2xl font-bold">{mockTokenData.governance.delegatedTo}</p>
                </Card>
              </div>
              
              {/* Rest of Governance content... */}
            </Tabs.Content>
          </Tabs.Root>
        </div>
      ) : (
        <div className="text-center py-12">
          <h2 className="text-xl font-semibold mb-2">Connect your wallet</h2>
          <p className="text-gray-500 mb-4">Please connect your wallet to view your tokens</p>
        </div>
      )}
    </DashboardLayout>
  );
}
