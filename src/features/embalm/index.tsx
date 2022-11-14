import { Flex, Heading, Text, VStack } from '@chakra-ui/react';
import { MagicFormFiller } from 'components/MagicFormFiller';
import { StepContent } from 'features/embalm/stepContent';
import { useNetworkConfig } from 'lib/config';
import { networkConfigs } from 'lib/config/networkConfig';
import { useAccount } from 'wagmi';
import { useBootLibp2pNode } from '../../hooks/libp2p/useBootLibp2pNode';
import { useBundlrSession } from './stepContent/hooks/useBundlrSession';
import { useLoadArchaeologists } from './stepContent/hooks/useLoadArchaeologists';
import { StepNavigator } from './stepNavigator';

// Set to true to remove the magic form filler button on the top right
const hideMagicFormFiller = false;

export function Embalm() {
  useLoadArchaeologists();
  useBundlrSession();
  useBootLibp2pNode(20_000);

  const supportedChainIds =
    process.env.REACT_APP_SUPPORTED_CHAIN_IDS?.split(',').map(id => parseInt(id)) || [];
  const { isConnected } = useAccount();
  const networkConfig = useNetworkConfig();

  const supportedNetworkNames = Object.values(networkConfigs)
    .filter(config => supportedChainIds.includes(config.chainId))
    .map(config => config.networkShortName);

  return (
    <Flex
      ml="84px"
      w="65%"
      minWidth="500px"
      direction="column"
      height="100%"
    >
      {process.env.NODE_ENV === 'development' && !hideMagicFormFiller && <MagicFormFiller />}
      {/* Upper section with title */}
      <Flex py="48px">
        <Heading>New Sarcophagus</Heading>
      </Flex>

      {/* Lower section with content */}
      <Flex
        flex={1}
        direction="row"
        height="100%"
        width="100%"
      >
        {/* Left side container */}
        <Flex
          minWidth={300}
          maxWidth={300}
        >
          <StepNavigator />
        </Flex>

        {/* Space between */}
        <Flex
          minWidth={100}
          w="10%"
        />

        {/* Right side container */}
        <Flex flex={1}>
          {!isConnected ? (
            <VStack>
              <Heading>Please connect wallet to create a sarcophagus</Heading>
            </VStack>
          ) : networkConfig === undefined || !supportedChainIds.includes(networkConfig.chainId) ? (
            <VStack>
              <Heading>You are connected on an unsupported Network</Heading>
              <Text>Supported Networks</Text>
              {supportedNetworkNames.map(network => (
                <Text key={network}>{network}</Text>
              ))}
            </VStack>
          ) : (
            <StepContent />
          )}
        </Flex>
      </Flex>
    </Flex>
  );
}
