import { WebBundlr } from '@bundlr-network/client';
import { useToast } from '@chakra-ui/react';
import { BigNumber, ethers } from 'ethers';
import { useCallback, useState } from 'react';
import { useNetwork } from 'wagmi';
import { AllNetworkConfigs } from '../../../lib/config/networkConfig';
import {
  connectFailure,
  connectStart,
  connectSuccess,
  disconnect as disconnectToast,
  fundFailure,
  fundStart,
  fundSuccess,
  uploadFailure,
  uploadStart,
  uploadSuccess,
  withdrawFailure,
  withdrawStart,
  withdrawSuccess,
} from '../../../lib/utils/toast';
import { useDispatch, useSelector } from '../../../store';
import {
  connect,
  disconnect as disconnectBundlr,
  setBundlr,
  setTxId,
} from '../../../store/bundlr/actions';

export function useBundlr() {
  const nodeUrl = process.env.REACT_APP_BUNDLR_NODE || 'https://node1.bundlr.network';

  const dispatch = useDispatch();
  const toast = useToast();
  const { chain } = useNetwork();

  // Pull some bundlr data from store
  const bundlr = useSelector(x => x.bundlrState.bundlr);
  const txId = useSelector(x => x.bundlrState.txId);
  const isConnected = useSelector(x => x.bundlrState.isConnected);

  // Used to tell the component when to render loading circle
  const [isFunding, setIsFunding] = useState(false);
  const [isWithdrawing, setIsWithdrawing] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [file, setFile] = useState<File | null>(null);

  // Get the name of the currency that bundlr will understand
  const currency = AllNetworkConfigs[chain?.id || 1].bundlrCurrencyName || 'ethereum';

  /**
   * Connects to the arweave bundlr node
   * This will prompt the user to sign a message
   * Defaults to https://node1.bundlr.network
   */
  const connectToBundlr = useCallback(async (): Promise<void> => {
    // TODO: Find a way to use the provider from wagmi
    const connector: any = window.ethereum;
    const provider = new ethers.providers.Web3Provider(connector);

    const newBundlr = new WebBundlr(nodeUrl, currency, provider);
    toast(connectStart());
    try {
      // Prompts user to sign a message
      await newBundlr.ready();
      dispatch(connect());
      dispatch(setBundlr(newBundlr));
      toast(connectSuccess());
    } catch (_error) {
      const error = _error as Error;
      toast(connectFailure(error.message));
    }
  }, [dispatch, nodeUrl, toast, currency]);

  /**
   * Disconnects from the arweave bundlr node
   */
  function disconnectFromBundlr(): void {
    dispatch(disconnectBundlr());
    toast(disconnectToast());
  }

  /**
   * Funds the bundlr node
   * @param amount The amount to fund the bundlr node
   */
  const fund = useCallback(
    async (amount: BigNumber) => {
      setIsFunding(true);
      toast(fundStart());
      try {
        await bundlr?.fund(Number(amount));

        toast(fundSuccess());
      } catch (_error) {
        const error = _error as Error;
        toast(fundFailure(error.message));
      } finally {
        setIsFunding(false);
      }
    },
    [bundlr, toast]
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
        toast(withdrawFailure(error.message));
      } finally {
        setIsWithdrawing(false);
      }
    },
    [bundlr, toast]
  );

  /**
   * Uploads a file given the data buffer
   * @param fileBuffer The data buffer
   */
  const uploadFile = useCallback(
    async (fileBuffer: Buffer) => {
      if (!bundlr) return;

      setIsUploading(true);
      toast(uploadStart());
      try {
        const res = await bundlr?.uploader.upload(fileBuffer);
        dispatch(setTxId(res.data.id));
        toast(uploadSuccess());
      } catch (_error) {
        const error = _error as Error;
        toast(uploadFailure(error.message));
      } finally {
        setIsUploading(false);
      }
    },
    [bundlr, dispatch, toast]
  );

  function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    if (event.target.files && event.target.files.length > 0) {
      setFile(event.target.files[0]);
    }
  }

  return {
    bundlr,
    txId,
    isConnected,
    isFunding,
    isWithdrawing,
    isUploading,
    connectToBundlr,
    disconnectFromBundlr,
    fund,
    withdraw,
    uploadFile,
    file,
    handleFileChange,
  };
}
