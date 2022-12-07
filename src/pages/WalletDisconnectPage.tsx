import { Image, Text, Button, Container, Heading } from '@chakra-ui/react';
import { useAccount } from 'wagmi';
import pharaoh from 'assets/images/pharaoh.gif';
import { useConnectModal } from '@rainbow-me/rainbowkit';
import { useSupportedNetwork } from 'lib/config/useSupportedNetwork';
import { useClearSarcophagusState } from 'features/embalm/stepContent/hooks/useCreateSarcophagus/useClearSarcophagusState';
import { useDispatch } from 'store/index';
import { useEffect } from 'react';
import { goToStep } from 'store/embalm/actions';
import { Step } from 'store/embalm/reducer';

export function WalletDisconnectPage() {
  const { isConnected, address } = useAccount();
  const { openConnectModal } = useConnectModal();
  const { supportedNetworkNames } = useSupportedNetwork();

  const { clearSarcophagusState } = useClearSarcophagusState();
  const dispatch = useDispatch();

  useEffect(() => {
    if (!address) {
      clearSarcophagusState();
      dispatch(goToStep(Step.NameSarcophagus));
    }
  }, [address, clearSarcophagusState, dispatch]);

  return (
    <Container
      maxW="sm"
      centerContent
    >
      <Heading pb={2}>{!isConnected ? 'No Wallet Detected' : 'Unsupported Network'}</Heading>
      <Text align="center">
        {!isConnected
          ? 'Please connect to your web3 wallet to access this dapp.'
          : 'Please connect to a supported network.'}
      </Text>
      <Image
        src={pharaoh}
        w="125px"
        py={8}
      />
      {!isConnected ? (
        <Button onClick={openConnectModal}>Connect Wallet</Button>
      ) : (
        <Text
          align="center"
          variant="bold"
        >
          Supported Networks
          {supportedNetworkNames.map(network => (
            <Text
              fontWeight="normal"
              key={network}
            >
              {network}
            </Text>
          ))}
        </Text>
      )}
    </Container>
  );
}
