import { bundlrBalanceDecimals } from 'lib/constants';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { setBalance, setPendingBalance } from 'store/bundlr/actions';
import { useDispatch, useSelector } from 'store/index';
import { useNetwork } from 'wagmi';
import { useBundlr } from './useBundlr';

export function useGetBalance() {
  const dispatch = useDispatch();
  const { bundlr } = useBundlr();
  const { balance, isConnected, pendingBalance } = useSelector(x => x.bundlrState);
  const { chain } = useNetwork();
  const [intervalId, setIntervalId] = useState<NodeJS.Timer | null>(null);

  const formattedBalance = useMemo(
    () =>
      isConnected && balance
        ? `${parseFloat(balance).toFixed(bundlrBalanceDecimals)} ${
            chain?.nativeCurrency?.name || 'ETH'
          }`
        : '',
    [balance, chain, isConnected]
  );

  /**
   * The hook returns this to manually load the balance after a successful fund
   */
  const getBalance = useCallback(async () => {
    if (!bundlr) return '0';
    const newBalance = await bundlr.getLoadedBalance();
    const converted = bundlr.utils.unitConverter(newBalance);
    return converted.toString();
  }, [bundlr]);

  useEffect(() => {
    (async () => {
      if (bundlr) {
        const newBalance = await getBalance();
        dispatch(setBalance(newBalance));
      } else {
        dispatch(setBalance(''));
      }
    })();
  }, [bundlr, dispatch, getBalance]);

  useEffect(() => {
    const queryBalance = async () => {
      try {
        const newBalance = await getBalance();
        console.log('querying balance');
        // If our new balance is different than current, then funding is complete
        // update the new balance and clear out our interval
        if (newBalance !== balance) {
          console.log('balance is being updated due to funding completion');
          dispatch(setPendingBalance({
            balanceBeforeFund: '',
            txId: ''
          }));
          dispatch(setBalance(newBalance));
        }
      } catch (error) {
        console.error(error);
      }
    };

    if (pendingBalance.txId) {
      if (!intervalId) {
        const id = setInterval(() => {
          queryBalance();
        }, 5000);
        setIntervalId(id);
      }
    } else {
      if (intervalId) {
        clearInterval(intervalId);
      }
    }

    if (intervalId) {
      return () => clearInterval(intervalId);
    }
  }, [pendingBalance.txId, balance, dispatch, getBalance, intervalId]);

  return { balance, getBalance, formattedBalance };
}
