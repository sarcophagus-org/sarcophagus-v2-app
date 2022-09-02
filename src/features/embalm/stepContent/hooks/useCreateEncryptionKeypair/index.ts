import { useToast } from '@chakra-ui/react';
import { generateOuterKeys, generateOuterKeysFailure } from 'lib/utils/toast';
import { useEffect, useState, useCallback } from 'react';
import { setOuterLayerKeys } from 'store/embalm/actions';
import { useDispatch, useSelector } from 'store/index';

/**
 * Calls ethers.Wallet.createRandom() on a separate worker thread.
 * Prevents the render from pausing for the wallet to be created.
 * Although it only takes about 250ms to create a wallet on average, the blip is noticeable
 * and leads to a bad user experience, especially if useEffect triggers multiple times.
 *
 * Go to `./worker.js` to see the code run by the worker.
 *
 * @returns A private and public key pair
 */
export async function createEncryptionKeypairAsync(): Promise<{
  privateKey: string;
  publicKey: string;
}> {
  return new Promise((resolve, reject) => {
    const worker = new Worker(new URL('./worker.js', import.meta.url));

    // Calls ethers.Wallet.createRandom() in the worker thread
    worker.postMessage({});

    // Listens to response from the worker thread
    worker.addEventListener('message', message => {
      const wallet = message.data;
      const privateKey = wallet.privateKey;
      const publicKey = wallet.publicKey;
      resolve({ privateKey, publicKey });
    });

    worker.addEventListener('error', error => {
      reject(error);
    });
  });
}

export function useCreateEncryptionKeypair() {
  const dispatch = useDispatch();
  const toast = useToast();
  const { outerPrivateKey, outerPublicKey } = useSelector(x => x.embalmState);
  const [isLoading, setIsLoading] = useState(false);

  const createEncryptionKeypair = useCallback(async () => {
    try {
      setIsLoading(true);
      const { privateKey, publicKey } = await createEncryptionKeypairAsync();
      dispatch(setOuterLayerKeys(privateKey, publicKey));
      const id = 'generateOuterKeys';
      if (!toast.isActive(id)) {
        toast({ ...generateOuterKeys(), id });
      }
    } catch (_error) {
      const error = _error as Error;
      toast(generateOuterKeysFailure(error.message));
    } finally {
      setIsLoading(false);
    }
  }, [dispatch, toast]);

  // Generates the key pair when the user opens the create encryption pair step
  // This effect will likely trigger twice, which is fine
  useEffect(() => {
    (async () => {
      if (!outerPrivateKey && !outerPublicKey) {
        await createEncryptionKeypair();
      }
    })();
  }, [createEncryptionKeypair, dispatch, outerPrivateKey, outerPublicKey, toast]);

  return { outerPrivateKey, outerPublicKey, isLoading, createEncryptionKeypair };
}
