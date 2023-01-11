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
import { sharesDelimiter } from 'hooks/useArweave';
import { useNetworkConfig } from 'lib/config';
import { mainnet } from 'wagmi';
import { hardhat } from '@wagmi/chains';
import { setIsUploading } from 'store/bundlr/actions';
import { CancelCreateToken } from './useCreateSarcophagus';

/** The number of digits the metadata size will ALWAYS have */
export const METADATA_SIZE_CHAR_COUNT = 3;

/**
 * Returns a Buffer of the size of the arweave file's metadata.
 *
 * Assumption is that the size cannot exceed 999 (bytes), and likely cannot be less than
 * 100. On the off chance the size happens to have less digits than the constant
 * `METADATA_SIZE_CHAR_COUNT`, the buffer will be prefixed with zeroes to maintain
 * a known digit count.
 */
function getMetadataSizeBuffer(metadataBuffer: Buffer) {
  let metadataSizeBuffer = Buffer.from(`${metadataBuffer.length.toString()}`);

  if (metadataSizeBuffer.length < METADATA_SIZE_CHAR_COUNT) {
    const padLength = METADATA_SIZE_CHAR_COUNT - metadataSizeBuffer.length;
    for (let i = 0; i < padLength; i++) {
      metadataSizeBuffer = Buffer.concat([Buffer.from('0'), metadataSizeBuffer]);
    }
  }

  return metadataSizeBuffer;
}

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

  const uploadAndSetArweavePayload = useCallback(async (isRetry: boolean, cancelToken: CancelCreateToken) => {
    try {
      if (!file) {
        return;
      }

      dispatch(setIsUploading(true));

      setUploadStep('Reading file...');
      const payload: { type: string; data: Buffer } = await readFileDataAsBase64(file);

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

      // NOTE: metadata is intentionally stripped away on mainnet and hardhat - this data can be retrieved from the tx tags
      // In the future, if Bundlr ever is able to forward data to arweave quickly enough on testnets,
      // we may want to update this code to not concat metadata at all.
      const dontUseMetadataBuffer =
        networkConfig.chainId === mainnet.id || networkConfig.chainId === hardhat.id;

      const encryptedMetadata = await encryptMetadataFields(recipientState.publicKey, {
        fileName: file!.name,
        type: payload.type,
      });

      const metadataBuffer = Buffer.from(
        dontUseMetadataBuffer ? '' : JSON.stringify(encryptedMetadata),
        'binary'
      );

      // Have this buffer be of zero-size if on network where we're NOT using the metadata buffer prefix
      const metadataSizeBuffer = dontUseMetadataBuffer
        ? Buffer.from('')
        : getMetadataSizeBuffer(metadataBuffer);

      const arweavePayload = Buffer.concat([
        metadataSizeBuffer,
        metadataBuffer,
        encKeysBuffer,
        sharesDelimiter,
        encryptedPayload,
      ]);

      await uploadToArweave(arweavePayload, encryptedMetadata, cancelToken);
    } catch (error: any) {
      console.log(error);
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
