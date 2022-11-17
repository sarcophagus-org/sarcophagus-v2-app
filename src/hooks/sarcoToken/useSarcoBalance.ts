import { useAccount, useContractRead } from 'wagmi';
import { SarcoTokenMock__factory } from '@sarcophagus-org/sarcophagus-v2-contracts';
import { useNetworkConfig } from 'lib/config';
import { BigNumber, ethers } from 'ethers';
import { useMemo } from 'react';

export function useSarcoBalance() {
  const { address } = useAccount();
  const networkConfig = useNetworkConfig();
  const { data, isError, isLoading } = useContractRead({
    address: networkConfig.sarcoTokenAddress,
    abi: SarcoTokenMock__factory.abi,
    functionName: 'balanceOf',
    args: [address],
    enabled: !!address,
  });

  const balance = data as BigNumber | undefined;

  const balanceTokens = ethers.utils.formatEther(balance || ethers.constants.Zero);

  const formattedBalance = useMemo(
    () => (balance ? `${parseFloat(balanceTokens).toFixed(2)} SARCO` : ''),
    [balance, balanceTokens]
  );

  return {
    balance: data as BigNumber | undefined,
    formattedBalance,
    isError,
    isLoading,
  };
}
