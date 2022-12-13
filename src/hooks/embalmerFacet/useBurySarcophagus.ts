import { useToast } from '@chakra-ui/react';
import { EmbalmerFacet__factory } from '@sarcophagus-org/sarcophagus-v2-contracts';
import { Abi } from 'abitype';
import { useNetworkConfig } from 'lib/config';
import { buryFailure, burySuccess } from 'lib/utils/toast';
import { useState } from 'react';
import { useContractWrite, usePrepareContractWrite, useWaitForTransaction } from 'wagmi';

export function useBurySarcophagus(sarcoId: string) {
  const networkConfig = useNetworkConfig();
  const toast = useToast();

  const { config, isError } = usePrepareContractWrite({
    address: networkConfig.diamondDeployAddress,
    abi: EmbalmerFacet__factory.abi as Abi,
    functionName: 'burySarcophagus',
    enabled: !!sarcoId,
    args: [sarcoId],
  });

  // Wagmi is for some reason unable to track when write has been called
  const [isBurying, setIsBurying] = useState(false);

  const { write, data } = useContractWrite({
    ...config,
    onError() {
      setIsBurying(false);
    },
  });

  function bury() {
    write?.();
    setIsBurying(true);
  }

  const { isLoading, isSuccess } = useWaitForTransaction({
    hash: data?.hash,
    onSuccess() {
      toast(burySuccess());
      setIsBurying(false);
    },
    onError(e) {
      console.error(e);
      toast(buryFailure());
      setIsBurying(false);
    },
  });

  return { bury, isBurying, isLoading, isSuccess, isError };
}
