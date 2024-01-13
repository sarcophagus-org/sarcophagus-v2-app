import { BigNumber } from 'ethers';
import { useEffect, useRef, useState } from 'react';
import { useSelector } from 'store/index';
import { useNetwork } from 'wagmi';
import { getZeroExQuote } from '../../../../lib/utils/zeroEx';

export function useSarcoQuote(amount: BigNumber) {
  const [sarcoQuoteETHAmount, setSarcoQuoteETHAmount] = useState('0');
  const [sarcoQuoteError, setSarcoQuoteError] = useState('');
  const isPollingRef = useRef(false);
  const [quoteIntervalState, setSarcoQuoteInterval] = useState<NodeJS.Timer>();
  const { chain } = useNetwork();

  const { sarcoQuoteInterval } = useSelector(x => x.embalmState);

  useEffect(() => {
    async function getQuote() {
      if (!chain || isPollingRef.current || amount.lte(0)) return;

      isPollingRef.current = true;

      const runGetQuote = async () => {
        try {
          const quote = await getZeroExQuote(chain.id, amount);
          setSarcoQuoteETHAmount(quote.sellAmount);
        } catch (e: any) {
          setSarcoQuoteError(e);
        } finally {
          isPollingRef.current = false;
        }
      };

      runGetQuote();

      const quoteInterval = setInterval(() => runGetQuote(), 100_000_000); // Temp set very high to avoid rate limits
      setSarcoQuoteInterval(quoteInterval);

      return () => clearInterval(quoteInterval);
    }
    getQuote();
  }, [amount, sarcoQuoteInterval, chain]);

  return { sarcoQuoteETHAmount, sarcoQuoteError, sarcoQuoteInterval: quoteIntervalState };
}
