import { useContractRead } from 'wagmi';
import { ViewStateFacet__factory } from '@sarcophagus-org/sarcophagus-v2-contracts';
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
    contractInterface: ViewStateFacet__factory.abi,
    functionName: 'getArchaeologistSuccessOnSarcophagus',
    args: [archaeologist, sarcoId],
  });

  return data;
}
