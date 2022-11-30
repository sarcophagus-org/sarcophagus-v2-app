import { ViewStateFacet__factory } from '@sarcophagus-org/sarcophagus-v2-contracts';
import { useNetworkConfig } from 'lib/config';
import { SarcophagusResponse } from 'types';
import { useContractReads } from 'wagmi';

/**
 * Makes multiple view calls to the contract retrieving sarcophagi for the sarcoIds provided
 */
export function useGetSarcophagi(sarcoIds: string[]): SarcophagusResponse[] {
  const networkConfig = useNetworkConfig();

  const { data } = useContractReads({
    contracts: sarcoIds.map(id => ({
      address: networkConfig.diamondDeployAddress,
      abi: ViewStateFacet__factory.abi,
      functionName: 'getSarcophagus',
      args: [id],
    })),
  });

  return data as SarcophagusResponse[];
}
