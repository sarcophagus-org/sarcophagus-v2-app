import { useToast } from '@chakra-ui/react';
import { EmbalmerFacet__factory } from '@sarcophagus-org/sarcophagus-v2-contracts';
import { Abi } from 'abitype';
import { useNetworkConfig } from 'lib/config';
import { rewrapFailure, rewrapSuccess } from 'lib/utils/toast';
import { useContractWrite, usePrepareContractWrite } from 'wagmi';

export function useRewrapSarcophagus(sarcoId: string, resurrectionTime: Date | null) {
  const networkConfig = useNetworkConfig();
  const toast = useToast();

  const timeInSeconds = resurrectionTime ? Math.trunc(resurrectionTime.getTime() / 1000) : 0;

  const { config, isLoading } = usePrepareContractWrite({
    address: networkConfig.diamondDeployAddress,
    abi: EmbalmerFacet__factory.abi as Abi,
    functionName: 'rewrapSarcophagus',
    enabled: Boolean(resurrectionTime),
    args: [sarcoId, timeInSeconds],
  });

  const {
    write,
    isLoading: isRewrapping,
    isSuccess,
  } = useContractWrite({
    onSuccess() {
      toast(rewrapSuccess());
    },
    onError(e) {
      console.error(e);
      toast(rewrapFailure());
    },
    ...config,
  });

  return { rewrap: write, isLoading, isRewrapping, isSuccess };
}
