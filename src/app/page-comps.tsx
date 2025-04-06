'use client';

import { useEffect, useState } from 'react';
import DashboardLayout from '@/components/layout/dashboard-layout';
import { useAccount } from 'wagmi';
import { useTokenData } from '@/hooks/useTokenData';
import { useNFTData } from '@/hooks/useNFTData';
import { useGovernanceData } from '@/hooks/useGovernanceData';

// Future imports for clean components
import { BLTBYBalanceCard, EQTBLTBalanceCard } from '@/components/dashboard/token-cards';
import { MembershipNFTCard } from '@/components/dashboard/membership-nft-card';
import { ProposalListPreview } from '@/components/governance/proposal-list-preview';
import { OnboardingStatusCard } from '@/components/members/onboarding-status-card';
import { TokenTransactionTable } from '@/components/tokens/transaction-table';
import { GovernanceSummaryPanel } from '@/components/governance/governance-summary-panel';

export default function Home() {
  const { isConnected } = useAccount();
  const { bltbyBalance, eqtbltBalance, governanceBalance, isLoading: tokenLoading } = useTokenData();
  const { membershipNFT, isLoading: nftLoading } = useNFTData();
  const { proposals, voting, isLoading: governanceLoading } = useGovernanceData();

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!tokenLoading && !nftLoading && !governanceLoading) {
      setIsLoading(false);
    }
  }, [tokenLoading, nftLoading, governanceLoading]);

  return (
    <DashboardLayout title="Dashboard">
      {isConnected ? (
        <div className="w-full space-y-6">
          {isLoading ? (
            <div className="p-6 text-center border rounded-lg bg-white shadow-sm">
              <p className="text-gray-500">Loading dashboard data...</p>
            </div>
          ) : (
            <>
              {/* Token Balances */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <BLTBYBalanceCard amount={bltbyBalance} />
                <EQTBLTBalanceCard amount={eqtbltBalance} />
                <MembershipNFTCard rank={membershipNFT.rank} level={membershipNFT.level} hasNFT={membershipNFT.hasNFT} />
              </div>

              {/* Onboarding + Proposals */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <OnboardingStatusCard userId={membershipNFT.userId} />
                <ProposalListPreview proposals={proposals.active.slice(0, 3)} />
              </div>

              {/* Transactions + Governance Summary */}
              <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
                <TokenTransactionTable transactions={bltbyBalance.transactions} />
                <GovernanceSummaryPanel voting={voting} />
              </div>
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
