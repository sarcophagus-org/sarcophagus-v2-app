import { Button, Image, Flex, Text, IconButton } from '@chakra-ui/react';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useSarcoBalance } from 'hooks/sarcoToken/useSarcoBalance';

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
                  _hover={{ bgColor: 'blue.1000' }}
                  _focus={{ bgColor: 'blue.1000' }}
                  cursor="auto"
                  mx={2}
                  bg="blue.1000"
                >
                  <Image
                    mr={2}
                    height={'20px'}
                    src="sarco-token-icon.png"
                  />
                  <Text>{formattedBalance}</Text>
                </Button>

                <Button
                  variant="ghost"
                  onClick={openAccountModal}
                  px={5}
                  bgGradient="linear-gradient(180deg, rgba(255, 255, 255, 0.044) 0%, rgba(255, 255, 255, 0.158) 100%)"
                >
                  <Text color="white">{account.displayName}</Text>
                </Button>

                <IconButton
                  ml={2}
                  variant="ghost"
                  color="white"
                  icon={
                    <Image
                      height={'20px'}
                      src="menu-dots.svg"
                    />
                  }
                  bg="blue.1000"
                  aria-label="more"
                />
              </Flex>
            )}
          </Flex>
        );
      }}
    </ConnectButton.Custom>
  );
}
