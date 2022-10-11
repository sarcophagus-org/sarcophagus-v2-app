import { ethers } from 'ethers';
import { doubleHashShard, encrypt, readFileDataAsBase64 } from 'lib/utils/helpers';
import { useCallback } from 'react';
import { split } from 'shamirs-secret-sharing-ts';
import { setIsUploading } from 'store/bundlr/actions';
import {
  setPayloadTxId,
  setShardsTxId,
  setShards,
} from 'store/embalm/actions';
import { useDispatch, useSelector } from 'store/index';
import { useBundlr } from './useBundlr';
import { useSubmitSarcophagus } from 'hooks/embalmerFacet';
import { ArcheaologistEncryptedShard } from 'types';

async function encryptShards(publicKeys: string[], payload: Uint8Array[]): Promise<ArcheaologistEncryptedShard[]> {
  return Promise.all(publicKeys.map(async (publicKey, i) => ({
    publicKey,
    encryptedShard: ethers.utils.hexlify(await encrypt(publicKey, Buffer.from(payload[i]))),
    unencryptedShardDoubleHash: doubleHashShard(payload[i]),
  })));
}

export function useCreateSarcophagus() {
  const dispatch = useDispatch();
  const {
    recipient,
    file,
    outerPublicKey,
    outerPrivateKey,
    selectedArchaeologists,
    payloadTxId,
    shardsTxId,
  } = useSelector(x => x.embalmState);
  const { isUploading } = useSelector(x => x.bundlrState);
  const { uploadFile } = useBundlr();
  const { submitSarcophagus } = useSubmitSarcophagus();

  // TODO: Move this into its own hook and check all fields
  const canCreateSarcophagus = !!outerPublicKey && !!file;
  // const canCreateSarcophagus = recipient.publicKey !== '' && !!outerPublicKey && !!file; // TODO: Uncomment

  const uploadToArweave = useCallback(async () => {
    try {
      // Prepare the payload
      if (!canCreateSarcophagus) return;
      const payload = await readFileDataAsBase64(file);

      // Step 1: Encrypt the inner layer
      // const encryptedInnerLayer = await encrypt(recipient.publicKey, payload); // TODO: Uncomment
      const encryptedInnerLayer = await encrypt(outerPublicKey, payload);

      // Step 2: Encrypt the outer layer
      const encryptedOuterLayer = await encrypt(outerPublicKey, encryptedInnerLayer);

      // Step 3: Split the outer layer private key using shamirs secret sharing
      const shards: Uint8Array[] = split(outerPrivateKey, {
        // TODO: Use `totalArchaeologists` and `requiredArchaeologists` instead of selectedArchaeologists.length
        shares: selectedArchaeologists.length,
        threshold: selectedArchaeologists.length,
      });

      // Step 4: Encrypt each shard of the outer layer private key using each archaeologist's public
      // key
      const archPublicKeys = selectedArchaeologists.map(x => x.publicKey!);
      const encryptedShards = await encryptShards(archPublicKeys, shards);

      //save shards
      dispatch(setShards(encryptedShards));

      // Step 5: Upload the double encrypted payload to the arweave bundlr
      const sarcophagusPayloadTxId = await uploadFile(encryptedOuterLayer);
      dispatch(setPayloadTxId(sarcophagusPayloadTxId));

      // Step 6: Upload the encrypted shards mapping to the arweave bundlr
      const mapping: Record<string, string> = encryptedShards.reduce((acc, shard) => ({ ...acc, [shard.publicKey]: shard.encryptedShard }), {});
      const encryptedShardsTxId = await uploadFile(Buffer.from(JSON.stringify(mapping)));
      dispatch(setShardsTxId(encryptedShardsTxId));
    } catch (error) {
      console.error(error);
    } finally {
      dispatch(setIsUploading(false));
    }
  }, [
    dispatch,
    file,
    outerPrivateKey,
    outerPublicKey,
    recipient.publicKey,
    selectedArchaeologists,
    uploadFile,
    canCreateSarcophagus,
  ]);

  const handleCreate = useCallback(async () => {
    // Step 8: Create the sarcophagus

    submitSarcophagus();
  }, [submitSarcophagus]);

  return { uploadToArweave, handleCreate, isUploading, canCreateSarcophagus, payloadTxId, shardsTxId };
}
