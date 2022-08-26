import { useState } from 'react';
import { useAsyncEffect } from '../../../hooks/useAsyncEffect';
import { useBundlr } from './useBundlr';

export function useGetBalance() {
  const { bundlr } = useBundlr();
  const [balance, setBalance] = useState('0');

  useAsyncEffect(async () => {
    if (bundlr) {
      const newBalance = await bundlr.getLoadedBalance();
      const converted = bundlr.utils.unitConverter(newBalance);
      setBalance(converted.toString());
    } else {
      setBalance('0');
    }
  }, [bundlr]);

  return balance;
}
