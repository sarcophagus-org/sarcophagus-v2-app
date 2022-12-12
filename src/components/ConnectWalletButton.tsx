import { Button, Flex, Text, IconButton } from '@chakra-ui/react';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useSarcoBalance } from 'hooks/sarcoToken/useSarcoBalance';
import { DotsMenuIcon, SarcoTokenIcon } from 'components/icons';

export function ConnectWalletButton() {
  const { formattedBalance } = useSarcoBalance();

  return (
    <ConnectButton.Custom>
      {({ account, chain, mounted, openConnectModal, openAccountModal }) => {
        const connected = mounted && account && chain;

        return (
          <Flex>
            {!connected ? (
              <Button
                variant="ghost"
                onClick={openConnectModal}
              >
                <Text>Connect Wallet</Text>
              </Button>
            ) : (
              <Flex>
                <Button
                  variant="ghost"
                  _hover={{ bgColor: 'menuBlue.1000' }}
                  _focus={{ bgColor: 'menuBlue.1000' }}
                  cursor="auto"
                  bg="menuBlue.1000"
                  mx={2}
                  leftIcon={<SarcoTokenIcon />}
                >
                  <Text>{formattedBalance}</Text>
                </Button>

                <Button
                  variant="ghost"
                  onClick={openAccountModal}
                  px={5}
                  bgGradient="linear-gradient(180deg, rgba(255, 255, 255, 0.044) 0%, rgba(255, 255, 255, 0.158) 100%)"
                >
                  <Text>{account.displayName}</Text>
                </Button>
              </Flex>
            )}
          </Flex>
        );
      }}
    </ConnectButton.Custom>
  );
}
