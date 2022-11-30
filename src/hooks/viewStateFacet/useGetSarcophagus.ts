import { ViewStateFacet__factory } from '@sarcophagus-org/sarcophagus-v2-contracts';
import { ethers } from 'ethers';
import { useNetworkConfig } from 'lib/config';
import { getSarcophagusState } from 'lib/utils/sarcophagusState';
import { Sarcophagus, SarcophagusResponse } from 'types';
import { useContractRead } from 'wagmi';

export function useGetSarcophagus(sarcoId: string | undefined) {
  const networkConfig = useNetworkConfig();

  const { data, refetch, isLoading } = useContractRead({
    address: networkConfig.diamondDeployAddress,
    abi: ViewStateFacet__factory.abi,
    functionName: 'getSarcophagus',
    args: [!!sarcoId ? sarcoId : ethers.constants.HashZero],
    enabled: !!sarcoId,
  });

  const sarcophagusResponse = data as SarcophagusResponse;
  const sarcophagus: Sarcophagus = {
    ...sarcophagusResponse,
    state: getSarcophagusState(sarcophagusResponse),
  };

  return { sarcophagus, refetch, isLoading };
}
