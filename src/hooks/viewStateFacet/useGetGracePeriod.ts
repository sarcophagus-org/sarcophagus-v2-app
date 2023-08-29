import { ViewStateFacet__factory } from '@sarcophagus-org/sarcophagus-v2-contracts';
import { useNetworkConfig } from 'lib/config';
import { useContractRead } from 'wagmi';

export function useGetGracePeriod(): number {
  const networkConfig = useNetworkConfig();

  const { data } = useContractRead({
    address: networkConfig.diamondDeployAddress as `0x${string}`,
    abi: ViewStateFacet__factory.abi,
    functionName: 'getGracePeriod',
  });

  const gracePeriod = Number(data);
  return isNaN(gracePeriod) ? 0 : gracePeriod;
}
