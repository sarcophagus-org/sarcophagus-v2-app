import { arrayify } from 'ethers/lib/utils';
import { useGetSarcophagus } from 'hooks/viewStateFacet';
import { useGetSarcophagusArchaeologists } from 'hooks/viewStateFacet/useGetSarcophagusArchaeologists';
import { useArweave } from 'hooks/useArweave';
import { decrypt } from 'lib/utils/helpers';
import { useCallback, useEffect, useState } from 'react';
import { combine } from 'shamirs-secret-sharing-ts';
import { useNetworkConfig } from 'lib/config';
import { hardhat, mainnet } from '@wagmi/chains';
import { ethers } from 'ethers';

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
  const { fetchArweaveFileFallback, fetchArweaveFile, downloadProgress } = useArweave();

  const networkConfig = useNetworkConfig();

  // Set the canResurrect state based on if the sarcophagus has unencrypted shards
  useEffect(() => {
    setIsLoading(true);
    if (!sarcophagus || !sarcophagus.threshold) return;
    const archsWithShards = archaeologists.filter(a => a.privateKey !== ethers.constants.HashZero);

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

      // Load the payload from arweave using the txId
      const arweaveFile =
        networkConfig.chainId === hardhat.id || networkConfig.chainId === mainnet.id
          ? await fetchArweaveFile(payloadTxId)
          : await fetchArweaveFileFallback(payloadTxId);

      if (!arweaveFile) throw Error('Failed to download file from arweave');

      // Decrypt the key shares. Each share is double-encrypted with an inner layer of encryption
      // with the recipient's key, and an outer layer of encryption with the archaeologist's key.
      const decryptedKeyShares: Buffer[] = [];
      for await (const arch of archaeologists) {
        const archDoubleEncryptedKeyShare = arweaveFile.keyShares[arch.publicKey];

        // Decrypt outer layer with arch private key
        const recipientEncryptedKeyShare = await decrypt(
          arch.privateKey,
          Buffer.from(arrayify(archDoubleEncryptedKeyShare))
        );

        // Decrypt inner layer with rceipient private key
        const decryptedKeyShare = await decrypt(recipientPrivateKey, recipientEncryptedKeyShare);

        decryptedKeyShares.push(decryptedKeyShare);
      }

      // Apply SSS with the decrypted shares to derive the payload file's decryption key
      const payloadDecryptionKey = combine(decryptedKeyShares).toString();

      // Decrypt the payload with the recombined key
      const decryptedPayload = await decrypt(payloadDecryptionKey, arweaveFile.fileBuffer);

      const decryptedfileName = await decrypt(
        recipientPrivateKey,
        Buffer.from(arweaveFile.metadata.fileName, 'binary')
      );
      const decryptedfileType = await decrypt(
        recipientPrivateKey,
        Buffer.from(arweaveFile.metadata.type, 'binary')
      );

      const decryptedResult = {
        fileName: decryptedfileName.toString('binary'),
        data: `${decryptedfileType.toString('binary')},${decryptedPayload.toString('base64')}`,
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
    canResurrect,
    sarcophagus?.arweaveTxId,
    networkConfig.chainId,
    fetchArweaveFile,
    fetchArweaveFileFallback,
    sarcoId,
    archaeologists,
    recipientPrivateKey,
  ]);

  return { canResurrect, resurrect, isResurrecting, isLoading, downloadProgress };
}
