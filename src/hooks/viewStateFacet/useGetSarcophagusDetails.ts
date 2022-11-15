import { ViewStateFacet__factory } from '@sarcophagus-org/sarcophagus-v2-contracts';
import { useNetworkConfig } from 'lib/config';
import { Sarcophagus } from 'types';
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

  const sarcophagus = data as Sarcophagus;

  return { sarcophagus, refetch, isLoading };
}
