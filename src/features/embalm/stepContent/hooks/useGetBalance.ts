import { bundlrBalanceDecimals } from 'lib/constants';
import { useCallback, useEffect, useMemo } from 'react';
import { setBalance } from 'store/bundlr/actions';
import { useDispatch, useSelector } from 'store/index';
import { useNetwork } from 'wagmi';
import { useBundlr } from './useBundlr';

export function useGetBalance() {
  const dispatch = useDispatch();
  const { bundlr } = useBundlr();
  const { balance, isConnected } = useSelector(x => x.bundlrState);
  const { chain } = useNetwork();

  const formattedBalance = useMemo(
    () =>
      isConnected
        ? `${parseFloat(balance).toFixed(bundlrBalanceDecimals)} ${chain?.nativeCurrency?.name || 'ETH'}`
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

  return { balance, getBalance, formattedBalance };
}
