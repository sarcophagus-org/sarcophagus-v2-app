import { Signature, Wallet } from 'ethers';
import { defaultAbiCoder, isAddress, splitSignature } from 'ethers/lib/utils';
import { isBytes32 } from 'lib/utils/helpers';
import { useEffect, useState } from 'react';

/**
 * A hook that creates signatures for each private key provided including sarcophagusId and
 * paymentAddress in the message. Updates automatically when a private key is changed.
 * @param sarcophagusId the id of the sarcophagus
 * @param archaeologistPrivateKeys the private keys of the archaeologists
 * @param paymentAddress the address to pay the sarcophagus to
 * @returns an array of signatures
 */
export function useSignatures(
  sarcophagusId: string,
  archaeologistPrivateKeys: string[],
  paymentAddress: string
): Signature[] {
  const [signatures, setSignatures] = useState<Signature[]>([]);

  useEffect(() => {
    (async () => {
      try {
        const newSignatures: Signature[] = [];

        for (let i = 0; i < archaeologistPrivateKeys.length; i++) {
          const untrimmedPrivateKey = archaeologistPrivateKeys[i];
          const privateKey = untrimmedPrivateKey.trim();

          // Only sign the messages if the values are valid
          if (!isBytes32(privateKey) || !isBytes32(sarcophagusId) || !isAddress(paymentAddress)) {
            return;
          }

          const wallet = new Wallet(privateKey);

          // TODO: Update message to implement EIP-712 standard
          const signature = splitSignature(
            await wallet.signMessage(
              defaultAbiCoder.encode(['string', 'string'], [sarcophagusId, paymentAddress])
            )
          );
          newSignatures[i] = signature;
        }

        setSignatures(newSignatures);
      } catch (error) {
        console.error(error);
      }
    })();
  }, [archaeologistPrivateKeys, paymentAddress, sarcophagusId]);

  return signatures;
}
