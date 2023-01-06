import { ChunkingUploader } from '@bundlr-network/client/build/common/chunkingUploader';
import { useToast } from '@chakra-ui/react';
import { BigNumber } from 'ethers';
import { formatEther } from 'ethers/lib/utils';
import { ArweaveFileMetadata } from 'hooks/useArweaveService';
import {
  fundStart,
  fundSuccess,
  withdrawStart,
  withdrawSuccess,
} from 'lib/utils/toast';
import { useCallback, useContext, useEffect, useState } from 'react';
import {
  fund as fundAction,
  setIsFunding,
  setIsUploading,
  setUploadProgress,
  withdraw as withdrawAction,
} from 'store/bundlr/actions';
import { useDispatch, useSelector } from 'store/index';
import { CreateSarcophagusContext } from '../context/CreateSarcophagusContext';

export function useBundlr() {
  const dispatch = useDispatch();
  const toast = useToast();

  // Pull some bundlr data from store
  const { bundlr, isFunding } = useSelector(x => x.bundlrState);

  // Used to tell the component when to render loading circle
  const [isWithdrawing, setIsWithdrawing] = useState(false);

  const [chunkedUploader, setChunkedUploader] = useState<ChunkingUploader>();
  const [fileBuffer, setFileBuffer] = useState<Buffer>();
  const [metadata, setMetadata] = useState<ArweaveFileMetadata>();
  const [readyToUpload, setReadyToUpload] = useState(false);

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

  useEffect(() => {
    if (!chunkedUploader || !fileBuffer) return;

    chunkedUploader.setChunkSize(1_000_000);

    chunkedUploader?.on('chunkUpload', chunkInfo => {
      const chunkedUploadProgress = chunkInfo.totalUploaded / fileBuffer.length;
      console.log(chunkedUploadProgress);

      dispatch(setUploadProgress(chunkedUploadProgress));
    });

    chunkedUploader?.on('chunkError', e => {
      console.error(`Error uploading chunk number ${e.id} - ${e.res.statusText}`);
      dispatch(setIsUploading(false));
    });

    chunkedUploader?.on('done', finishRes => {
      console.log(`Upload completed with ID ${finishRes.id}`);
      // setUploadProgress(0);
      dispatch(setIsUploading(false));
    });
  }, [chunkedUploader, dispatch, fileBuffer]);

  useEffect(() => {
    if (!bundlr) {
      setChunkedUploader(undefined);
      return;
    }

    setChunkedUploader(bundlr.uploader.chunkedUploader);
  }, [bundlr]);

  const prepareToUpload = useCallback(
    async (payloadBuffer: Buffer, fileMetadata: ArweaveFileMetadata): Promise<any> => {
      setFileBuffer(payloadBuffer);
      setMetadata(fileMetadata);
      setReadyToUpload(true);
    },
    []
  );

  const { setSarcophagusPayloadTxId } = useContext(CreateSarcophagusContext);

  useEffect(() => {
    (async () => {
      if (!readyToUpload || !fileBuffer) {
        return;
      }

      try {
        let res: any;

        const opts = {
          tags: [{ name: 'metadata', value: JSON.stringify(metadata) }],
        };

        res = await chunkedUploader?.uploadData(fileBuffer, opts);

        setSarcophagusPayloadTxId(res.data.id);
      } catch (_error) {
        throw _error;
      }
    })();
  }, [readyToUpload, fileBuffer, metadata, setSarcophagusPayloadTxId, toast, chunkedUploader]);

  /**
   * Uploads a file given the data buffer
   * @param fileBuffer The data buffer
   */
  const uploadFile = useCallback(
    async (payloadBuffer: Buffer, fileMetadata: ArweaveFileMetadata): Promise<void> => {
      if (!bundlr || !chunkedUploader) {
        throw new Error('Bundlr not connected');
      }

      prepareToUpload(payloadBuffer, fileMetadata);
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
