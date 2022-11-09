import { BigNumber, ethers } from 'ethers';
import { useState, useEffect } from 'react';
import { useAccount, useProvider } from 'wagmi';

export function useEthBalance() {
  const { address } = useAccount();
  const provider = useProvider();
  const [ethBalance, setEthBalance] = useState<BigNumber>(BigNumber.from('0'));

  useEffect(() => {
    (async () => {
      if (address && provider) {
        const balance = await provider.getBalance(address);
        setEthBalance(balance);
      }
    })();
  }, [address, provider]);

  return { value: ethBalance, balance: ethers.utils.formatEther(ethBalance) };
}
