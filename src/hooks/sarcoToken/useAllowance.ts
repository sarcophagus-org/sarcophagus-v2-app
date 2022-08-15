import { useAccount, useContractRead } from 'wagmi';
import { SarcoToken } from 'lib/abi/SarcoToken';
import { useNetworkConfig } from 'lib/config';

export function useAllowance() {
  const { address } = useAccount();
  const networkConfig = useNetworkConfig();

  const { data } = useContractRead({
    addressOrName: networkConfig.sarcoTokenAddress,
    contractInterface: SarcoToken.abi,
    functionName: 'allowance',
    args: [address, networkConfig.diamondDeployAddress],
  });

  return { allowance: data };
}
