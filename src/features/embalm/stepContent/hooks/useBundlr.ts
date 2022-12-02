import { useSarcoToast } from 'components/SarcoToast';
import { BigNumber, ethers } from 'ethers';
import { formatEther } from 'ethers/lib/utils';
import {
  fundStart,
  fundSuccess,
  fundFailure,
  uploadStart,
  uploadSuccess,
  withdrawStart,
  withdrawSuccess,
  withdrawFailure,
} from 'lib/utils/toast';
import { useCallback, useState } from 'react';
import { fund as fundAction, setIsFunding, withdraw as withdrawAction } from 'store/bundlr/actions';
import { useDispatch, useSelector } from 'store/index';

export function useBundlr() {
  const dispatch = useDispatch();
  const sarcoTast = useSarcoToast();

  // Pull some bundlr data from store
  const { bundlr, txId, isConnected, isFunding } = useSelector(x => x.bundlrState);

  // Used to tell the component when to render loading circle
  const [isWithdrawing, setIsWithdrawing] = useState(false);

  /**
   * Funds the bundlr node
   * @param amount The amount to fund the bundlr node
   */
  const fund = useCallback(
    async (amount: string) => {
      dispatch(setIsFunding(true));
      sarcoTast.open(fundStart());
      try {
        const parsedAmount = ethers.utils.parseUnits(amount);
        await bundlr?.fund(Number(parsedAmount));

        sarcoTast.open(fundSuccess());
      } catch (_error) {
        const error = _error as Error;
        console.error(error);
        sarcoTast.open(fundFailure(error.message));
      } finally {
        // Many times the fund call throws an error even though the fund is actually happening, so
        // we want to proceed as if the fund is working even if an error is thrown.  If the fund
        // actually fails, then this dispatch action may incorrectly show the user that the fund is
        // pending, which is a more tolerable isssue to have. A page refresh should fix this.
        dispatch(fundAction(amount));

        dispatch(setIsFunding(false));
      }
    },
    [bundlr, dispatch, sarcoTast]
  );

  /**
   * Withdraws an amount from the bundlr node
   * Use the useGetBalance hook to get the full amount
   * @param amount The amount to withdraw
   */
  const withdraw = useCallback(
    async (amount: BigNumber) => {
      setIsWithdrawing(true);
      sarcoTast.open(withdrawStart());
      try {
        await bundlr?.withdrawBalance(Number(amount));
        sarcoTast.open(withdrawSuccess());
      } catch (_error) {
        const error = _error as Error;
        sarcoTast.open(withdrawFailure(error.message));
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
    [bundlr, dispatch, sarcoTast]
  );

  /**
   * Uploads a file given the data buffer
   * @param fileBuffer The data buffer
   */
  const uploadFile = useCallback(
    async (fileBuffer: Buffer): Promise<string> => {
      if (!bundlr) {
        throw new Error('Bundlr not connected');
      }

      sarcoTast.open(uploadStart());
      try {
        const res = await bundlr?.upload(fileBuffer);
        sarcoTast.open(uploadSuccess());
        return res.data.id;
      } catch (_error) {
        throw _error;
      }
    },
    [bundlr, sarcoTast]
  );

  return {
    bundlr,
    txId,
    isConnected,
    isFunding,
    isWithdrawing,
    fund,
    withdraw,
    uploadFile,
  };
}
