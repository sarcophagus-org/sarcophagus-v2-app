import { ViewStateFacet__factory } from '@sarcophagus-org/sarcophagus-v2-contracts';
import { useNetworkConfig } from 'lib/config';
import { useContractRead } from 'wagmi';

export function useGetProtocolFeeAmount(): number {
  const networkConfig = useNetworkConfig();

  const { data } = useContractRead({
    addressOrName: networkConfig.diamondDeployAddress,
    contractInterface: ViewStateFacet__factory.abi,
    functionName: 'getProtocolFeeBasePercentage',
  });

  const protocolFees = Number(data);
  return isNaN(protocolFees) ? 0 : protocolFees;
}
