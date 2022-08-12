import { useContractRead } from 'wagmi';
import { ViewStateFacetABI } from '../../abis/ViewStateFacet';

export function useGetRecipientSarcophagi({ recipient }: { recipient: string }) {
  const { data } = useContractRead({
    addressOrName: process.env.REACT_APP_LOCAL_CONTRACT_ADDRESS || '',
    contractInterface: ViewStateFacetABI,
    functionName: 'getRecipientSarcophagi',
    args: [recipient],
  });

  return { embalmerSarcophagi: data };
}
