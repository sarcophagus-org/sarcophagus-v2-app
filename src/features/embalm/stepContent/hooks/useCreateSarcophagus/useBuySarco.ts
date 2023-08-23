import { sarco } from '@sarcophagus-org/sarcophagus-v2-sdk-client';
import { BigNumber } from 'ethers';
import { useSarcoBalance } from 'hooks/sarcoToken/useSarcoBalance';
import { useSelector } from 'store/index';

export function useBuySarco() {
  const { totalFees } = useSelector(x => x.embalmState);
  const { balance } = useSarcoBalance();

  async function buySarco() {
    const totalFeesWithBuffer = totalFees.add(totalFees.div(10));
    const sarcoDeficit = totalFeesWithBuffer.sub(BigNumber.from(balance));

    if (sarcoDeficit.gt(0)) {
      await sarco.utils.swapEthForSarco(sarcoDeficit);
    }
  }

  return { buySarco };
}
