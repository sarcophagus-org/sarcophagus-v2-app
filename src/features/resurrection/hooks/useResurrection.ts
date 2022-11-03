import { arrayify } from 'ethers/lib/utils';
import { useGetSarcophagus } from 'hooks/viewStateFacet';
import { useGetSarcophagusArchaeologists } from 'hooks/viewStateFacet/useGetSarcophagusArchaeologists';
import { fetchArweaveFileFallback } from 'lib/utils/arweave';
import { decrypt } from 'lib/utils/helpers';
import { useCallback, useEffect, useState } from 'react';
import { combine } from 'shamirs-secret-sharing-ts';

/**
 * Hook that handles resurrection of a sarcohpagus
 * @param sarcoId The sarcohpagus id
 * @param recipientPrivateKey The recipients private key
 */
export function useResurrection(sarcoId: string, recipientPrivateKey: string) {
  const sarcophagus = useGetSarcophagus(sarcoId);
  const archaeologists = useGetSarcophagusArchaeologists(sarcoId, sarcophagus?.archaeologists);
  const [canResurrect, setCanResurrect] = useState(false);

  // Set the canResurrect state based on if the sarcophagus has unencrypted shards
  useEffect(() => {
    if (!sarcophagus || !sarcophagus.minShards) return;
    const shards = archaeologists.filter(a => a.unencryptedShard);
    setCanResurrect(shards.length >= sarcophagus.minShards);
  }, [archaeologists, sarcophagus]);

  /**
   * Resurrects the sarcohpagus using the values passed in to the hook
   */
  const resurrect = useCallback(async (): Promise<{ fileName: string; data: string }> => {
    try {
      if (!canResurrect) return { fileName: '', data: '' };

      // Get the payload txId from the contract using the sarcoId
      // The sarcophagus should always have arweave tx ids
      // The first one is the tx id for the payload, the second is the tx id for the encrypted
      // shards which is not used here
      const payloadTxId = sarcophagus.arweaveTxIds[0];

      // In case the sarcophagus has no tx ids. This should never happen but we are checking just in
      // case.
      if (!payloadTxId) {
        throw new Error(`The Arwevae tx id for the payload is missing on sarcophagus ${sarcoId}`);
      }

      // Load the double encrypted payload from arweave using the txId
      // Uses the fallback function by default which makes a direct api call for the payload
      // outerLayer is returned as an arraybuffer
      const outerLayer = await fetchArweaveFileFallback(payloadTxId);
      const outerLayerBuffer = Buffer.from(outerLayer);

      // Convert the shards from their hex strings to Uint8Array
      const unencryptedShards = archaeologists.map(a => Buffer.from(arrayify(a.unencryptedShard)));

      // Apply SSS with the unencryped shards to derive the outer layer private key
      const outerLayerPrivateKey = combine(unencryptedShards).toString();

      // Decrypt the outer layer of the encrypted payload using the derived private key
      const singleEncryptedPayload = await decrypt(outerLayerPrivateKey, outerLayerBuffer);

      // Decrypt the inner layer of the encrypted payload using the recipientPublic key
      const decryptedPayload = await decrypt(recipientPrivateKey, singleEncryptedPayload);
      const { fileName, data } = JSON.parse(decryptedPayload.toString());

      if (!fileName || !data) {
        return { fileName: '', data: '' };
      }

      return { fileName, data };
    } catch (error) {
      throw new Error(`Error resurrecting sarcophagus: ${error}`);
    }
  }, [archaeologists, canResurrect, recipientPrivateKey, sarcoId, sarcophagus]);

  return { canResurrect, resurrect };
}
