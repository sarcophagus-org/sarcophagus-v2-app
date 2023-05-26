import { useState } from 'react';
import { RecoverPublicKeyErrorStatus, sarco } from 'sarcophagus-v2-sdk';
import { useDispatch } from 'store';
import { RecipientSetByOption, setRecipientState } from 'store/embalm/actions';

export function useRecoverPublicKey() {
  const [isLoading, setIsLoading] = useState(false);
  const [errorStatus, setErrorStatus] = useState<RecoverPublicKeyErrorStatus>();
  const dispatch = useDispatch();

  const recoverPublicKey = async (address: string) => {
    try {
      setIsLoading(true);
      const result = await sarco.utils.recoverPublicKey(address);

      if (!result.error) {
        dispatch(
          setRecipientState({
            publicKey: result.publicKey!,
            address: address,
            setByOption: RecipientSetByOption.ADDRESS,
          })
        );
      }

      setErrorStatus(result.error);
      console.log('Failed to recover', result.error);
    } catch (_error) {
      const error = _error as Error;
      console.log('useRecoverPublicKey error', error);
      setErrorStatus(RecoverPublicKeyErrorStatus.ERROR);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    recoverPublicKey,
    isLoading,
    errorStatus,
    clearErrorStatus: () => setErrorStatus(undefined),
  };
}
