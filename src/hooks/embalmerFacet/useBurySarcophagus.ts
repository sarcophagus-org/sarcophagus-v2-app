import { useToast } from '@chakra-ui/react';
import { buryFailure, burySuccess } from 'lib/utils/toast';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { sarco } from '@sarcophagus-org/sarcophagus-v2-sdk-client';

export function useBurySarcophagus(sarcoId: string) {
  const toast = useToast();
  const navigate = useNavigate();

  const [isBurying, setIsBurying] = useState(false);
  const [error, setError] = useState<string>();

  async function bury() {
    setIsBurying(true);
    try {
      await sarco.api.burySarcophagus(sarcoId);
      toast(burySuccess());
      navigate('/dashboard');
    } catch (e) {
      const err = e as Error;
      console.error(err);
      toast(buryFailure());
      setError(err.message);
    } finally {
      setIsBurying(false);
    }
  }

  return { bury, isBurying, error };
}
