import { useCallback, useContext } from 'react';
import { split } from 'shamirs-secret-sharing-ts';
import { encryptShards } from '../../utils/createSarcophagus';
import useArweaveService from '../../../../../hooks/useArweaveService';
import { useSelector } from '../../../../../store';
import { CreateSarcophagusContext } from '../../context/CreateSarcophagusContext';
import { useRequestPublicKeys } from './useRequestPublicKeys';

export function useUploadEncryptedShards() {
  const { selectedArchaeologists, requiredArchaeologists } = useSelector(x => x.embalmState);
  const { outerPrivateKey, setArchaeologistShards, setEncryptedShardsTxId } =
    useContext(CreateSarcophagusContext);

  const { uploadToArweave } = useArweaveService();
  const { requestPublicKeys } = useRequestPublicKeys();

  const uploadAndSetEncryptedShards = useCallback(async () => {
    try {
      // Step 1: Split the outer layer private key using shamirs secret sharing
      const shards: Uint8Array[] = split(outerPrivateKey, {
        shares: selectedArchaeologists.length,
        threshold: requiredArchaeologists,
      });

      // Step 2: Encrypt each shard of the outer layer private key using each archaeologist's public
      // key
      const archPublicKeys = await requestPublicKeys(selectedArchaeologists);
      const encShards = await encryptShards(archPublicKeys, shards);

      // Step 3: Create a mapping of arch public keys -> encrypted shards; upload to arweave
      const mapping: Record<string, string> = encShards.reduce(
        (acc, shard) => ({
          ...acc,
          [shard.publicKey]: shard.encryptedShard,
        }),
        {}
      );

      const txId = await uploadToArweave(Buffer.from(JSON.stringify(mapping)));

      setArchaeologistShards(encShards);
      setEncryptedShardsTxId(txId);
    } catch (error: any) {
      throw new Error(error.message || 'Error uploading encrypted shards to Bundlr');
    }
  }, [
    requiredArchaeologists,
    outerPrivateKey,
    selectedArchaeologists,
    requestPublicKeys,
    uploadToArweave,
    setArchaeologistShards,
    setEncryptedShardsTxId,
  ]);

  return {
    uploadAndSetEncryptedShards,
  };
}
