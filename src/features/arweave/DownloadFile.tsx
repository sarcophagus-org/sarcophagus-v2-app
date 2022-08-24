import { Button, Flex, Heading, Link, Text } from '@chakra-ui/react';
import { useBundlr } from './hooks/useBundlr';

export function DownloadFile() {
  const { txId } = useBundlr();

  if (!txId) return <></>;

  return (
    <Flex
      mt={6}
      mb={200}
      direction="column"
    >
      <Heading size="md">Download Payload</Heading>
      <Flex mt={6}>
        <Text as="b">Arweave Transaction ID:</Text>
        <Text
          color="#999"
          ml={3}
        >
          {txId}
        </Text>
      </Flex>
      <Link
        mt={6}
        width={200}
        href={`https://arweave.net/${txId}`}
        style={{ textDecoration: 'none' }}
      >
        <Button colorScheme="blue">Download</Button>
      </Link>
    </Flex>
  );
}
