import { Signature, Wallet } from 'ethers';
import { splitSignature } from 'ethers/lib/utils';
import { isBytes32, sign } from 'lib/utils/helpers';
import { useEffect, useState } from 'react';

/**
 * A hook that creates signatures for each private key provided including sarcophagusId and
 * paymentAddress in the message. Updates automatically when a private key is changed.
 * @param sarcophagusId the id of the sarcophagus
 * @param archaeologistPrivateKeys the private keys of the archaeologists
 * @param paymentAddress the address to pay the sarcophagus to
 * @returns an array of signatures
 */
export function useAccusedWallets(
  sarcophagusId: string,
  archaeologistPrivateKeys: string[],
  paymentAddress: string | undefined
): { signatures: Signature[]; publicKeys: string[] } {
  const [signatures, setSignatures] = useState<Signature[]>([]);
  const [publicKeys, setPublicKeys] = useState<string[]>([]);

  useEffect(() => {
    (async () => {
      try {
        const newSignatures: Signature[] = [];
        const newPublicKeys: string[] = [];

        for (let i = 0; i < archaeologistPrivateKeys.length; i++) {
          const untrimmedPrivateKey = archaeologistPrivateKeys[i];
          const privateKey = untrimmedPrivateKey.trim();

          // Only sign the messages if the values are valid
          if (!isBytes32(privateKey) || !isBytes32(sarcophagusId)) {
            continue;
          }

          const wallet = new Wallet(privateKey);

          // TODO: Update message to implement EIP-712 standard
          const signature = splitSignature(
            await sign(
              wallet,
              [sarcophagusId.toString(), paymentAddress || '0x'],
              ['bytes32', 'address']
            )
          );
          newSignatures[i] = signature;
          newPublicKeys[i] = wallet.publicKey;
        }

        setSignatures(newSignatures);
        setPublicKeys(newPublicKeys);
      } catch (error) {
        console.error(error);
      }
    })();
  }, [archaeologistPrivateKeys, paymentAddress, sarcophagusId]);

  return { signatures, publicKeys };
}
