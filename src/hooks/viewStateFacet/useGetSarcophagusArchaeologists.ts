import { ViewStateFacet__factory } from '@sarcophagus-org/sarcophagus-v2-contracts';
import { useNetworkConfig } from 'lib/config';
import { SarcophagusArchaeologist } from 'types';
import { useContractReads } from 'wagmi';

export function useGetSarcophagusArchaeologists(
  sarcoId: string | number,
  archaeologistAddresses: string[]
): SarcophagusArchaeologist[] {
  const networkConfig = useNetworkConfig();

  const { data } = useContractReads({
    contracts: archaeologistAddresses.map(address => ({
      address: networkConfig.diamondDeployAddress,
      abi: ViewStateFacet__factory.abi,
      functionName: 'getSarcophagusArchaeologist',
      args: [sarcoId, address],
    })),
  });

  return (data as SarcophagusArchaeologist[]) || [];
}
