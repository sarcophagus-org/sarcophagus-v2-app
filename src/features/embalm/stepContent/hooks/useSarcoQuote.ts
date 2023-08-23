import { sarco } from '@sarcophagus-org/sarcophagus-v2-sdk-client';
import { BigNumber } from 'ethers';
import { useEffect, useState } from 'react';
import { useSelector } from 'store/index';

export function useSarcoQuote(amount: BigNumber) {
  const [sarcoQuoteETHAmount, setSarcoQuoteETHAmount] = useState('0');
  const [isPolling, setIsPolling] = useState(false);
  const [quoteIntervalState, setSarcoQuoteInterval] = useState<NodeJS.Timer>();

  const { sarcoQuoteInterval } = useSelector(x => x.embalmState);

  useEffect(() => {
    async function getQuote() {
      if (sarcoQuoteInterval || isPolling || amount.lte(0)) return;

      setIsPolling(true);

      const runGetQuote = async () => {
        const quote = await sarco.utils.getSarcoQuote(amount);
        setSarcoQuoteETHAmount(quote.sellAmount);
      };

      runGetQuote();

      const quoteInterval = setInterval(() => runGetQuote(), 10_000); // 10 seconds
      setSarcoQuoteInterval(quoteInterval);
    }
    getQuote();
  }, [amount, isPolling, sarcoQuoteInterval]);

  return { sarcoQuoteETHAmount, sarcoQuoteInterval: quoteIntervalState };
}
