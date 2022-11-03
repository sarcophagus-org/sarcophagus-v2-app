import { useAccount, useContractRead } from 'wagmi';
import { SarcoTokenMock__factory } from '@sarcophagus-org/sarcophagus-v2-contracts';
import { useNetworkConfig } from 'lib/config';

export function useAllowance() {
  const { address } = useAccount();
  const networkConfig = useNetworkConfig();

  const { data } = useContractRead({
    address: networkConfig.sarcoTokenAddress,
    abi: SarcoTokenMock__factory.abi,
    functionName: 'allowance',
    args: [address, networkConfig.diamondDeployAddress],
  });

  return { allowance: data };
}
