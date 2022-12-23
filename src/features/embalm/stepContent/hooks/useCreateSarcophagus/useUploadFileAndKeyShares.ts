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
// import { ArweavePayload } from 'types';

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
    console.log('upload step');

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
      const payloadStr = JSON.stringify(payload);
      console.log('encrypt payload');
      const payloadBuffer = Buffer.from(payloadStr, 'base64');
      console.log('buffer', payloadBuffer);


      const encryptedPayload = await encrypt(
        payloadPublicKey!,
        payloadBuffer
      );
      console.log(' done encrypt payload');


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

      // const combinedPayload: ArweavePayload = {
      //   file: encryptedPayload,
      //   keyShares: doubleEncryptedKeyShares,
      // };

      // stringify-ing combininedPayload here (encryptedPayload, really) crashes app
      // const payloadTxId = await uploadToArweave(Buffer.from(JSON.stringify(combinedPayload)));

      // Upload file data + keyshares data to arweave
      const encKeysBuffer = Buffer.from(JSON.stringify(doubleEncryptedKeyShares));
      // console.log('encKeysBuffer', encKeysBuffer.length);
      console.log('encKeysBuffer', encKeysBuffer);
      console.log('encryptedPayload', encryptedPayload);

      const arweavePayload = Buffer.concat([encKeysBuffer, Buffer.from('\n'), encryptedPayload]);
      console.log('arweavePayload', arweavePayload);

      const payloadTxId = await uploadToArweave(arweavePayload);

      setSarcophagusPayloadTxId(payloadTxId);
      // throw Error('s');
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
