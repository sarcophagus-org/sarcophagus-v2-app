import { ViewStateFacet__factory } from '@sarcophagus-org/sarcophagus-v2-contracts';
import { ethers } from 'ethers';
import { useNetworkConfig } from 'lib/config';
import { getSarcophagusState } from 'lib/utils/getSarcophagusState';
import { useSelector } from 'store/index';
import { Sarcophagus, SarcophagusResponseContract } from 'types';
import { useContractRead } from 'wagmi';
import { useGetGracePeriod } from './useGetGracePeriod';

export function useGetSarcophagus(sarcoId: string | undefined) {
  const networkConfig = useNetworkConfig();
  const gracePeriod = useGetGracePeriod();
  const { timestampMs } = useSelector(x => x.appState);

  const { data, refetch, isLoading } = useContractRead({
    address: networkConfig.diamondDeployAddress,
    abi: ViewStateFacet__factory.abi,
    functionName: 'getSarcophagus',
    args: [!!sarcoId ? sarcoId : ethers.constants.HashZero],
    enabled: !!sarcoId,
  });

  const sarcophagusResponse = data as SarcophagusResponseContract;
  const sarcophagus: Sarcophagus | undefined = !data
    ? undefined
    : {
        ...sarcophagusResponse,
        state: getSarcophagusState(sarcophagusResponse, gracePeriod, timestampMs),
        id: sarcoId || '',
      };

  return { sarcophagus, refetch, isLoading };
}
