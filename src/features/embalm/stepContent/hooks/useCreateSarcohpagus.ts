import { ethers } from 'ethers';
import { doubleHashShard, encrypt, readFileDataAsBase64 } from 'lib/utils/helpers';
import { useCallback } from 'react';
import { split } from 'shamirs-secret-sharing-ts';
import { setIsUploading } from 'store/bundlr/actions';
import {
  setShardPayloadData,
} from 'store/embalm/actions';
import { useDispatch, useSelector } from 'store/index';
import { useBundlr } from './useBundlr';
import { useSubmitSarcophagus } from 'hooks/embalmerFacet';
import { ArchaeologistEncryptedShard } from 'types';
import useArweaveService from 'hooks/useArweaveService';

async function encryptShards(publicKeys: string[], payload: Uint8Array[]): Promise<ArchaeologistEncryptedShard[]> {
  return Promise.all(publicKeys.map(async (publicKey, i) => ({
    publicKey,
    encryptedShard: ethers.utils.hexlify(await encrypt(publicKey, Buffer.from(payload[i]))),
    unencryptedShardDoubleHash: doubleHashShard(payload[i]),
  })));
}

export function useCreateSarcophagus() {
  const dispatch = useDispatch();
  const {
    recipientState,
    file,
    outerPublicKey,
    outerPrivateKey,
    selectedArchaeologists,
    payloadTxId,
    shardsTxId,
    totalArchaeologists,
    requiredArchaeologists,
  } = useSelector(x => x.embalmState);
  const { isUploading } = useSelector(x => x.bundlrState);
  const { uploadFile } = useBundlr();
  const { uploadArweaveFile } = useArweaveService();
  const { submitSarcophagus } = useSubmitSarcophagus();

  // TODO: Move this into its own hook and check all fields
  const canCreateSarcophagus = !!outerPublicKey && !!file;
  // const canCreateSarcophagus = recipientState.publicKey !== '' && !!outerPublicKey && !!file; // TODO: Uncomment

  const uploadToArweave = useCallback(async () => {
    const emptyData = { encryptedShards: [], encryptedShardsTxId: '' };
    try {
      // Prepare the payload
      if (!canCreateSarcophagus) return emptyData;

      const payload = await readFileDataAsBase64(file);

      // Step 1: Encrypt the inner layer
      // const encryptedInnerLayer = await encrypt(recipientState.publicKey, payload); // TODO: Uncomment
      const encryptedInnerLayer = await encrypt(outerPublicKey, payload);

      // Step 2: Encrypt the outer layer
      const encryptedOuterLayer = await encrypt(outerPublicKey, encryptedInnerLayer);

      // Step 3: Split the outer layer private key using shamirs secret sharing
      const shards: Uint8Array[] = split(outerPrivateKey, {
        shares: Number.parseInt(totalArchaeologists),
        threshold: Number.parseInt(requiredArchaeologists),
      });

      // Step 4: Encrypt each shard of the outer layer private key using each archaeologist's public
      // key
      // dispatch(setShards(encryptedShards));
      const archPublicKeys = selectedArchaeologists.map(x => x.publicKey!);
      const encryptedShards = await encryptShards(archPublicKeys, shards);

      // Step 5: Upload the double encrypted payload to the arweave bundlr
      const sarcophagusPayloadTxId = await uploadArweaveFile(encryptedOuterLayer); // TODO: change to use uploadFile for Bundlr
      // dispatch(setPayloadTxId(sarcophagusPayloadTxId));

      // Step 6: Upload the encrypted shards mapping to the arweave bundlr
      const mapping: Record<string, string> = encryptedShards.reduce((acc, shard) => ({ ...acc, [shard.publicKey]: shard.encryptedShard }), {});
      const encryptedShardsTxId = await uploadArweaveFile(Buffer.from(JSON.stringify(mapping))); // TODO: change to use uploadFile for Bundlr
      // dispatch(setShardsTxId(encryptedShardsTxId));

      dispatch(setShardPayloadData(encryptedShards, sarcophagusPayloadTxId, encryptedShardsTxId));
      return { encryptedShards, encryptedShardsTxId };
    } catch (error) {
      console.error(error);
      return emptyData;
    } finally {
      dispatch(setIsUploading(false));
    }
  }, [
    canCreateSarcophagus,
    file,
    outerPublicKey,
    totalArchaeologists,
    requiredArchaeologists,
    outerPrivateKey,
    selectedArchaeologists,
    uploadArweaveFile,
    dispatch
  ]);

  const handleCreate = useCallback(async () => {
    // Step 8: Create the sarcophagus

    submitSarcophagus();
  }, [submitSarcophagus]);

  return { uploadToArweave, handleCreate, isUploading, canCreateSarcophagus, payloadTxId, shardsTxId };
}
