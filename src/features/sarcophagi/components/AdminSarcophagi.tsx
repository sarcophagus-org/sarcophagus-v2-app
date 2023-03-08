import { Flex, Spinner, Text } from '@chakra-ui/react';
import { EmbalmerFacet__factory } from '@sarcophagus-org/sarcophagus-v2-contracts';
import { useNetworkConfig } from 'lib/config';
import { useCallback, useEffect, useState } from 'react';
import { useProvider } from 'wagmi';

export function AdminSarcophagi() {
  const networkConfig = useNetworkConfig();
  const provider = useProvider();
  const [sarcophagusCount, setSarcophagusCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const fetchEvents = useCallback(async () => {
    setIsLoading(true);
    try {
      const contract = EmbalmerFacet__factory.connect(networkConfig.diamondDeployAddress, provider);
      const events = await contract.queryFilter('CreateSarcophagus');
      setSarcophagusCount(events.length);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }, [networkConfig.diamondDeployAddress, provider]);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  if (isLoading) {
    return (
      <Flex>
        <Spinner />
      </Flex>
    );
  }

  return (
    <Flex direction="column">
      <Text>This page is a work in progress.</Text>
      <Text mt={3}>
        There are currently {sarcophagusCount}{' '}
        {sarcophagusCount === 1 ? 'sarcophagus' : 'sarocphagi'}.
      </Text>
    </Flex>
  );
}
