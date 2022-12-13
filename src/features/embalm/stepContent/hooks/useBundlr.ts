import { useToast } from '@chakra-ui/react';
import { BigNumber } from 'ethers';
import { formatEther } from 'ethers/lib/utils';
import {
  fundStart,
  fundSuccess,
  uploadStart,
  uploadSuccess,
  withdrawStart,
  withdrawSuccess,
} from 'lib/utils/toast';
import { useCallback, useState } from 'react';
import { fund as fundAction, setIsFunding, withdraw as withdrawAction } from 'store/bundlr/actions';
import { useDispatch, useSelector } from 'store/index';

export function useBundlr() {
  const dispatch = useDispatch();
  const toast = useToast();

  // Pull some bundlr data from store
  const { bundlr, txId, isConnected, isFunding } = useSelector(x => x.bundlrState);

  // Used to tell the component when to render loading circle
  const [isWithdrawing, setIsWithdrawing] = useState(false);

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

  /**
   * Uploads a file given the data buffer
   * @param fileBuffer The data buffer
   */
  const uploadFile = useCallback(
    async (fileBuffer: Buffer): Promise<string> => {
      if (!bundlr) {
        throw new Error('Bundlr not connected');
      }

      toast(uploadStart());
      try {
        const res = await bundlr?.upload(fileBuffer);
        toast(uploadSuccess());
        return res.data.id;
      } catch (_error) {
        throw _error;
      }
    },
    [bundlr, toast]
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
