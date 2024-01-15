import { useState } from 'react';
import { RecoverPublicKeyErrorStatus, sarco } from '@sarcophagus-org/sarcophagus-v2-sdk-client';
import { useDispatch } from 'store/index';
import { RecipientSetByOption, setRecipientState } from 'store/embalm/actions';
import { useNetwork } from 'wagmi';

const ETHERSCAN_KEY_LOOKUP: { [key: number]: string | undefined } = {
  // TODO: add more keys as needed
  137: process.env.REACT_APP_POLYGONSCAN_API_KEY
};
export function useRecoverPublicKey() {
  const [isLoading, setIsLoading] = useState(false);
  const [publicKey, setPublicKey] = useState<string>();
  const [errorStatus, setErrorStatus] = useState<RecoverPublicKeyErrorStatus | null>(null);
  const { chain } = useNetwork();
  const dispatch = useDispatch();

  const recoverPublicKey = async (address: string) => {
    setIsLoading(true);
    setPublicKey(undefined);
    const response = await sarco.utils.recoverPublicKey(address, chain?.id ? ETHERSCAN_KEY_LOOKUP[chain.id] : undefined);
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
