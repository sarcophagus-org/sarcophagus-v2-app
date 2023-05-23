import { RepeatIcon } from '@chakra-ui/icons';
import { Flex, IconButton, Text } from '@chakra-ui/react';
import { useSarcophagusCount } from '../hooks/useSarcophagusCount';

export function AdminSarcophagi() {
  const { counts, loading } = useSarcophagusCount();

  async function handleRefresh() {
    window.location.reload();
  }

  return (
    <Flex direction="column">
      <Flex>
        {loading ? (
          <Flex direction="column">
            <Text mt={3}>Searching for Sarcophagi...</Text>
          </Flex>
        ) : (
          <Flex>
            <Text mt={3}>
              Found {counts.totalSarcophagi}{' '}
              {counts.totalSarcophagi === 1 ? 'sarcophagus' : 'sarocphagi'}.
            </Text>
            <IconButton
              aria-label="refresh"
              icon={<RepeatIcon />}
              onClick={handleRefresh}
              variant="ghost"
              isLoading={loading}
            />
          </Flex>
        )}
      </Flex>
    </Flex>
  );
}
