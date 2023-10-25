import { Text } from '@chakra-ui/react';
import { ethers } from 'ethers';
import { useEthBalance } from 'hooks/useEthBalance';
import { useEthPrice } from 'hooks/useEthPrice';
import { useSelector } from 'store/index';
import { useNetwork } from 'wagmi';

export function WalletBalance() {
  const { isFunding } = useSelector(s => s.bundlrState);

  const ethPrice = useEthPrice();

  const { chain } = useNetwork();

  const { balance: ethBalance } = useEthBalance(isFunding);
  const formattedEthBalance = Number(ethBalance).toFixed(4);

  const ethUsdValue = chain?.name.toLowerCase().includes('polygon')
    ? NaN
    : Math.round(parseFloat(ethBalance) * parseFloat(ethPrice));

  return (
    <Text mt={3}>
      Wallet Balance: {formattedEthBalance} {chain?.nativeCurrency?.name || 'ETH'}{' '}
      {!isNaN(ethUsdValue) && `($${ethers.utils.commify(ethUsdValue)})`}
    </Text>
  );
}
