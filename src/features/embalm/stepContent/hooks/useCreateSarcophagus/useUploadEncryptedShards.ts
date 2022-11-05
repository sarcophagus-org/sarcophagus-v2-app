import React, { useCallback } from 'react';
import { split } from 'shamirs-secret-sharing-ts';
import { encryptShards } from '../../utils/createSarcophagus';
import { ArchaeologistEncryptedShard } from '../../../../../types';
import useArweaveService from '../../../../../hooks/useArweaveService';
import { useSelector } from '../../../../../store';

export function useUploadEncryptedShards(
  outerPrivateKey: string,
  setArchaeologistShards: React.Dispatch<React.SetStateAction<ArchaeologistEncryptedShard[]>>,
  setEncryptedShardsTxId: React.Dispatch<React.SetStateAction<string>>
) {
  const { selectedArchaeologists, requiredArchaeologists } = useSelector(x => x.embalmState);

  const { uploadToArweave } = useArweaveService();

  const uploadAndSetEncryptedShards = useCallback(async () => {
    try {
      // Step 1: Split the outer layer private key using shamirs secret sharing
      const shards: Uint8Array[] = split(outerPrivateKey, {
        shares: selectedArchaeologists.length,
        threshold: requiredArchaeologists,
      });

      // Step 2: Encrypt each shard of the outer layer private key using each archaeologist's public
      // key
      const archPublicKeys = selectedArchaeologists.map(x => x.publicKey!);
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
    uploadToArweave,
    setArchaeologistShards,
    setEncryptedShardsTxId,
  ]);

  return {
    uploadAndSetEncryptedShards,
  };
}
