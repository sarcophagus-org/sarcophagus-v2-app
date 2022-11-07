import { useAccount, useContractRead } from 'wagmi';
import { SarcoTokenMock__factory } from '@sarcophagus-org/sarcophagus-v2-contracts';
import { useNetworkConfig } from 'lib/config';
import { BigNumber } from 'ethers';

export function useAllowance() {
  const { address } = useAccount();
  const networkConfig = useNetworkConfig();

  const { data, isError, isLoading } = useContractRead({
    address: networkConfig.sarcoTokenAddress,
    abi: SarcoTokenMock__factory.abi,
    functionName: 'allowance',
    args: [address, networkConfig.diamondDeployAddress],
  });

  return {
    allowance: data as BigNumber | undefined,
    isError,
    isLoading,
  };
}
