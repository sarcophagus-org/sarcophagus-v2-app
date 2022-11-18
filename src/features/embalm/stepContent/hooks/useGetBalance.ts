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

  // Effect that loads the balance when the component mounts and if the bundlr is instantiated
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

  // Effect that runs an interval which queries the bundlr balance if the balanceOffset is not 0. If
  // the balance coming from the bundlr turns out to match the current balance plus the
  // balanceOffset, this indicates that the balance has been properly updated and the balanceOffset
  // is reset to 0, thus causing the contents of the interval to be skipped. The interval will start
  // again if fund or withdraw is called, which will (usually) set the balanceOffset to a non-zero
  // value.
  useEffect(() => {
    const timeoutId = setInterval(async () => {
      if (balanceOffset !== 0) {
        const newBalance = await getBalance();
        console.log('balanceOffset: ', balanceOffset);
        // Check if the sum of the balance stored in state and the balance offset is equal to the
        // new balance. This indicates that the balance has finally been updated to the expected
        // amount.
        //
        // Note that this solution still has a significant fault: If the user funds for 1 ETH and
        // then withdraws for 1 ETH, the app will think that the pending balance has been resolved
        // because the sum of the balance stored in state and the balance offset is equal to the new
        // balance, even though the balance hasn't technically been updated yet. The fund action may
        // have been applied immediately while the withdraw action could take another 20 min to
        // apply. Tracking the balance through an array of pending transactions as we were
        // previously would produce the same fault.
        //
        // The only way to reliably track if the balance is pending is for the Bundlr to tell us
        // that the balance is pending, which it doesn't do at this time. On mainnet, the balance is
        // updated much more quickly than on testnet, so this issue is not as big of a deal on
        // mainnet.
        if (parseFloat(balance) + balanceOffset === parseFloat(newBalance)) {
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
