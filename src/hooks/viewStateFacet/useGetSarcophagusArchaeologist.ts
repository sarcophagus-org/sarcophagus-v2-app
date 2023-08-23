import { useContractRead } from 'wagmi';
import { ViewStateFacet__factory } from '@sarcophagus-org/sarcophagus-v2-contracts';
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
    address: networkConfig.diamondDeployAddress as `0x${string}`,
    abi: ViewStateFacet__factory.abi,
    functionName: 'getSarcophagusArchaeologist',
    args: [sarcoId, archaeologist],
  });

  return data;
}
