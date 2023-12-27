import { sarco } from '@sarcophagus-org/sarcophagus-v2-sdk-client';
import { BigNumber } from 'ethers';
import { useEffect, useState } from 'react';
import { useSelector } from 'store/index';

export function useSarcoQuote(amount: BigNumber) {
  const [sarcoQuoteETHAmount, setSarcoQuoteETHAmount] = useState('0');
  const [sarcoQuoteError, setSarcoQuoteError] = useState('');
  const [isPolling, setIsPolling] = useState(false);
  const [quoteIntervalState, setSarcoQuoteInterval] = useState<NodeJS.Timer>();

  const { sarcoQuoteInterval } = useSelector(x => x.embalmState);

  useEffect(() => {
    async function getQuote() {
      if (sarcoQuoteInterval || isPolling || amount.lte(0)) return;

      setIsPolling(true);

      const runGetQuote = async () => {
        try {
          const quote = await sarco.utils.getSarcoQuote(amount);
          setSarcoQuoteETHAmount(quote.sellAmount);
        } catch (e: any) {
          setSarcoQuoteError(e.message);
        }
      };

      runGetQuote();

      const quoteInterval = setInterval(() => runGetQuote(), 100_000_000); // Temp set very high to avoid rate limits
      setSarcoQuoteInterval(quoteInterval);
    }
    getQuote();
  }, [amount, isPolling, sarcoQuoteInterval]);

  return { sarcoQuoteETHAmount, sarcoQuoteError, sarcoQuoteInterval: quoteIntervalState };
}
