import { useContractRead } from 'wagmi';
import { ViewStateFacet } from '../../abi/ViewStateFacet';

export function useGetArchaeologistSuccessOnSarcophagus({
  archaeologist,
  sarcoId,
}: {
  archaeologist: string;
  sarcoId: string;
}) {
  const { data } = useContractRead({
    addressOrName: process.env.REACT_APP_LOCAL_CONTRACT_ADDRESS || '',
    contractInterface: ViewStateFacet.abi,
    functionName: 'getArchaeologistSuccessOnSarcophagus',
    args: [archaeologist, sarcoId],
  });

  return data;
}
