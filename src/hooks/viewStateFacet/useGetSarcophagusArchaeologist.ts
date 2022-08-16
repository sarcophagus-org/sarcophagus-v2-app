import { useContractRead } from 'wagmi';
import { ViewStateFacet } from 'lib/abi/ViewStateFacet';
import { useNetworkConfig } from 'lib/config';

export function useGetSarcophagusArchaeologist({
  sarcoId,
  archaeologist,
}: {
  sarcoId: string | number;
  archaeologist: string;
}) {
  const networkConfig = useNetworkConfig();

  const { data } = useContractRead({
    addressOrName: networkConfig.diamondDeployAddress,
    contractInterface: ViewStateFacet.abi,
    functionName: 'getSarcophagusArchaeologist',
    args: [sarcoId, archaeologist],
  });

  return data;
}
