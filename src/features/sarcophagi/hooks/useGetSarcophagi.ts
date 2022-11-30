import { ViewStateFacet__factory } from '@sarcophagus-org/sarcophagus-v2-contracts';
import { useNetworkConfig } from 'lib/config';
import { getSarcophagusState } from 'lib/utils/sarcophagusState';
import { Sarcophagus, SarcophagusResponseContract } from 'types';
import { useContractReads } from 'wagmi';

/**
 * Makes multiple view calls to the contract retrieving sarcophagi for the sarcoIds provided
 */
export function useGetSarcophagi(sarcoIds: string[]): Sarcophagus[] {
  const networkConfig = useNetworkConfig();

  const { data } = useContractReads({
    contracts: sarcoIds.map(id => ({
      address: networkConfig.diamondDeployAddress,
      abi: ViewStateFacet__factory.abi,
      functionName: 'getSarcophagus',
      args: [id],
    })),
  });

  if (!data) return [];
  const response = data as SarcophagusResponseContract[];
  return response.map((sarcoResponse, index) => ({
    ...sarcoResponse,
    state: getSarcophagusState(sarcoResponse),
    id: sarcoIds?.[index] || '',
  }));
}
