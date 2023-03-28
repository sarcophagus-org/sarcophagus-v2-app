import { EmbalmerFacet__factory } from '@sarcophagus-org/sarcophagus-v2-contracts';
import { useNetworkConfig } from 'lib/config';
import {
  getSarcophagusCountFromLocalStorage,
  saveSarcophagusCountToLocalStorage,
} from 'lib/utils/sarcohpagusCountLocalStorage';
import { getBlockNumberLocalStorageKey } from 'lib/utils/storeDeploymentBlockNumber';
import { useCallback, useState } from 'react';
import { useProvider } from 'wagmi';

const useSarcophagusCount = (refreshSarcophagusCountMs: number = 5 * 60 * 1000) => {
  const networkConfig = useNetworkConfig();
  const provider = useProvider();
  const [sarcophagusCount, setSarcophagusCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [currentBlock, setCurrentBlock] = useState(0);
  const [blockCount, setBlockCount] = useState(0);

  // Generate the localStorage key for the current network and contract address
  const sarcophagusCountLocalStorageKey = `sarcophagusCount_${networkConfig.chainId}_${networkConfig.diamondDeployAddress}`;

  // Main function to fetch events and calculate sarcophagus count
  const fetchEvents = useCallback(async () => {
    setIsLoading(true);

    // Attempt to retrieve the count from localStorage and verify if it's still valid
    const countData = getSarcophagusCountFromLocalStorage(sarcophagusCountLocalStorageKey);
    if (countData && Date.now() - countData.timestamp < refreshSarcophagusCountMs) {
      setSarcophagusCount(countData.count);
      setIsLoading(false);
      return;
    }

    // Fetch 'CreateSarcophagus' events within a given range of blocks
    const fetchEventsInRange = async (fromBlock: number, toBlock: number): Promise<Event[]> => {
      const contract = EmbalmerFacet__factory.connect(networkConfig.diamondDeployAddress, provider);
      return contract.queryFilter('CreateSarcophagus', fromBlock, toBlock);
    };

    try {
      const chunkSize = 10000;
      const blockNumberLocalStorageKey = getBlockNumberLocalStorageKey(networkConfig);
      const storedDeploymentBlockNumber = localStorage.getItem(blockNumberLocalStorageKey);
      if (!storedDeploymentBlockNumber)
        throw new Error('Contract deployment block number not found in local storage.');

      const fromBlock = parseInt(storedDeploymentBlockNumber, 10);
      const toBlock = await provider.getBlockNumber();
      setBlockCount(toBlock - fromBlock);

      // Iterate through blocks in chunks, fetching events and updating progress
      let events: Event[] = [];
      for (let startBlock = fromBlock; startBlock <= toBlock; startBlock += chunkSize) {
        const endBlock = Math.min(startBlock + chunkSize - 1, toBlock);
        const chunkEvents = await fetchEventsInRange(startBlock, endBlock);
        events = events.concat(chunkEvents);
        setCurrentBlock(startBlock - fromBlock);
      }

      // Update the sarcophagus count and save it to localStorage
      setSarcophagusCount(events.length);
      saveSarcophagusCountToLocalStorage(sarcophagusCountLocalStorageKey, events.length);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }, [networkConfig, provider, refreshSarcophagusCountMs, sarcophagusCountLocalStorageKey]);

  return {
    sarcophagusCount,
    isLoading,
    currentBlock,
    blockCount,
    fetchEvents,
    sarcophagusCountLocalStorageKey,
  };
};

export default useSarcophagusCount;
