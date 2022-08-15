import { useContractRead } from 'wagmi';
import { ViewStateFacetABI } from '../../abis/ViewStateFacet';

export function useGetEmbalmerSarcophagi({ embalmer }: { embalmer: string }) {
  const { data } = useContractRead({
    addressOrName: process.env.REACT_APP_LOCAL_CONTRACT_ADDRESS || '',
    contractInterface: ViewStateFacetABI,
    functionName: 'getEmbalmersarcophagi',
    args: [embalmer],
  });

  return { embalmerSarcophagi: data };
}
