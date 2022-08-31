import { Box, Divider, Flex, Heading, Text } from '@chakra-ui/react';
import { useAccount } from 'wagmi';
import { BundlrBalance } from './components/BundlrBalance';
import { BundlrConnect } from './components/BundlrConnect';
import { DownloadFile } from './components/DownloadFile';
import { FundBundlr } from './components/FundBundlr';
import { NetworkSelector } from './components/NetworkSelector';
import { UploadFile } from './components/UploadFile';
import { WithdrawBalance } from './components/WithdrawBalance';

/**
 * A temporary component that contains the necessary functionality for devs to test the Arweave
 * Bundlr service.
 *
 * The hooks being used within these components are meant for production but the components should
 * be used just as examples.
 */
export function Arweave() {
  const { isConnected } = useAccount();

  return (
    <Flex
      direction="column"
      ml="72px"
      mt="48px"
    >
      <Heading size="lg">Arweave Test</Heading>
      <Text
        mt={3}
        color="#999"
      >
        This is a temporary page that contains the necessary functionality for devs to test the
        Arweave Bundlr service.
      </Text>
      {isConnected ? (
        <>
          <Divider mt={6} />
          <NetworkSelector />
          <Divider mt={6} />
          <BundlrConnect />
          <Divider mt={6} />
          <BundlrBalance />
          <Divider mt={6} />
          <FundBundlr />
          <Divider mt={6} />
          <WithdrawBalance />
          <Divider mt={6} />
          <UploadFile />
          <Divider mt={6} />
          <DownloadFile />
          <Divider mt={6} />
        </>
      ) : (
        <Text
          mt={10}
          as="b"
          color="goldenrod"
          fontSize="lg"
        >
          Connect your wallet
        </Text>
      )}
    </Flex>
  );
}
