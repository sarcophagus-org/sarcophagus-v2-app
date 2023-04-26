import { useToast } from '@chakra-ui/react';
import { rewrapFailure, rewrapSuccess } from 'lib/utils/toast';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { sarco as sarcoSdk } from 'sarcophagus-v2-sdk';

export function useRewrapSarcophagus(sarcoId: string, resurrectionTime: Date | null) {
  const toast = useToast();
  const navigate = useNavigate();

  const timeInSeconds = resurrectionTime ? Math.trunc(resurrectionTime.getTime() / 1000) : 0;

  const [isRewrapping, setIsRewrapping] = useState(false);
  const [error, setError] = useState<string>();

  function rewrap() {
    setError(undefined);
    setIsRewrapping(true);

    sarcoSdk!.rewrapSarcophagus(sarcoId, timeInSeconds, {
      onTxSuccess: () => {
        toast(rewrapSuccess());
        setIsRewrapping(false);
        navigate(`/dashboard/${sarcoId}`);
      },
    })
      .catch((e: Error) => {
        console.error(e);
        setError(e.message);
        toast(rewrapFailure());
        setIsRewrapping(false);
      });
  }

  return {
    rewrap,
    isRewrapping,
    error,
  };
}
