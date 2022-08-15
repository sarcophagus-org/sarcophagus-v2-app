import { useContractRead } from 'wagmi';
import { ViewStateFacet } from 'lib/abi/ViewStateFacet';
import { useNetworkConfig } from 'lib/config';

export function useGetArchaeologistCleanups({ archaeologist }: { archaeologist: string }) {
  const networkConfig = useNetworkConfig();

  const { data } = useContractRead({
    addressOrName: networkConfig.diamondDeployAddress,
    contractInterface: ViewStateFacet.abi,
    functionName: 'getArchaeologistCleanups',
    args: [archaeologist],
  });

  return data;
}
