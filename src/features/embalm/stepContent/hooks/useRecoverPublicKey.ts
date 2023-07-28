import { useState } from 'react';
import { RecoverPublicKeyErrorStatus, sarco } from '@sarcophagus-org/sarcophagus-v2-sdk-client';
import { useDispatch } from 'store/index';
import { RecipientSetByOption, setRecipientState } from 'store/embalm/actions';

export function useRecoverPublicKey() {
  const [isLoading, setIsLoading] = useState(false);
  const [publicKey, setPublicKey] = useState<string>();
  const [errorStatus, setErrorStatus] = useState<RecoverPublicKeyErrorStatus | null>(null);
  const dispatch = useDispatch();

  const recoverPublicKey = async (address: string) => {
    setIsLoading(true);
    setPublicKey(undefined);
    const response = await sarco.utils.recoverPublicKey(address);
    if (response.error) {
      setErrorStatus(response.error);
      setIsLoading(false);
    } else {
      setIsLoading(false);
      setPublicKey(response.publicKey);
      dispatch(
        setRecipientState({
          publicKey: response.publicKey!,
          address: address,
          setByOption: RecipientSetByOption.ADDRESS,
        })
      );
    }
  };

  return {
    recoverPublicKey,
    publicKey,
    isLoading,
    errorStatus,
    clearErrorStatus: () => setErrorStatus(null),
  };
}
