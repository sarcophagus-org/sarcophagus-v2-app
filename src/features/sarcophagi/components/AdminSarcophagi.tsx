import { RepeatIcon } from '@chakra-ui/icons';
import { Flex, IconButton, Text } from '@chakra-ui/react';
import { useNetworkConfig } from 'lib/config';
import { storeDeploymentBlockNumber } from 'lib/utils/storeDeploymentBlockNumber';
import { useEffect } from 'react';
import { useProvider } from 'wagmi';
import useSarcophagusCount from '../hooks/useSarcophagusCount';

export function AdminSarcophagi() {
  const networkConfig = useNetworkConfig();
  const provider = useProvider();
  const {
    fetchEvents,
    isLoading,
    currentBlock,
    blockCount,
    sarcophagusCount,
    sarcophagusCountLocalStorageKey,
  } = useSarcophagusCount();

  async function handleRefresh() {
    localStorage.removeItem(sarcophagusCountLocalStorageKey);
    fetchEvents();
  }

  useEffect(() => {
    (async () => {
      await storeDeploymentBlockNumber(provider, networkConfig);
      await fetchEvents();
    })();
  }, [fetchEvents, networkConfig, provider]);

  return (
    <Flex direction="column">
      <Text>This page is a work in progress.</Text>
      <Flex>
        {isLoading ? (
          <Flex direction="column">
            <Text mt={3}>Searching for Sarcophagi...</Text>
            <Text>
              Progress: {currentBlock} out of {blockCount} blocks processed.
            </Text>
          </Flex>
        ) : (
          <Flex>
            <Text mt={3}>
              Found {sarcophagusCount} {sarcophagusCount === 1 ? 'sarcophagus' : 'sarocphagi'}.
            </Text>
            <IconButton
              aria-label="refresh"
              icon={<RepeatIcon />}
              onClick={handleRefresh}
              variant="ghost"
              isLoading={isLoading}
            />
          </Flex>
        )}
      </Flex>
    </Flex>
  );
}
