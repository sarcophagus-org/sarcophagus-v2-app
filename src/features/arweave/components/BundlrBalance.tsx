import { Flex, Text } from '@chakra-ui/react';
import { useNetwork } from 'wagmi';
import { useBundlr } from '../hooks/useBundlr';
import { useGetBalance } from '../hooks/useGetBalance';

/**
 * This is a temporary component meant to be used as a showcase for the arweave bundlr functionality
 */
export function BundlrBalance() {
  const { chain } = useNetwork();
  const balance = useGetBalance();
  const { isConnected } = useBundlr();

  return (
    <Flex
      mt={6}
      direction="column"
    >
      <Flex>
        <Text
          fontSize="sm"
          color="#999"
          as="i"
        >
          Your balance on the bundlr node
        </Text>
      </Flex>
      <Flex>
        <Text as="b">Your Balance: </Text>
        <Text
          color="#999"
          ml={3}
        >
          {isConnected ? `${balance} ${chain?.nativeCurrency?.name}` : 'Not connected'}
        </Text>
      </Flex>
    </Flex>
  );
}
