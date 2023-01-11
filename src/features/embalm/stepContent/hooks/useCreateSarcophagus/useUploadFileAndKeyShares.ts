import { useCallback, useContext, useEffect, useState } from 'react';
import { encrypt, readFileDataAsBase64 } from '../../../../../lib/utils/helpers';
import useArweaveService from '../../../../../hooks/useArweaveService';
import { useDispatch, useSelector } from '../../../../../store';
import { CreateSarcophagusContext } from '../../context/CreateSarcophagusContext';
import {
  encryptMetadataFields,
  encryptShardsWithArchaeologistPublicKeys,
  encryptShardsWithRecipientPublicKey,
} from '../../utils/createSarcophagus';
import { split } from 'shamirs-secret-sharing-ts';
import { arweaveDataDelimiter } from 'hooks/useArweave';
import { useNetworkConfig } from 'lib/config';
import { setIsUploading } from 'store/bundlr/actions';

export function useUploadFileAndKeyShares() {
  const { uploadToArweave } = useArweaveService();
  const { file, recipientState } = useSelector(x => x.embalmState);
  const { selectedArchaeologists, requiredArchaeologists } = useSelector(x => x.embalmState);
  const { payloadPrivateKey, payloadPublicKey, archaeologistPublicKeys } =
    useContext(CreateSarcophagusContext);

  const networkConfig = useNetworkConfig();

  const [uploadStep, setUploadStep] = useState('');
  const { uploadProgress, isUploading } = useSelector(s => s.bundlrState);

  const dispatch = useDispatch();

  useEffect(() => {
    setUploadStep(`Uploading to Arweave... ${(uploadProgress * 100).toFixed(0)}%`);
  }, [uploadProgress]);

  const uploadAndSetArweavePayload = useCallback(async () => {
    try {
      dispatch(setIsUploading(true));

      setUploadStep('Reading file...');
      const payload: { type: string; data: Buffer } = await readFileDataAsBase64(file!);

      /**
       * File upload data
       */
      // Step 1: Encrypt the payload with the generated keypair
      setUploadStep('Encrypting...');
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

      const encryptedMetadata = await encryptMetadataFields(recipientState.publicKey, {
        fileName: file!.name,
        type: payload.type,
      });

      const metadataBuffer = Buffer.from(JSON.stringify(encryptedMetadata), 'binary');

      // <meta_buf_size><delimiter><keyshare_buf_size><delimiter><metatadata><keyshares><payload>

      const arweavePayload = Buffer.concat([
        Buffer.from(metadataBuffer.length.toString(), 'binary'),
        arweaveDataDelimiter,
        Buffer.from(encKeysBuffer.length.toString()),
        arweaveDataDelimiter,
        metadataBuffer,
        encKeysBuffer,
        encryptedPayload,
      ]);

      await uploadToArweave(arweavePayload, encryptedMetadata);
    } catch (error: any) {
      throw new Error(error.message || 'Error uploading file payload to Bundlr');
    }
  }, [
    dispatch,
    file,
    payloadPublicKey,
    payloadPrivateKey,
    selectedArchaeologists.length,
    requiredArchaeologists,
    recipientState.publicKey,
    archaeologistPublicKeys,
    networkConfig.chainId,
    uploadToArweave,
  ]);

  return {
    uploadAndSetArweavePayload,
    uploadStep,
    isUploading,
  };
}
