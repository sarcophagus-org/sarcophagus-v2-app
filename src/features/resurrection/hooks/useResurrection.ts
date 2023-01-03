import { arrayify } from 'ethers/lib/utils';
import { useGetSarcophagus } from 'hooks/viewStateFacet';
import { useGetSarcophagusArchaeologists } from 'hooks/viewStateFacet/useGetSarcophagusArchaeologists';
import { useArweave } from 'hooks/useArweave';
import { decrypt } from 'lib/utils/helpers';
import { useCallback, useEffect, useState } from 'react';
import { combine } from 'shamirs-secret-sharing-ts';

export const metadataDelimiter = Buffer.from('|', 'binary');
export const sharesDelimiter = Buffer.from('~', 'binary');

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

      const payloadBuffer = Buffer.from(arweaveFile);

      const metadataSplitIndex = payloadBuffer.findIndex(char => char === metadataDelimiter[0]);
      const sharesSplitIndex = payloadBuffer.findIndex(char => char === sharesDelimiter[0]);

      if (metadataSplitIndex === -1 || sharesSplitIndex === -1) throw Error('Bad data');

      const metadataBuffer = payloadBuffer.slice(0, metadataSplitIndex);
      const sharesBuffer = payloadBuffer.slice(metadataSplitIndex + 1, sharesSplitIndex);

      const payloadFile = payloadBuffer.slice(sharesSplitIndex + 1);
      const metadata = JSON.parse(metadataBuffer.toString());

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

      const decryptedResult = {
        fileName: metadata.fileName,
        data: `${metadata.type},${decryptedPayload.toString('base64')}`,
      };

      if (!decryptedResult.fileName || !decryptedResult.data) {
        return { error: 'The payload is missing the fileName or data', fileName: '', data: '' };
      }

      return decryptedResult;
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
