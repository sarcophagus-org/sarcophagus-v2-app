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

export function useUploadFileAndKeyShares() {
  const { uploadToArweave } = useArweaveService();
  const { file, recipientState } = useSelector(x => x.embalmState);
  const { selectedArchaeologists, requiredArchaeologists } = useSelector(x => x.embalmState);
  const { outerPrivateKey, outerPublicKey, archaeologistPublicKeys, setSarcophagusPayloadTxId } =
    useContext(CreateSarcophagusContext);

  const uploadAndSetArweavePayload = useCallback(async () => {
    try {
      const data = await readFileDataAsBase64(file!);
      const payload = {
        fileName: file?.name,
        data,
      };

      /**
       * File upload data
       */
      // Step 1: Encrypt the payload with the generated keypair

      const encryptedOuterLayer = await encrypt(
        outerPublicKey!,
        Buffer.from(JSON.stringify(payload))
      );

      /**
       * Double encrypted keyshares upload data
       */
      // Step 1: Split the outer layer private key using shamirs secret sharing
      const keyShares: Uint8Array[] = split(outerPrivateKey, {
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

      const combinedPayload = {
        file: encryptedOuterLayer,
        keyShares: Buffer.from(JSON.stringify(doubleEncryptedKeyShares)),
      };

      // Upload file data + keyshares data to arweave
      const payloadTxId = await uploadToArweave(Buffer.from(JSON.stringify(combinedPayload)));

      setSarcophagusPayloadTxId(payloadTxId);
    } catch (error: any) {
      throw new Error(error.message || 'Error uploading file payload to Bundlr');
    }
  }, [
    file,
    requiredArchaeologists,
    selectedArchaeologists,
    archaeologistPublicKeys,
    outerPublicKey,
    outerPrivateKey,
    recipientState.publicKey,
    uploadToArweave,
    setSarcophagusPayloadTxId,
  ]);

  return {
    uploadAndSetArweavePayload: uploadAndSetArweavePayload,
  };
}
