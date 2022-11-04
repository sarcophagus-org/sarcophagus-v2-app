import { useToast } from '@chakra-ui/react';
import { ethers } from 'ethers';
import {
  fundFailure,
  fundStart,
  fundSuccess,
  uploadStart,
  uploadSuccess,
  withdrawFailure,
  withdrawStart,
  withdrawSuccess,
} from 'lib/utils/toast';
import { useCallback, useState } from 'react';
import { setIsFunding, setPendingBalance } from 'store/bundlr/actions';
import { useDispatch, useSelector } from 'store/index';

export function useBundlr() {
  const dispatch = useDispatch();
  const toast = useToast();

  // Pull some bundlr data from store
  const { bundlr, txId, balance, isConnected, isFunding } = useSelector(x => x.bundlrState);

  // Used to tell the component when to render loading circle
  const [isWithdrawing, setIsWithdrawing] = useState(false);

  /**
   * Funds the bundlr node
   * @param amount The amount to fund the bundlr node
   */
  const fund = useCallback(
    async (amount: string) => {
      dispatch(setIsFunding(true));
      toast(fundStart());
      try {
        const parsedAmount = ethers.utils.parseUnits(amount);
        const response = await bundlr?.fund(Number(parsedAmount));

        dispatch(
          setPendingBalance({
            balanceBeforeTx: balance,
            txId: response!.id,
          })
        );

        toast(fundSuccess());
      } catch (_error) {
        const error = _error as Error;
        console.error(error);
        toast(fundFailure(error.message));
      } finally {
        dispatch(setIsFunding(false));
      }
    },
    [bundlr, dispatch, toast, balance]
  );

  /**
   * Withdraws an amount from the bundlr node
   * Use the useGetBalance hook to get the full amount
   * @param amount The amount to withdraw
   */
  const withdraw = useCallback(
    async (amount: string) => {
      setIsWithdrawing(true);
      toast(withdrawStart());
      try {
        const parsedAmount = ethers.utils.parseUnits(amount);
        const bundlrAddress = await bundlr?.utils.getBundlerAddress(bundlr?.currency);
        const networkFee = await bundlr?.currencyConfig.getFee(Number(parsedAmount), bundlrAddress);
        const withdrawAmount = parsedAmount.sub(Number(networkFee));

        const response = await bundlr?.withdrawBalance(Number(withdrawAmount));

        dispatch(
          setPendingBalance({
            balanceBeforeTx: balance,
            txId: response!.tx_id,
          })
        );

        toast(withdrawSuccess());
      } catch (_error) {
        const error = _error as Error;
        console.error(error);
        toast(withdrawFailure(error.message));
      } finally {
        setIsWithdrawing(false);
      }
    },
    [bundlr, dispatch, toast, balance]
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
        return res.id;
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
