import { BigNumber, ethers } from 'ethers';
import { useToast } from '@chakra-ui/react';
import { useSupportedNetwork } from 'lib/config/useSupportedNetwork';
import { bundlrBalanceDecimals } from 'lib/constants';
import { useCallback, useEffect, useMemo } from 'react';
import { sarco } from '@sarcophagus-org/sarcophagus-v2-sdk-client';
import { resetBalanceOffset, setBalance } from 'store/bundlr/actions';
import { useDispatch, useSelector } from 'store/index';
import { useNetwork } from 'wagmi';
import { fundsUpdated } from 'lib/utils/toast';

const fetchBalanceTimeout = 5_000;

export function useBundlrBalance() {
  const toast = useToast();
  const dispatch = useDispatch();
  const { balance, balanceOffset } = useSelector(x => x.bundlrState);
  const { chain } = useNetwork();
  const { isBundlrConnected } = useSupportedNetwork();

  const formattedBalance = useMemo(
    () =>
      isBundlrConnected && balance
        ? `${parseFloat(ethers.utils.formatUnits(balance)).toFixed(bundlrBalanceDecimals)} ${
            chain?.nativeCurrency?.name || 'ETH'
          }`
        : '',
    [balance, chain?.nativeCurrency?.name, isBundlrConnected]
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
      if (!isBundlrConnected) return;
      const newBalance = await getBalance();
      dispatch(setBalance(newBalance));
    })();
  }, [dispatch, getBalance, isBundlrConnected]);

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
          toast(fundsUpdated());
        }

        // Set the balance to the retreived balance on each interval
        dispatch(setBalance(newBalance));
      }
    }, fetchBalanceTimeout);

    return () => {
      clearInterval(timeoutId);
    };
  }, [balance, balanceOffset, dispatch, getBalance, toast]);

  return { balance, getBalance, formattedBalance };
}
