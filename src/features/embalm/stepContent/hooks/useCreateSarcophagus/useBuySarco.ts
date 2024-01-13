import { sarco } from '@sarcophagus-org/sarcophagus-v2-sdk-client';
import { BigNumber } from 'ethers';
import { useSarcoBalance } from 'hooks/sarcoToken/useSarcoBalance';
import { useSelector } from 'store/index';
import { getZeroExQuote } from '../../../../../lib/utils/zeroEx';
import { useCallback } from 'react';

export function useBuySarco(chainId: number | undefined) {
  const { totalFees } = useSelector(x => x.embalmState);
  const { balance } = useSarcoBalance();

  const buySarco = useCallback(async () => {
    if (!chainId || !balance) return;
    const totalFeesWithBuffer = totalFees.add(totalFees.div(10));
    const sarcoDeficit = totalFeesWithBuffer.sub(BigNumber.from(balance));

    if (sarcoDeficit.gt(0)) {
      const quote = await getZeroExQuote(chainId, sarcoDeficit);
      await sarco.utils.swapEthForSarco(sarcoDeficit, quote);
    }
  }, [chainId, balance, totalFees]);

  return { buySarco };
}
