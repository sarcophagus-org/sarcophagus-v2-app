import { useContractRead } from 'wagmi';
import { ViewStateFacetABI } from '../../abis/ViewStateFacet';

export function useGetTotalProtocolFees() {
  const { data } = useContractRead({
    addressOrName: process.env.REACT_APP_LOCAL_CONTRACT_ADDRESS || '',
    contractInterface: ViewStateFacetABI,
    functionName: 'getProtocolFeeAmount',
  });

  return { protocolFeeAmount: data };
}
