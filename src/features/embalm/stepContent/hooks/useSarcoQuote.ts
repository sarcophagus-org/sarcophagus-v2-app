import { sarco } from '@sarcophagus-org/sarcophagus-v2-sdk-client';
import { BigNumber } from 'ethers';
import { useEffect, useState } from 'react';

export function useSarcoQuote(amount: BigNumber): string {
  const [sarcoQuoteAmount, setSarcoQuoteAmount] = useState('0');

  useEffect(() => {
    async function getQuote() {
      if (amount.lte(0)) return;

      const quote = await sarco.utils.getSarcoQuote(amount);
      setSarcoQuoteAmount(quote.sellAmount);
    }
    getQuote();
  }, [amount]);

  return sarcoQuoteAmount;
}
