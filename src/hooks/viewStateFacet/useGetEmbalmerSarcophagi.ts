import { useContractRead } from 'wagmi';
import { ViewStateFacet } from '../../abi/ViewStateFacet';

export function useGetEmbalmerSarcophagi({ embalmer }: { embalmer: string }) {
  const { data } = useContractRead({
    addressOrName: process.env.REACT_APP_LOCAL_CONTRACT_ADDRESS || '',
    contractInterface: ViewStateFacet.abi,
    functionName: 'getEmbalmersarcophagi',
    args: [embalmer],
  });

  return data;
}
