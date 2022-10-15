import { ethers } from 'ethers';
import { doubleHashShard, encrypt, readFileDataAsBase64 } from 'lib/utils/helpers';
import { useCallback } from 'react';
import { split } from 'shamirs-secret-sharing-ts';
import { setIsUploading } from 'store/bundlr/actions';
import {
  setSarcophagusPayloadTxId,
  setShardPayloadData
} from 'store/embalm/actions';
import { useDispatch, useSelector } from 'store/index';
// import { useBundlr } from './useBundlr';
import { useSubmitSarcophagus } from 'hooks/embalmerFacet';
import { ArchaeologistEncryptedShard } from 'types';
import useArweaveService from 'hooks/useArweaveService';

async function encryptShards(publicKeys: string[], payload: Uint8Array[]): Promise<ArchaeologistEncryptedShard[]> {
  return Promise.all(publicKeys.map(async (publicKey, i) => ({
    publicKey,
    encryptedShard: ethers.utils.hexlify(await encrypt(publicKey, Buffer.from(payload[i]))),
    unencryptedShardDoubleHash: doubleHashShard(payload[i])
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
    requiredArchaeologists
  } = useSelector(x => x.embalmState);
  const { isUploading } = useSelector(x => x.bundlrState);
  // const { uploadFile } = useBundlr();
  const { uploadArweaveFile } = useArweaveService();
  const { submitSarcophagus } = useSubmitSarcophagus();

  // TODO: Move this into its own hook and check all fields
  // TODO: render a message to the user about what data is missing
  const canCreateSarcophagus = recipientState.publicKey !== '' && !!outerPublicKey && !!file;

  const uploadAndSetDoubleEncryptedFile = useCallback(async () => {
    const emptyData = { sarcophagusPayloadTxId: '' };

    if (!canCreateSarcophagus) return emptyData;

    const payload = await readFileDataAsBase64(file);

    // Step 1: Encrypt the inner layer
    const encryptedInnerLayer = await encrypt(recipientState.publicKey, payload); // TODO: Restore this line and remove line below when in-app create sarco flow is ready

    // Step 2: Encrypt the outer layer
    const encryptedOuterLayer = await encrypt(outerPublicKey, encryptedInnerLayer);

    // Step 5: Upload the double encrypted payload to the arweave bundlr
    const sarcophagusPayloadTxId = await uploadArweaveFile(encryptedOuterLayer); // TODO: change to use uploadFile for Bundlr, once local testing figured out

    dispatch(setSarcophagusPayloadTxId(sarcophagusPayloadTxId));
  }, []);

  const uploadAndSetEncryptedShards = useCallback(async () => {
    const emptyData = { encryptedShards: [], encryptedShardsTxId: '' };
    try {
      // Prepare the payload
      if (!canCreateSarcophagus) return emptyData;

      // Step 1: Split the outer layer private key using shamirs secret sharing
      const shards: Uint8Array[] = split(outerPrivateKey, {
        shares: Number.parseInt(totalArchaeologists),
        threshold: Number.parseInt(requiredArchaeologists)
      });

      // Step 2: Encrypt each shard of the outer layer private key using each archaeologist's public
      // key
      const archPublicKeys = selectedArchaeologists.map(x => x.publicKey!);
      const encryptedShards = await encryptShards(archPublicKeys, shards);

      // Step 3: Upload the encrypted shards mapping to the arweave bundlr
      const mapping: Record<string, string> = encryptedShards.reduce((acc, shard) => ({
        ...acc,
        [shard.publicKey]: shard.encryptedShard
      }), {});

      const encryptedShardsTxId = await uploadArweaveFile(Buffer.from(JSON.stringify(mapping))); // TODO: change to use uploadFile for Bundlr, once local testing figured out

      dispatch(setShardPayloadData(encryptedShards, encryptedShardsTxId));
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

  return {
    uploadAndSetEncryptedShards,
    uploadAndSetDoubleEncryptedFile,
    handleCreate,
    isUploading,
    canCreateSarcophagus,
    payloadTxId,
    shardsTxId
  };
}
