import { ViewStateFacet__factory } from '@sarcophagus-org/sarcophagus-v2-contracts';
import { useNetworkConfig } from 'lib/config';
import { SarcophagusArchaeologist } from '@sarcophagus-org/sarcophagus-v2-sdk-client';
import { useContractReads } from 'wagmi';

export function useGetSarcophagusArchaeologists(
  sarcoId: string | number,
  archaeologistAddresses: string[]
): SarcophagusArchaeologist[] {
  const networkConfig = useNetworkConfig();

  const { data } = useContractReads({
    contracts: archaeologistAddresses.map(address => ({
      address: networkConfig.diamondDeployAddress as `0x${string}`,
      abi: ViewStateFacet__factory.abi,
      functionName: 'getSarcophagusArchaeologist',
      args: [sarcoId, address],
    })),
  });

  return (data?.filter(d => d) as SarcophagusArchaeologist[]) || [];
}
