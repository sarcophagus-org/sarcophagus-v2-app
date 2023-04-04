import { useToast } from '@chakra-ui/react';
import { ThirdPartyFacet__factory } from '@sarcophagus-org/sarcophagus-v2-contracts';
import { Abi } from 'abitype';
import { useNetworkConfig } from 'lib/config';
import { cleanFailure, cleanSuccess } from 'lib/utils/toast';
import { useContractWrite, usePrepareContractWrite, useWaitForTransaction } from 'wagmi';

export function useCleanSarcophagus(sarcoId: string, canEmbalmerClean: boolean) {
  const networkConfig = useNetworkConfig();
  const toast = useToast();

  const { config, isError: mayFail } = usePrepareContractWrite({
    address: networkConfig.diamondDeployAddress,
    abi: ThirdPartyFacet__factory.abi as Abi,
    enabled: canEmbalmerClean,
    functionName: 'clean',
    args: [sarcoId],
  });

  const { write, isError, data } = useContractWrite({
    onError: () => toast(cleanFailure()),
    ...config,
  });

  const { isSuccess, isLoading } = useWaitForTransaction({
    hash: data?.hash,
    onSuccess: () => toast(cleanSuccess()),
    onError(e) {
      console.error(e);
      toast(cleanFailure());
    },
  });

  return {
    clean: write,
    isCleaning: isLoading,
    isSuccess,
    isError,
    mayFail,
  };
}
