import { Button, Flex, Text } from '@chakra-ui/react';
import { useBundlr } from './hooks/useBundlr';

/**
 * This is a temporary component meant to be used as a showcase for the arweave bundlr functionality
 */
export function BundlrConnect() {
  const { bundlr, isConnected, connectToBundlr, disconnectFromBundlr } = useBundlr();

  function handleClickButton() {
    if (isConnected) {
      disconnectFromBundlr();
    } else {
      // Connects the client to the bundlr node. Prompts the user to sign a message.
      connectToBundlr();
    }
  }

  return (
    <Flex
      mt={6}
      direction="column"
    >
      <Text
        fontSize="sm"
        color="#999"
        as="i"
      >
        Connect to the bundlr node
      </Text>
      <Flex align="center">
        <Button
          width={150}
          mt={3}
          onClick={handleClickButton}
        >
          {isConnected ? 'Disconnect' : 'Connect'}
        </Button>
        {isConnected && (
          <Text
            as="b"
            ml={3}
          >
            Connected with {bundlr?.address}
          </Text>
        )}
      </Flex>
    </Flex>
  );
}
