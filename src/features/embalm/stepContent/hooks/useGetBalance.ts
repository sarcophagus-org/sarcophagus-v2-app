import { BigNumber, ethers } from 'ethers';
import { bundlrBalanceDecimals } from 'lib/constants';
import { useCallback, useEffect, useMemo } from 'react';
import { resetBalanceOffset, setBalance } from 'store/bundlr/actions';
import { useDispatch, useSelector } from 'store/index';
import { useNetwork } from 'wagmi';
import { useBundlr } from './useBundlr';

const fetchBalanceTimeout = 5_000;

export function useGetBalance() {
  const dispatch = useDispatch();
  const { bundlr } = useBundlr();
  const { balance, isConnected, balanceOffset } = useSelector(x => x.bundlrState);
  const { chain } = useNetwork();

  const formattedBalance = useMemo(
    () =>
      isConnected && balance
        ? `${parseFloat(ethers.utils.formatUnits(balance)).toFixed(bundlrBalanceDecimals)} ${
            chain?.nativeCurrency?.name || 'ETH'
          }`
        : '',
    [balance, chain, isConnected]
  );

  /**
   * The hook returns this to manually load the balance after a successful fund
   */
  const getBalance = useCallback(async () => {
    if (!bundlr) return ethers.constants.Zero;
    const newBalance = await bundlr.getLoadedBalance();
    return BigNumber.from(newBalance.toString());
  }, [bundlr]);

  // Effect that loads the balance when the component mounts and if the bundlr is instantiated
  useEffect(() => {
    (async () => {
      if (bundlr) {
        const newBalance = await getBalance();
        dispatch(setBalance(newBalance));
      } else {
        dispatch(setBalance(ethers.constants.Zero));
      }
    })();
  }, [bundlr, dispatch, getBalance]);

  // Effect that runs an interval which queries the bundlr balance if the balanceOffset is not 0. If
  // the balance coming from the bundlr turns out to match the current balance plus the
  // balanceOffset, this indicates that the balance has been properly updated and the balanceOffset
  // is reset to 0, thus causing the contents of the interval to be skipped. The interval will start
  // again if fund or withdraw is called, which will (usually) set the balanceOffset to a non-zero
  // value.
  useEffect(() => {
    const timeoutId = setInterval(async () => {
      if (!balanceOffset.eq(ethers.constants.Zero)) {
        const newBalance = await getBalance();
        // Check if the sum of the balance stored in state and the balance offset is equal to the
        // new balance. This indicates that the balance has finally been updated to the expected
        // amount.
        if (balance.add(balanceOffset).eq(newBalance)) {
          dispatch(resetBalanceOffset());
        }

        // Set the balance to the retreived balance on each interval
        dispatch(setBalance(newBalance));
      }
    }, fetchBalanceTimeout);

    return () => {
      clearInterval(timeoutId);
    };
  }, [balance, balanceOffset, dispatch, getBalance]);

  return { balance, getBalance, formattedBalance };
}
