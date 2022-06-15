import { ethers } from 'ethers';
import { useEffect, useState } from 'react';

export function useCurrentBlock(provider: ethers.providers.BaseProvider | null) {
  const [currentBlock, setCurrentBlock] = useState(0);

  useEffect(() => {
    if (!provider) {
      return;
    }
    provider
      .getBlockNumber()
      .then((blockNumber: number) => {
        setCurrentBlock(blockNumber);
      })
      .catch(console.error);

    const getBlockNumber = (blockNumber: number) => {
      setCurrentBlock(blockNumber);
    };

    provider.on('block', getBlockNumber);

    return () => {
      provider.removeListener('block', getBlockNumber);
    };
  }, [provider]);

  return currentBlock;
}
