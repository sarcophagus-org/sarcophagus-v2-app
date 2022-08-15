import { useContractRead } from 'wagmi';
import { ViewStateFacetABI } from '../../abis/ViewStateFacet';

export function useGetArchaeologistSuccessOnSarcophagus({
  archaeologist,
  sarcoId,
}: {
  archaeologist: string;
  sarcoId: string;
}) {
  const { data } = useContractRead({
    addressOrName: process.env.REACT_APP_LOCAL_CONTRACT_ADDRESS || '',
    contractInterface: ViewStateFacetABI,
    functionName: 'getArchaeologistSuccessOnSarcophagus',
    args: [archaeologist, sarcoId],
  });

  return { archaeologistSuccessesOnSarcophagus: data };
}
