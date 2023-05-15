import { useToast } from '@chakra-ui/react';
import { BigNumber } from 'ethers';
import { formatEther } from 'ethers/lib/utils';
import { chunkedUploaderFileSize } from 'lib/constants';
import { fundStart, fundSuccess, withdrawStart, withdrawSuccess } from 'lib/utils/toast';
import { useCallback, useContext, useEffect, useRef, useState } from 'react';
import {
  fund as fundAction,
  setIsFunding,
  setIsUploading,
  setUploadProgress,
  withdraw as withdrawAction,
} from 'store/bundlr/actions';
import { useDispatch, useSelector } from 'store/index';
import { CreateSarcophagusContext } from '../context/CreateSarcophagusContext';
import { CancelCreateToken } from './useCreateSarcophagus/useCreateSarcophagus';

export function useBundlr() {
  const dispatch = useDispatch();
  const toast = useToast();

  // Pull some bundlr data from store
  const { bundlr, isFunding } = useSelector(x => x.bundlrState);

  // Used to tell the component when to render loading circle
  const [isWithdrawing, setIsWithdrawing] = useState(false);

  const [fileBuffer, setFileBuffer] = useState<Buffer>();
  const [cancelUploadToken, setCancelUploadToken] = useState<CancelCreateToken>();
  const [readyToUpload, setReadyToUpload] = useState(false);

  const { setSarcophagusPayloadTxId } = useContext(CreateSarcophagusContext);

  /**
   * Funds the bundlr node
   * @param amount The amount to fund the bundlr node
   */
  const fund = useCallback(
    async (amount: BigNumber) => {
      if (!bundlr) {
        console.log('Bundlr not connected');
        return;
      }

      dispatch(setIsFunding(true));
      toast(fundStart());
      try {
        await bundlr?.fund(amount.toString());

        toast(fundSuccess());
      } catch (_error) {
        const error = _error as Error;
        console.error(error);
      } finally {
        // Many times the fund call throws an error even though the fund is actually happening, so
        // we want to proceed as if the fund is working even if an error is thrown.  If the fund
        // actually fails, then this dispatch action may incorrectly show the user that the fund is
        // pending, which is a more tolerable isssue to have. A page refresh should fix this.
        dispatch(fundAction(amount));

        dispatch(setIsFunding(false));
      }
    },
    [bundlr, dispatch, toast]
  );

  /**
   * Withdraws an amount from the bundlr node
   * Use the useGetBalance hook to get the full amount
   * @param amount The amount to withdraw
   */
  const withdraw = useCallback(
    async (amount: BigNumber) => {
      setIsWithdrawing(true);
      toast(withdrawStart());
      try {
        await bundlr?.withdrawBalance(Number(amount));
        toast(withdrawSuccess());
      } catch (_error) {
        const error = _error as Error;
        console.error(error);
      } finally {
        // Many times the withdraw call throws an error even though the withdraw is actually
        // happening, so we want to proceed as if the withdraw is working even if an error is
        // thrown.  If the withdraw actually fails, then this dispatch action may incorrectly show
        // the user that the withdraw is pending, which is a more tolerable isssue to have. A page
        // refresh should fix this.
        dispatch(withdrawAction(formatEther(amount)));

        setIsWithdrawing(false);
      }
    },
    [bundlr, dispatch, toast]
  );

  let rejectUploadPromise = useRef<any>();
  let resolveUploadPromise = useRef<any>();

  /**
   * Set up all needed, yet decoupled, components for uploading
   * and raise readyToUpload flag.
   * */
  const prepareToUpload = useCallback(
    (payloadBuffer: Buffer, cancelToken: CancelCreateToken, resolve?: any, reject?: any) => {
      console.log('Preparing to upload...', payloadBuffer.length, 'bytes');
      
      setFileBuffer(payloadBuffer);
      setCancelUploadToken(cancelToken);
      resolveUploadPromise.current = resolve;
      rejectUploadPromise.current = reject;

      setReadyToUpload(true);
    },
    []
  );

  //
  // ACTUALLY BEGIN THE UPLOAD.
  //
  // Starts as soons `readyToUpload` is true.
  useEffect(() => {
    (async () => {
      if (!bundlr || !readyToUpload || !fileBuffer) {
        return;
      }

      // SET UP UPLOAD EVENT LISTENERS
      const chunkedUploader = bundlr.uploader.chunkedUploader;

      chunkedUploader.setChunkSize(chunkedUploaderFileSize);

      chunkedUploader?.on('chunkUpload', chunkInfo => {
        // STOP UPLOAD ON CANCEL
        if (cancelUploadToken?.cancelled) {
          chunkedUploader?.pause();
          rejectUploadPromise.current('Cancelled upload');
          return;
        }

        const chunkedUploadProgress = chunkInfo.totalUploaded / fileBuffer.length;
        dispatch(setUploadProgress(chunkedUploadProgress));
      });

      chunkedUploader?.on('chunkError', e => {
        const errorMsg = `Error uploading chunk number ${e.id} - ${e.res.statusText}`;
        console.error(errorMsg);
        rejectUploadPromise.current(errorMsg);
        dispatch(setIsUploading(false));
      });

      chunkedUploader?.on('done', finishRes => {
        console.log(
          `Upload completed with ID ${JSON.stringify(finishRes.data?.id ?? finishRes.id)}`
        );
        dispatch(setIsUploading(false));
      });

      console.log('Uploading...');
      
      const uploadPromise = chunkedUploader
        ?.uploadData(fileBuffer)
        .then(res => {
          if (!res) {
            rejectUploadPromise.current('Could not upload');
            return;
          }

          setSarcophagusPayloadTxId(res.data.id);
          resolveUploadPromise.current(res.data.id);
        })
        .catch(err => {
          console.log('err', err);
          rejectUploadPromise.current(err);
        });

      await uploadPromise;
    })();
  }, [
    readyToUpload,
    fileBuffer,
    setSarcophagusPayloadTxId,
    toast,
    rejectUploadPromise,
    resolveUploadPromise,
    bundlr,
    cancelUploadToken?.cancelled,
    dispatch,
  ]);

  /**
   * Consumable entry point to initiate upload to arweave.
   * Uploads a file given the data buffer
   * @param payloadBuffer The data buffer
   * @param fileMetadata Metadata with descriptive info about the file. Preferably with encrypted fields.
   * @param cancelToken CancelCreateToken from global `embalmState`
   */
  const uploadFile = useCallback(
    async (payloadBuffer: Buffer, cancelToken: CancelCreateToken): Promise<string> => {
      return new Promise<string>(async (resolve, reject) => {
        if (!bundlr) {
          reject({ message: 'Bundlr not connected' });
        }

        prepareToUpload(payloadBuffer, cancelToken, resolve, reject);
      });
    },
    [bundlr, prepareToUpload]
  );

  return {
    bundlr,
    isFunding,
    isWithdrawing,
    fund,
    withdraw,
    uploadFile,
  };
}
