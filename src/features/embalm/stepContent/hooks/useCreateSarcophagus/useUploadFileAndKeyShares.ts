import { useCallback, useContext } from 'react';
import { encrypt, readFileDataAsBase64 } from '../../../../../lib/utils/helpers';
import useArweaveService from '../../../../../hooks/useArweaveService';
import { useSelector } from '../../../../../store';
import { CreateSarcophagusContext } from '../../context/CreateSarcophagusContext';
import {
  encryptShardsWithArchaeologistPublicKeys,
  encryptShardsWithRecipientPublicKey,
} from '../../utils/createSarcophagus';
import { split } from 'shamirs-secret-sharing-ts';
import { metadataDelimiter, sharesDelimiter } from 'hooks/useArweave';

export function useUploadFileAndKeyShares() {
  const { uploadToArweave } = useArweaveService();
  const { file, recipientState } = useSelector(x => x.embalmState);
  const { selectedArchaeologists, requiredArchaeologists } = useSelector(x => x.embalmState);
  const {
    payloadPrivateKey,
    payloadPublicKey,
    archaeologistPublicKeys,
    setSarcophagusPayloadTxId,
  } = useContext(CreateSarcophagusContext);

  const uploadAndSetArweavePayload = useCallback(async () => {
    try {
      const payload: { type: string; data: Buffer } = await readFileDataAsBase64(file!);
      // const payload = {
      //   fileName: file?.name,
      //   data,
      // };

      /**
       * File upload data
       */
      // Step 1: Encrypt the payload with the generated keypair
      const encryptedPayload = await encrypt(payloadPublicKey!, payload.data);

      /**
       * Double encrypted keyshares upload data
       */
      // Step 1: Split the outer layer private key using shamirs secret sharing
      const keyShares: Uint8Array[] = split(payloadPrivateKey, {
        shares: selectedArchaeologists.length,
        threshold: requiredArchaeologists,
      });

      // Step 2: Encrypt each shard with the recipient public key
      const keySharesEncryptedInner = await encryptShardsWithRecipientPublicKey(
        recipientState.publicKey,
        keyShares
      );

      // Step 3: Encrypt each shard again with the arch public keys
      const keySharesEncryptedOuter = await encryptShardsWithArchaeologistPublicKeys(
        Array.from(archaeologistPublicKeys.values()),
        keySharesEncryptedInner
      );

      /**
       * Format data for upload
       */
      const doubleEncryptedKeyShares: Record<string, string> = keySharesEncryptedOuter.reduce(
        (acc, keyShare) => ({
          ...acc,
          [keyShare.publicKey]: keyShare.encryptedShard,
        }),
        {}
      );

      // Upload file data + keyshares data to arweave
      const encKeysBuffer = Buffer.from(JSON.stringify(doubleEncryptedKeyShares), 'binary');
      const metadata = { fileName: file!.name, type: payload.type };
      const metadataBuffer = Buffer.from(JSON.stringify(metadata), 'binary');

      const arweavePayload = Buffer.concat([
        metadataBuffer,
        metadataDelimiter,
        encKeysBuffer,
        sharesDelimiter,
        encryptedPayload,
      ]);

      const payloadTxId = await uploadToArweave(arweavePayload, metadata);

      setSarcophagusPayloadTxId(payloadTxId);
    } catch (error: any) {
      throw new Error(error.message || 'Error uploading file payload to Bundlr');
    }
  }, [
    file,
    requiredArchaeologists,
    selectedArchaeologists,
    archaeologistPublicKeys,
    payloadPublicKey,
    payloadPrivateKey,
    recipientState.publicKey,
    uploadToArweave,
    setSarcophagusPayloadTxId,
  ]);

  return {
    uploadAndSetArweavePayload: uploadAndSetArweavePayload,
  };
}
