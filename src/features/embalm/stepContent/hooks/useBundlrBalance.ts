import { BigNumber, ethers } from 'ethers';
import { bundlrBalanceDecimals } from 'lib/constants';
import { useCallback, useEffect, useMemo } from 'react';
import { sarco } from 'sarcophagus-v2-sdk';
import { resetBalanceOffset, setBalance } from 'store/bundlr/actions';
import { useDispatch, useSelector } from 'store/index';
import { useNetwork } from 'wagmi';

const fetchBalanceTimeout = 5_000;

export function useBundlrBalance() {
  const dispatch = useDispatch();
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
    const newBalance = await sarco.bundlr.getLoadedBalance();
    return BigNumber.from(newBalance.toString());
  }, []);

  // Effect that loads the balance when the component mounts and if the bundlr is instantiated
  useEffect(() => {
    (async () => {
      const newBalance = await getBalance();
      dispatch(setBalance(newBalance));
    })();
  }, [dispatch, getBalance]);

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
