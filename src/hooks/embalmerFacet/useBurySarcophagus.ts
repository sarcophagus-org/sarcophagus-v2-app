import { useToast } from '@chakra-ui/react';
import { buryFailure, burySuccess } from 'lib/utils/toast';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { sarco as sarcoSdk } from 'sarcophagus-v2-sdk';


export function useBurySarcophagus(sarcoId: string) {
  const toast = useToast();
  const navigate = useNavigate();

  // Wagmi is for some reason unable to track when write has been called
  const [isBurying, setIsBurying] = useState(false);
  const [error, setError] = useState<string>();

  function bury() {
    setIsBurying(true);
    sarcoSdk!
      .burySarcophagus(sarcoId, {
        onTxSuccess: () => {
          toast(burySuccess());
          setIsBurying(false);
          navigate('/dashboard');
        },
      })
      .catch((e: Error) => {
        console.error(e);
        toast(buryFailure());
        setIsBurying(false);
        setError(e.message);
      });
  }

  return { bury, isBurying, error };
}
