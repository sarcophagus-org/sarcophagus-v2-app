import { useContractRead } from 'wagmi';
import { ViewStateFacet } from 'lib/abi/ViewStateFacet';
import { useNetworkConfig } from 'lib/config';

export function useGetEmbalmerSarcophagi({ embalmer }: { embalmer: string }) {
  const networkConfig = useNetworkConfig();

  const { data } = useContractRead({
    addressOrName: networkConfig.diamondDeployAddress,
    contractInterface: ViewStateFacet.abi,
    functionName: 'getEmbalmersarcophagi',
    args: [embalmer],
  });

  return data;
}
