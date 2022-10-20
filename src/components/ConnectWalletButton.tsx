import { ChevronDownIcon } from '@chakra-ui/icons';
import { Button, Divider, Flex, Text } from '@chakra-ui/react';
import { ConnectButton } from '@rainbow-me/rainbowkit';

export function ConnectWalletButton() {
  return (
    <ConnectButton.Custom>
      {({ account, chain, mounted, openConnectModal, openChainModal, openAccountModal }) => {
        const ready = mounted;
        const connected = ready && account && chain;

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
                  onClick={openChainModal}
                >
                  <Text color="brand.500">{chain.name}</Text>
                  <ChevronDownIcon ml={1} />
                </Button>
                <Divider
                  mx={3}
                  orientation="vertical"
                />
                <Button
                  variant="ghost"
                  onClick={openAccountModal}
                >
                  <Text color="brand.500">
                    {account.displayBalance ? ` (${account.displayBalance})` : ''}
                  </Text>
                  <Text
                    ml={3}
                    color="brand.500"
                  >
                    {account.displayName}
                    <ChevronDownIcon ml={1} />
                  </Text>
                </Button>
              </Flex>
            )}
          </Flex>
        );
      }}
    </ConnectButton.Custom>
  );
}
