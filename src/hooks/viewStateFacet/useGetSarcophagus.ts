import { useContractRead } from 'wagmi';
import { ViewStateFacet } from '../../abi/ViewStateFacet';

export function useGetSarcophagus({ sarcoId }: { sarcoId: string | number }) {
  const { data } = useContractRead({
    addressOrName: process.env.REACT_APP_LOCAL_CONTRACT_ADDRESS || '',
    contractInterface: ViewStateFacet.abi,
    functionName: 'getSarcophagus',
    args: [sarcoId],
  });

  return data;
}
