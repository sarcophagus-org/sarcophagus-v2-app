import { useContractRead } from 'wagmi';
import { ViewStateFacet } from 'lib/abi/ViewStateFacet';
import { useNetworkConfig } from 'lib/config';

export function useGetArchaeologistSuccessOnSarcophagus({
  archaeologist,
  sarcoId,
}: {
  archaeologist: string;
  sarcoId: string;
}) {
  const networkConfig = useNetworkConfig();

  const { data } = useContractRead({
    addressOrName: networkConfig.diamondDeployAddress,
    contractInterface: ViewStateFacet.abi,
    functionName: 'getArchaeologistSuccessOnSarcophagus',
    args: [archaeologist, sarcoId],
  });

  return data;
}
