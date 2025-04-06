'use client';

import { useAccount, useReadContract } from 'wagmi';
import { formatUnits } from 'viem';

const USDC = {
  address: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
  abi: [
    {
      constant: true,
      name: 'balanceOf',
      inputs: [{ name: '_owner', type: 'address' }],
      outputs: [{ name: 'balance', type: 'uint256' }],
      stateMutability: 'view',
      type: 'function',
    },
  ],
};

export function useUSDCBalance() {
  const { address } = useAccount();

  const { data, isSuccess } = useReadContract({
    address: USDC.address,
    abi: USDC.abi,
    functionName: 'balanceOf',
    args: address ? [address] : undefined,
    query: {
      enabled: !!address,
    },
  });

  if (!address || !isSuccess || data === undefined) {
    return null;
  }

  return formatUnits(data as bigint, 6);
}
