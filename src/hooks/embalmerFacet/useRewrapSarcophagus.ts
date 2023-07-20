import { useToast } from '@chakra-ui/react';
import { rewrapFailure, rewrapSuccess } from 'lib/utils/toast';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { sarco } from '@sarcophagus-org/sarcophagus-v2-sdk-client';

export function useRewrapSarcophagus(sarcoId: string, resurrectionTime: Date | null) {
  const toast = useToast();
  const navigate = useNavigate();

  const timeInSeconds = resurrectionTime ? Math.trunc(resurrectionTime.getTime() / 1000) : 0;

  const [isRewrapping, setIsRewrapping] = useState(false);
  const [error, setError] = useState<string>();

  async function rewrap() {
    setError(undefined);
    setIsRewrapping(true);
    try {
      await sarco.api.rewrapSarcophagus(sarcoId, timeInSeconds);
      toast(rewrapSuccess());
      setIsRewrapping(false);
      navigate(`/dashboard/${sarcoId}`);
    } catch (e) {
      const err = e as Error;
      console.error(err);
      toast(rewrapFailure());
      setError(err.message);
    } finally {
      setIsRewrapping(false);
    }
  }

  return {
    rewrap,
    isRewrapping,
    error,
  };
}
