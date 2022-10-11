import { BigNumber, ethers } from 'ethers';
import { privateKeys } from 'lib/mocks/privateKeys';
import { encrypt, readFileDataAsBase64 } from 'lib/utils/helpers';
import { useCallback, useEffect } from 'react';
import { split } from 'shamirs-secret-sharing-ts';
import { setIsUploading } from 'store/bundlr/actions';
import {
  setPayloadTxId,
  setSelectedArchaeologists,
  setShardsTxId,
  setShards,
} from 'store/embalm/actions';
import { useDispatch, useSelector } from 'store/index';
import { Archaeologist } from 'types/index';
import { useBundlr } from './useBundlr';
import { useSubmitSarcophagus } from 'hooks/embalmerFacet';

async function encryptShards(publicKeys: string[], payload: Uint8Array[]): Promise<Buffer[]> {
  return Promise.all(publicKeys.map(async (key, i) => encrypt(key, Buffer.from(payload[i]))));
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
  const { createSarcophagus } = useSubmitSarcophagus();

  // TODO: Move this into its own hook and check all fields
  const canCreateSarcophagus = recipient.publicKey !== '' && !!outerPublicKey && !!file;

  const handleSubmit = useCallback(async () => {
    try {
      // Prepare the payload
      if (recipient.publicKey === '' || !file || !outerPublicKey) return;
      const payload = await readFileDataAsBase64(file);

      // Step 1: Encrypt the inner layer
      const encryptedInnerLayer = await encrypt(recipient.publicKey, payload);

      // Step 2: Encrypt the outer layer
      const encryptedOuterLayer = await encrypt(outerPublicKey, encryptedInnerLayer);

      // Step 3: Split the outer layer private key using shamirs secret sharing
      const shards: Uint8Array[] = split(outerPrivateKey, {
        // TODO: Use totalArchaeologists value instead of selectedArchaeologists.length
        shares: selectedArchaeologists.length,
        // TODO: Use requiredArchaeologists value
        threshold: 3,
      });
      //save shards
      dispatch(setShards(shards));

      // Step 4: Encrypt each shard of the outer layer private key using each archaeologist's public
      // key
      const archPublicKeys = selectedArchaeologists.map(x => x.publicKey || '');
      const encryptedShards = await encryptShards(archPublicKeys, shards);

      // This may need to be updated to return a mapping of archaeologist public keys to
      // encrypted shards hexes, to allow archs to know which shard is theirs. Otherwise they would
      // manually attempt to decrypt each shard to know which is theirs.
      // https://github.com/sarcophagus-org/sarcophagus-v2-app/pull/68/files/f8d49a136b5322ac2eb81bf4e7fe552c91d9ac7e#r976854151
      // TODO: Change this to mapping of arch public keys to encrypted shards
      const encryptedShardsHex = encryptedShards.map(x => ethers.utils.hexlify(x));

      // Step 5: Upload the double encrypted payload to the arweave bundlr
      const newPayloadTxId = await uploadFile(encryptedOuterLayer);
      dispatch(setPayloadTxId(newPayloadTxId));

      // Step 6: Upload the encrypted shards to the arweave bundlr
      const newShardsTxId = await uploadFile(Buffer.from(JSON.stringify(encryptedShardsHex)));
      dispatch(setShardsTxId(newShardsTxId));
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
  ]);

  const handleCreate = useCallback(async () => {
    // Step 8: Create the sarcophagus

    createSarcophagus();
  }, [createSarcophagus]);

  // Temporarily select some archaeologists to test sarcophagus creation
  // TODO: Remove this when we select real archaeologists
  useEffect(() => {
    (async () => {
      const count = 10;
      const archPrivateKeys = privateKeys.slice(0, count);
      const wallets = archPrivateKeys.map(pk => new ethers.Wallet(pk));
      const archaeologists: Archaeologist[] = await Promise.all(
        wallets.map(async w => {
          const signedMessage = await w.signMessage('test message');
          const signature = ethers.utils.splitSignature(signedMessage);

          return {
            publicKey: w.publicKey,
            profile: {
              archAddress: w.address,
              exists: true,
              minimumDiggingFee: BigNumber.from('10'),
              maximumRewrapInterval: 0,
              peerId: '',
              successes: [],
              cleanups: [],
              accusals: [],
              signature: {
                v: signature.v,
                r: signature.r,
                s: signature.s,
              },
            },
            isOnline: true,
          };
        })
      );

      dispatch(setSelectedArchaeologists(archaeologists));
    })();
  }, [dispatch]);

  return { handleSubmit, handleCreate, isUploading, canCreateSarcophagus, payloadTxId, shardsTxId };
}
