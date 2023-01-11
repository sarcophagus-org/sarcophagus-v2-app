import { ChunkingUploader } from '@bundlr-network/client/build/common/chunkingUploader';
import { useToast } from '@chakra-ui/react';
import { BigNumber } from 'ethers';
import { formatEther } from 'ethers/lib/utils';
import { ArweaveFileMetadata } from 'hooks/useArweaveService';
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

  const [chunkedUploader, setChunkedUploader] = useState<ChunkingUploader>();
  const [fileBuffer, setFileBuffer] = useState<Buffer>();
  const [cancelUploadToken, setCancelUploadToken] = useState<CancelCreateToken>();
  const [metadata, setMetadata] = useState<ArweaveFileMetadata>();
  const [readyToUpload, setReadyToUpload] = useState(false);

  const { setSarcophagusPayloadTxId } = useContext(CreateSarcophagusContext);

  /**
   * Funds the bundlr node
   * @param amount The amount to fund the bundlr node
   */
  const fund = useCallback(
    async (amount: BigNumber) => {
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

  // SET UP UPLOAD EVENT LISTENERS
  useEffect(() => {
    if (!chunkedUploader || !fileBuffer || !rejectUploadPromise) return;

    chunkedUploader.setChunkSize(5_000_000);

    chunkedUploader?.on('chunkUpload', chunkInfo => {
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
      console.log(`Upload completed with ID ${finishRes.id}`);
      dispatch(setIsUploading(false));
    });
  }, [cancelUploadToken, chunkedUploader, dispatch, fileBuffer, rejectUploadPromise]);

  //  SET UP CHUNKED UPLOADER WHEN BUNDLR CONNECTS
  useEffect(() => {
    if (!bundlr) {
      setChunkedUploader(undefined);
      return;
    }

    setChunkedUploader(bundlr.uploader.chunkedUploader);
  }, [bundlr]);

  // STOP UPLOAD ON CANCEL
  useEffect(() => {
    if (cancelUploadToken?.cancelled) {
      chunkedUploader?.pause();
      rejectUploadPromise.current('Cancelled upload');
    }
  }, [cancelUploadToken, cancelUploadToken?.cancelled, chunkedUploader]);

  /**
   *
   * Set up all needed, yet decoupled, components for uploading
   * and raise readyToUpload flag.
   * */
  const prepareToUpload = useCallback(
    (
      payloadBuffer: Buffer,
      fileMetadata: ArweaveFileMetadata,
      cancelToken: CancelCreateToken,
      resolve?: any,
      reject?: any
    ) => {
      setFileBuffer(payloadBuffer);
      setMetadata(fileMetadata);
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
      if (!readyToUpload || !fileBuffer) {
        return;
      }

      const opts = {
        tags: [{ name: 'metadata', value: JSON.stringify(metadata) }],
      };

      const uploadPromise = chunkedUploader
        ?.uploadData(fileBuffer, opts)
        .then(res => {
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
    metadata,
    setSarcophagusPayloadTxId,
    toast,
    chunkedUploader,
    rejectUploadPromise,
    resolveUploadPromise,
  ]);

  /**
   * Consumable entry point to initiate upload to arweave.
   * Uploads a file given the data buffer
   * @param payloadBuffer The data buffer
   * @param fileMetadata Metadata with descriptive info about the file. Preferably with encrypted fields.
   * @param cancelToken CancelCreateToken from global `embalmState`
   */
  const uploadFile = useCallback(
    async (
      payloadBuffer: Buffer,
      fileMetadata: ArweaveFileMetadata,
      cancelToken: CancelCreateToken
    ): Promise<string> => {
      return new Promise<string>(async (resolve, reject) => {
        if (!bundlr || !chunkedUploader) {
          reject('Bundlr not connected');
        }

        prepareToUpload(payloadBuffer, fileMetadata, cancelToken, resolve, reject);
      });
    },
    [bundlr, chunkedUploader, prepareToUpload]
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
