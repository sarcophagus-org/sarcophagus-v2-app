import { ViewStateFacet__factory } from '@sarcophagus-org/sarcophagus-v2-contracts';
import { useGetGracePeriod } from 'hooks/viewStateFacet/useGetGracePeriod';
import { useNetworkConfig } from 'lib/config';
import { getSarcophagusState } from 'lib/utils/getSarcophagusState';
import { useEffect, useState } from 'react';
import { Sarcophagus, SarcophagusResponseContract } from 'types';
import { useContractReads } from 'wagmi';

/**
 * Makes multiple view calls to the contract retrieving sarcophagi for the sarcoIds provided
 */
export function useGetSarcophagi(sarcoIds: string[], refetchInterval = 60_000): Sarcophagus[] {
  const networkConfig = useNetworkConfig();
  const gracePeriod = useGetGracePeriod();
  const [sarcohpaiResponse, setSarcohpagiResponse] = useState<SarcophagusResponseContract[]>([]);

  const { data, refetch } = useContractReads({
    contracts: sarcoIds.map(id => ({
      address: networkConfig.diamondDeployAddress,
      abi: ViewStateFacet__factory.abi,
      functionName: 'getSarcophagus',
      args: [id],
    })),
  });

  // Refetch the sarcohpagi on a set interval to update the sarcophagus status
  useEffect(() => {
    setSarcohpagiResponse(data as SarcophagusResponseContract[]);

    const intervalId = setInterval(async () => {
      const refetchedData = (await refetch?.()).data as SarcophagusResponseContract[];
      setSarcohpagiResponse(refetchedData);
    }, refetchInterval);

    return () => {
      clearInterval(intervalId);
    };
  }, [refetch, data, refetchInterval]);

  if (!data) return [];
  const sarcophagi = sarcohpaiResponse.map((sarcoResponse, index) => ({
    ...sarcoResponse,
    state: getSarcophagusState(sarcoResponse, gracePeriod),
    id: sarcoIds?.[index] || '',
  }));

  return sarcophagi;
}
