import { ViewStateFacet__factory } from '@sarcophagus-org/sarcophagus-v2-contracts';
import { useNetworkConfig } from 'lib/config';
import { useContractRead } from 'wagmi';

export function useGetArchaeologistProfileAddresses(): string[] {
  const networkConfig = useNetworkConfig();

  const { data } = useContractRead({
    address: networkConfig.diamondDeployAddress,
    abi: ViewStateFacet__factory.abi,
    functionName: 'getArchaeologistProfileAddresses',
    args: [],
  });

  return data as string[];
}
