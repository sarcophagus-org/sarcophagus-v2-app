import { useToast } from '@chakra-ui/react';
import { EmbalmerFacet__factory } from '@sarcophagus-org/sarcophagus-v2-contracts';
import { Abi } from 'abitype';
import { useNetworkConfig } from 'lib/config';
import { rewrapFailure, rewrapSuccess } from 'lib/utils/toast';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useContractWrite, usePrepareContractWrite, useWaitForTransaction } from 'wagmi';

export function useRewrapSarcophagus(sarcoId: string, resurrectionTime: Date | null) {
  const networkConfig = useNetworkConfig();
  const toast = useToast();
  const navigate = useNavigate();

  const timeInSeconds = resurrectionTime ? Math.trunc(resurrectionTime.getTime() / 1000) : 0;

  const {
    config,
    isError: mayFail,
    error: likelyError,
  } = usePrepareContractWrite({
    address: networkConfig.diamondDeployAddress,
    abi: EmbalmerFacet__factory.abi as Abi,
    functionName: 'rewrapSarcophagus',
    enabled: Boolean(resurrectionTime),
    args: [sarcoId, timeInSeconds],
  });

  const [isRewrapping, setIsRewrapping] = useState(false);

  const { write, data } = useContractWrite({
    ...config,
    onError() {
      setIsRewrapping(false);
    },
  });

  function rewrap() {
    write?.();
    setIsRewrapping(true);
  }

  const {
    isSuccess,
    isLoading,
    isError,
    error: writeError,
  } = useWaitForTransaction({
    hash: data?.hash,
    onSuccess() {
      toast(rewrapSuccess());
      setIsRewrapping(false);
      navigate(`/dashboard/${sarcoId}`);
    },
    onError(e) {
      console.error(e);
      toast(rewrapFailure());
      setIsRewrapping(false);
    },
  });

  return {
    rewrap,
    isRewrapping,
    isLoading,
    isSuccess,
    mayFail,
    isError,
    error: ((writeError || likelyError) as Error | undefined)?.message || '',
  };
}
