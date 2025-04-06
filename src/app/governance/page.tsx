'use client';

import DashboardLayout from '@/components/layout/dashboard-layout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAccount } from 'wagmi';
import { useState } from 'react';

export default function GovernancePage() {
  const { isConnected } = useAccount();
  const [activeTab, setActiveTab] = useState('proposals');

  // Mock data for governance
  const governanceData = {
    proposals: {
      active: [
        {
          id: 'PROP-42',
          title: 'Increase BLTBY Staking Rewards',
          description: 'Proposal to increase the staking rewards for BLTBY holders from 5% to 7% APY to incentivize long-term holding.',
          status: 'Active',
          votes: { for: 65, against: 20, abstain: 15 },
          endDate: 'Apr 15, 2025',
          proposer: '0x1234...5678'
        },
        {
          id: 'PROP-43',
          title: 'Add New Development Guild',
          description: 'Create a new specialized guild for blockchain developers with enhanced EQTBLT earning rates.',
          status: 'Active',
          votes: { for: 72, against: 8, abstain: 20 },
          endDate: 'Apr 18, 2025',
          proposer: '0xabcd...ef01'
        }
      ],
      past: [
        {
          id: 'PROP-41',
          title: 'Treasury Diversification',
          description: 'Allocate 10% of the treasury to stablecoins to reduce volatility risk.',
          status: 'Passed',
          votes: { for: 82, against: 12, abstain: 6 },
          endDate: 'Mar 30, 2025',
          proposer: '0x2468...1357'
        },
        {
          id: 'PROP-40',
          title: 'Reduce Vesting Period',
          description: 'Reduce the vesting period for EQTBLT to BLTBY conversion from 12 months to 9 months.',
          status: 'Rejected',
          votes: { for: 35, against: 60, abstain: 5 },
          endDate: 'Mar 25, 2025',
          proposer: '0x9876...5432'
        }
      ]
    },
    voting: {
      votingPower: '500.00',
      delegatedFrom: [],
      delegatedTo: 'Self',
      votingHistory: [
        {
          proposalId: 'PROP-41',
          vote: 'For',
          date: 'Mar 28, 2025'
        },
        {
          proposalId: 'PROP-40',
          vote: 'Against',
          date: 'Mar 23, 2025'
        }
      ]
    },
    delegation: {
      activeDelegations: [],
      delegationOptions: [
        {
          address: '0x7890...1234',
          name: 'Guardian Council Member',
          delegatedPower: '250,000.00',
          delegators: 45
        },
        {
          address: '0x3456...7890',
          name: 'Lead Developer',
          delegatedPower: '180,000.00',
          delegators: 32
        },
        {
          address: '0x2345...6789',
          name: 'Community Manager',
          delegatedPower: '120,000.00',
          delegators: 28
        }
      ]
    }
  };

  // Function to render vote progress bar
  const renderVoteProgress = (votes) => {
    const total = votes.for + votes.against + votes.abstain;
    const forPercent = (votes.for / total) * 100;
    const againstPercent = (votes.against / total) * 100;
    const abstainPercent = (votes.abstain / total) * 100;

    return (
      <div className="space-y-2">
        <div className="flex justify-between text-xs">
          <span>For: {votes.for}%</span>
          <span>Against: {votes.against}%</span>
          <span>Abstain: {votes.abstain}%</span>
        </div>
        <div className="w-full h-2 flex rounded-full overflow-hidden">
          <div className="bg-green-500 h-full" style={{ width: `${forPercent}%` }}></div>
          <div className="bg-red-500 h-full" style={{ width: `${againstPercent}%` }}></div>
          <div className="bg-gray-300 h-full" style={{ width: `${abstainPercent}%` }}></div>
        </div>
      </div>
    );
  };

  return (
    <DashboardLayout title="Governance">
      {isConnected ? (
        <div className="w-full space-y-6">
          {/* Governance Navigation */}
          <div className="flex space-x-2 border-b pb-2">
            <Button 
              variant={activeTab === 'proposals' ? 'default' : 'outline'}
              onClick={() => setActiveTab('proposals')}
            >
              Proposals
            </Button>
            <Button 
              variant={activeTab === 'voting' ? 'default' : 'outline'}
              onClick={() => setActiveTab('voting')}
            >
              Voting
            </Button>
            <Button 
              variant={activeTab === 'delegation' ? 'default' : 'outline'}
              onClick={() => setActiveTab('delegation')}
            >
              Delegation
            </Button>
          </div>

          {/* Proposals Tab */}
          {activeTab === 'proposals' && (
            <div className="space-y-6">
              <Card className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-2xl font-bold">Active Proposals</h2>
                  <Button>Create Proposal</Button>
                </div>
                
                {governanceData.proposals.active.length > 0 ? (
                  <div className="space-y-6">
                    {governanceData.proposals.active.map((proposal) => (
                      <div key={proposal.id} className="border rounded-lg p-4 space-y-4">
                        <div className="flex justify-between">
                          <h3 className="text-lg font-semibold">{proposal.title}</h3>
                          <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                            {proposal.status}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600">{proposal.description}</p>
                        <div className="text-sm text-gray-500">
                          <div className="flex justify-between mb-2">
                            <span>ID: {proposal.id}</span>
                            <span>Ends: {proposal.endDate}</span>
                          </div>
                          <div className="mb-2">
                            Proposer: <span className="font-mono">{proposal.proposer}</span>
                          </div>
                        </div>
                        {renderVoteProgress(proposal.votes)}
                        <div className="flex space-x-2 pt-2">
                          <Button variant="default" className="flex-1">Vote For</Button>
                          <Button variant="outline" className="flex-1">Vote Against</Button>
                          <Button variant="outline" className="flex-1">Abstain</Button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500">No active proposals at this time.</p>
                )}
              </Card>

              <Card className="p-6">
                <h2 className="text-2xl font-bold mb-4">Past Proposals</h2>
                
                {governanceData.proposals.past.length > 0 ? (
                  <div className="space-y-6">
                    {governanceData.proposals.past.map((proposal) => (
                      <div key={proposal.id} className="border rounded-lg p-4 space-y-4">
                        <div className="flex justify-between">
                          <h3 className="text-lg font-semibold">{proposal.title}</h3>
                          <span className={`px-2 py-1 text-xs rounded-full ${
                            proposal.status === 'Passed' 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {proposal.status}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600">{proposal.description}</p>
                        <div className="text-sm text-gray-500">
                          <div className="flex justify-between mb-2">
                            <span>ID: {proposal.id}</span>
                            <span>Ended: {proposal.endDate}</span>
                          </div>
                          <div className="mb-2">
                            Proposer: <span className="font-mono">{proposal.proposer}</span>
                          </div>
                        </div>
                        {renderVoteProgress(proposal.votes)}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500">No past proposals to display.</p>
                )}
              </Card>
            </div>
          )}

          {/* Voting Tab */}
          {activeTab === 'voting' && (
            <div className="space-y-6">
              <Card className="p-6">
                <h2 className="text-2xl font-bold mb-4">Your Voting Power</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="border rounded-lg p-4">
                    <h3 className="text-sm text-gray-500 mb-1">Total Voting Power</h3>
                    <p className="text-2xl font-bold">{governanceData.voting.votingPower}</p>
                  </div>
                  <div className="border rounded-lg p-4">
                    <h3 className="text-sm text-gray-500 mb-1">Delegated To</h3>
                    <p className="text-lg font-medium">{governanceData.voting.delegatedTo}</p>
                  </div>
                  <div className="border rounded-lg p-4">
                    <h3 className="text-sm text-gray-500 mb-1">Delegations Received</h3>
                    <p className="text-lg font-medium">{governanceData.voting.delegatedFrom.length || 'None'}</p>
                  </div>
                </div>
              </Card>

              <Card className="p-6">
                <h2 className="text-2xl font-bold mb-4">Voting History</h2>
                {governanceData.voting.votingHistory.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead>
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Proposal ID</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Vote</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {governanceData.voting.votingHistory.map((history, index) => (
                          <tr key={index}>
                            <td className="px-6 py-4 whitespace-nowrap">{history.proposalId}</td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`px-2 py-1 text-xs rounded-full ${
                                history.vote === 'For' 
                                  ? 'bg-green-100 text-green-800' 
                                  : history.vote === 'Against'
                                    ? 'bg-red-100 text-red-800'
                                    : 'bg-gray-100 text-gray-800'
                              }`}>
                                {history.vote}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">{history.date}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <p className="text-gray-500">No voting history to display.</p>
                )}
              </Card>
            </div>
          )}

          {/* Delegation Tab */}
          {activeTab === 'delegation' && (
            <div className="space-y-6">
              <Card className="p-6">
                <h2 className="text-2xl font-bold mb-4">Your Delegations</h2>
                {governanceData.delegation.activeDelegations.length > 0 ? (
                  <div className="space-y-4">
                    {governanceData.delegation.activeDelegations.map((delegation, index) => (
                      <div key={index} className="border rounded-lg p-4">
                        <div className="flex justify-between">
                          <div>
                            <h3 className="font-medium">{delegation.name}</h3>
                            <p className="text-sm text-gray-500 font-mono">{delegation.address}</p>
                          </div>
                          <Button variant="outline" size="sm">Undelegate</Button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-6">
                    <p className="text-gray-500 mb-4">You haven't delegated your voting power to anyone.</p>
                    <p className="text-sm text-gray-600 mb-4">
                      You are currently voting with your own power. You can delegate your voting power to a trusted community member.
                    </p>
                  </div>
                )}
              </Card>

              <Card className="p-6">
                <h2 className="text-2xl font-bold mb-4">Delegate Your Voting Power</h2>
                <p className="text-sm text-gray-600 mb-4">
                  Delegating your voting power allows trusted community members to vote on your behalf. 
                  You can revoke this delegation at any time.
                </p>
                
                <div className="space-y-4 mt-6">
                  <h3 className="text-lg font-medium">Popular Delegates</h3>
                  {governanceData.delegation.delegationOptions.map((delegate, index) => (
                    <div key={index} className="border rounded-lg p-4">
                      <div className="flex justify-between items-center">
                        <div>
                          <h4 className="font-medium">{delegate.name}</h4>
                          <p className="text-sm text-gray-500 font-mono">{delegate.address}</p>
                          <div className="flex space-x-4 mt-1 text-sm text-gray-500">
                            <span>Power: {delegate.delegatedPower}</span>
                            <span>Delegators: {delegate.delegators}</span>
                          </div>
                        </div>
                        <Button>Delegate</Button>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-6">
                  <h3 className="text-lg font-medium mb-2">Custom Delegation</h3>
                  <div className="flex space-x-2">
                    <input 
                      type="text" 
                      placeholder="Enter wallet address" 
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm"
                    />
                    <Button>Delegate</Button>
                  </div>
                </div>
              </Card>
            </div>
          )}
        </div>
      ) : (
        <div className="text-center py-12">
          <h2 className="text-xl font-semibold mb-2">Connect your wallet</h2>
          <p className="text-gray-500 mb-4">Please connect your wallet to participate in governance</p>
        </div>
      )}
    </DashboardLayout>
  );
}
