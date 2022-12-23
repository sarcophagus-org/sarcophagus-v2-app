import { arrayify } from 'ethers/lib/utils';
import { useGetSarcophagus } from 'hooks/viewStateFacet';
import { useGetSarcophagusArchaeologists } from 'hooks/viewStateFacet/useGetSarcophagusArchaeologists';
import { useArweave } from 'hooks/useArweave';
import { decrypt } from 'lib/utils/helpers';
import { useCallback, useEffect, useState } from 'react';
import { combine } from 'shamirs-secret-sharing-ts';
import { ArweavePayload } from 'types';

/**
 * Hook that handles resurrection of a sarcohpagus
 * @param sarcoId The sarcohpagus id
 * @param recipientPrivateKey The recipients private key
 */
export function useResurrection(sarcoId: string, recipientPrivateKey: string) {
  const { sarcophagus } = useGetSarcophagus(sarcoId);
  const archaeologists = useGetSarcophagusArchaeologists(
    sarcoId,
    sarcophagus?.archaeologistAddresses ?? []
  );
  const [canResurrect, setCanResurrect] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isResurrecting, setIsResurrecting] = useState(false);
  const { fetchArweaveFileFallback } = useArweave();

  // Set the canResurrect state based on if the sarcophagus has unencrypted shards
  useEffect(() => {
    setIsLoading(true);
    if (!sarcophagus || !sarcophagus.threshold) return;
    const archsWithShards = archaeologists.filter(a => a.privateKey);
    setCanResurrect(archsWithShards.length >= sarcophagus.threshold);
    setIsLoading(false);
  }, [archaeologists, sarcophagus]);

  /**
   * Resurrects the sarcohpagus using the values passed in to the hook
   */
  const resurrect = useCallback(async (): Promise<{
    fileName: string;
    data: string;
    error?: string;
  }> => {
    setIsResurrecting(true);
    try {
      if (!canResurrect) {
        throw new Error('Cannot resurrect');
      }

      // Get the payload txId from the contract using the sarcoId
      const payloadTxId = sarcophagus?.arweaveTxId;

      // In case the sarcophagus has no tx id. This should never happen but we are checking just in
      // case.
      if (!payloadTxId) {
        throw new Error(`The Arwevae tx id for the payload is missing on sarcophagus ${sarcoId}`);
      }

      // Load the payload from arweave using the txId, and retrieve the double-encrypted key shares
      // Uses the fallback function by default which makes a direct api call for the payload
      console.log('get arweave file');

      const arweaveFile = await fetchArweaveFileFallback(payloadTxId);
      // const payloadBuffer = await fetchArweaveFileFallback(payloadTxId);
      // const payload: ArweavePayload = JSON.parse(Buffer.from(payloadBuffer).toString());

      const payloadBuffer = Buffer.from(arweaveFile);
      const splitIndex = payloadBuffer.findIndex(char => char === 10);

      if (splitIndex === -1) throw Error('Bad data');
      const sharesBuffer = payloadBuffer.slice(0, splitIndex);

      const payloadFile = payloadBuffer.slice(splitIndex + 1, payloadBuffer.length);

      const payloadKeyShares = JSON.parse(sharesBuffer.toString());

      // Decrypt the key shares. Each share is double-encrypted with an inner layer of encryption
      // with the recipient's key, and an outer layer of encryption with the archaeologist's key.
      const decryptedKeyShares: Buffer[] = [];
      for await (const arch of archaeologists) {
        const archDoubleEncryptedKeyShare = payloadKeyShares[arch.publicKey];

        // Decrypt outer layer with arch private key
        const recipientEncryptedKeyShare = await decrypt(
          arch.privateKey,
          Buffer.from(arrayify(archDoubleEncryptedKeyShare))
        );

        // Decrypt inner layer with rceipient private key
        const decryptedKeyShare = await decrypt(recipientPrivateKey, recipientEncryptedKeyShare);

        decryptedKeyShares.push(decryptedKeyShare);
      }

      // Apply SSS with the decrypted shards to derive the payload file's decryption key
      const payloadDecryptionKey = combine(decryptedKeyShares).toString();

      // Decrypt the payload with the recombined key
      const decryptedPayload = await decrypt(payloadDecryptionKey, payloadFile);
      console.log('decryptedPayload', decryptedPayload);
      console.log('decryptedPayload', decryptedPayload.toString());
      console.log('decryptedPayload', JSON.parse(decryptedPayload.toString()));

      const { fileName, data } = JSON.parse(decryptedPayload.toString());

      if (!fileName || !data) {
        return { fileName, data, error: 'The payload is missing the fileName or data' };
      }

      return { fileName, data };
    } catch (error) {
      console.error(`Error resurrecting sarcophagus: ${error}`);
      return {
        fileName: '',
        data: '',
        error: 'Could not claim Sarcophagus. Please make sure you have the right private key.',
      };
    } finally {
      setIsResurrecting(false);
    }
  }, [
    archaeologists,
    canResurrect,
    recipientPrivateKey,
    sarcoId,
    sarcophagus,
    fetchArweaveFileFallback,
  ]);

  return { canResurrect, resurrect, isResurrecting, isLoading };
}
