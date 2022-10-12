import { useContractRead } from 'wagmi';
import { ViewStateFacet__factory } from '@sarcophagus-org/sarcophagus-v2-contracts';
import { useNetworkConfig } from 'lib/config';

export function useGetRecipientSarcophagi({ recipient }: { recipient: string }) {
  const networkConfig = useNetworkConfig();

  const { data } = useContractRead({
    addressOrName: networkConfig.diamondDeployAddress,
    contractInterface: ViewStateFacet__factory.abi,
    functionName: 'getRecipientSarcophagi',
    args: [recipient],
  });

  return data;
}
