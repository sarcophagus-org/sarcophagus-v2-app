import { ViewStateFacet__factory } from '@sarcophagus-org/sarcophagus-v2-contracts';
import { useNetworkConfig } from 'lib/config';
import { SarcophagusResponse } from 'types';
import { useContractRead } from 'wagmi';

export function useGetSarcophagusDetails({ sarcoId }: { sarcoId: string | undefined }) {
  const networkConfig = useNetworkConfig();

  const { data, refetch, isLoading } = useContractRead({
    address: networkConfig.diamondDeployAddress,
    abi: ViewStateFacet__factory.abi,
    functionName: 'getSarcophagus',
    args: [sarcoId],
    enabled: !!sarcoId,
  });

  const sarcophagus = data as SarcophagusResponse;

  return { sarcophagus, refetch, isLoading };
}
