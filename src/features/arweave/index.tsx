import { Divider, Flex, Heading, Text } from '@chakra-ui/react';
import { useAccount } from 'wagmi';
import { BundlrBalance } from './BundlrBalance';
import { BundlrConnect } from './BundlrConnect';
import { DownloadFile } from './DownloadFile';
import { FundBundlr } from './FundBundlr';
import { NetworkSelector } from './NetworkSelector';
import { UploadFile } from './UploadFile';
import { WithdrawBalance } from './WithdrawBalance';

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
    <Flex direction="column">
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
