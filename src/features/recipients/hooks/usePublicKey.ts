import { useSarcoToast } from 'components/SarcoToast';
import { arrayify, hashMessage, recoverPublicKey } from 'ethers/lib/utils';
import { publicKeyRetrieved } from 'lib/utils/toast';
import { useState } from 'react';
import { useSignMessage } from 'wagmi';

// A hook that uses wagmi's signMessge and ethers' recoverPublicKey to get the public key of a wallet
export function usePublicKey() {
  const sarcoToast = useSarcoToast();
  const [publicKey, setPublicKey] = useState('');

  const message = 'Sign this message to retrieve your public key.';

  // Prompts for user to sign a message. The signature is used to derive the wallet public key.
  const {
    error,
    isLoading,
    signMessage: wagmiSignMessage,
  } = useSignMessage({
    onSuccess(data, variables) {
      const signature = data;

      // Get the public key from the message and the signature.
      const recoveredPublicKey = recoverPublicKey(
        arrayify(hashMessage(Buffer.from(variables.message))),
        signature
      );
      setPublicKey(recoveredPublicKey);
      sarcoToast.open(publicKeyRetrieved());
    },
  });

  // Sign the given message using wagmi's signMessage
  function signMessage() {
    wagmiSignMessage({ message });
  }

  return { publicKey, signMessage, error, isLoading };
}
