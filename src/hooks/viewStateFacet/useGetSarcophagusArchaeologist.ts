import { useContractRead } from 'wagmi';
import { ViewStateFacet } from '../../abi/ViewStateFacet';

export function useGetSarcophagusArchaeologist({
  sarcoId,
  archaeologist,
}: {
  sarcoId: string | number;
  archaeologist: string;
}) {
  const { data } = useContractRead({
    addressOrName: process.env.REACT_APP_LOCAL_CONTRACT_ADDRESS || '',
    contractInterface: ViewStateFacet.abi,
    functionName: 'getSarcophagusArchaeologist',
    args: [sarcoId, archaeologist],
  });

  return data;
}
