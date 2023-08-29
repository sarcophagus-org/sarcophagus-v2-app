import { useCallback, useContext, useEffect, useState } from 'react';
import { useDispatch, useSelector } from '../../../../../store';
import { CreateSarcophagusContext } from '../../context/CreateSarcophagusContext';
import { setIsUploading, setUploadProgress } from 'store/bundlr/actions';
import { CancelCreateToken } from './useCreateSarcophagus';
import { sarco } from '@sarcophagus-org/sarcophagus-v2-sdk-client';
import { useNetworkConfig } from 'lib/config';
import { useNetwork } from 'wagmi';

export function useUploadFileAndKeyShares() {
  const { setSarcophagusPayloadTxId } = useContext(CreateSarcophagusContext);
  const { file, recipientState, selectedArchaeologists, requiredArchaeologists, sponsorBundlr } =
    useSelector(x => x.embalmState);

  const networkConfig = useNetworkConfig();
  const { chain } = useNetwork();

  const { payloadPrivateKey, payloadPublicKey, archaeologistPublicKeys } =
    useContext(CreateSarcophagusContext);

  const [uploadStep, setUploadStep] = useState('');
  const { uploadProgress, isUploading } = useSelector(s => s.bundlrState);

  const dispatch = useDispatch();

  useEffect(() => {
    setUploadStep(`Uploading to Arweave... ${(uploadProgress * 100).toFixed(0)}%`);
  }, [uploadProgress]);

  const uploadAndSetArweavePayload = useCallback(
    async (isRetry: boolean, cancelToken: CancelCreateToken) => {
      try {
        dispatch(setIsUploading(true));

        if (sponsorBundlr && chain) {
          const response = await fetch(`${networkConfig.apiUrlBase}/bundlr/publicKey`);
          const { publicKey } = await response.json();
          await sarco.setSponsoredBundlr(publicKey, `${networkConfig.apiUrlBase}/bundlr/signData`);
        }

        const uploadPromise = sarco.api.uploadFileToArweave({
          file: file!,
          archaeologistPublicKeys: Array.from(archaeologistPublicKeys.values()),
          onStep: (step: string) => setUploadStep(step),
          recipientPublicKey: recipientState.publicKey,
          shares: selectedArchaeologists.length,
          threshold: requiredArchaeologists,
          onUploadChunk: (chunkedUploader: any, chunkedUploadProgress: number) => {
            // STOP UPLOAD ON CANCEL
            if (cancelToken?.cancelled) {
              chunkedUploader.pause();
              dispatch(setIsUploading(false));
              return;
            }
            dispatch(setUploadProgress(chunkedUploadProgress));
          },
          onUploadChunkError: (msg: string) => {
            console.error(msg);
            dispatch(setIsUploading(false));
            throw new Error(msg);
          },
          onUploadComplete: (uploadId: string) => {
            setSarcophagusPayloadTxId(uploadId);
            dispatch(setIsUploading(false));
          },
          payloadPrivateKey: payloadPrivateKey,
          payloadPublicKey: payloadPublicKey,
        });

        await uploadPromise;
      } catch (error: any) {
        console.log(error);
        throw new Error(error.message || 'Error uploading file payload to Bundlr');
      }
    },
    [
      dispatch,
      sponsorBundlr,
      chain,
      file,
      archaeologistPublicKeys,
      recipientState.publicKey,
      selectedArchaeologists.length,
      requiredArchaeologists,
      payloadPrivateKey,
      payloadPublicKey,
      networkConfig.apiUrlBase,
      setSarcophagusPayloadTxId,
    ]
  );

  return {
    uploadAndSetArweavePayload,
    uploadStep,
    isUploading,
  };
}
