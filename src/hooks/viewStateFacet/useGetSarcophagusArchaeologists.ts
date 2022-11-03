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
    contracts:
      archaeologistAddresses?.map(address => ({
        addressOrName: networkConfig.diamondDeployAddress,
        contractInterface: ViewStateFacet__factory.abi,
        functionName: 'getSarcophagusArchaeologist',
        args: [sarcoId, address],
      })) ?? [],
  });

  return (
    data?.map(d => ({
      diggingFee: d?.diggingFee,
      diggingFeesPaid: d?.diggingFeesPaid,
      unencryptedShardDoubleHash: d?.unencryptedShardDoubleHash,
      unencryptedShard: d?.unencryptedShard,
    })) ?? []
  );
}
