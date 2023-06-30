import { Button, Flex, TabList, TabPanel, TabPanels, Tabs, Text } from '@chakra-ui/react';
import { BigNumber, ethers } from 'ethers';
import { useBundlr } from 'features/embalm/stepContent/hooks/useBundlr';
import { useBundlrSession } from 'features/embalm/stepContent/hooks/useBundlrSession';
import { SarcoTab } from 'features/sarcophagi/components/SarcoTab';
import { useSelector } from 'store/index';
import { BundlrAction, BundlrProfile } from './BundlrProfile';
import { BusyIndicator } from './BusyIndicator';

export function Bundlr() {
  const { connectToBundlr } = useBundlrSession();
  const { fund, withdraw, isFunding, isWithdrawing } = useBundlr();
  const bundlr = useSelector(s => s.bundlrState.bundlr);

  function handleDeposit(amount: BigNumber) {
    if (amount.lte(ethers.constants.Zero)) {
      throw new Error('Deposit amount must be a positive number');
    }

    fund(amount);
  }

  function handleWithdraw(amount: BigNumber) {
    if (amount.lte(ethers.constants.Zero)) {
      throw new Error('Withdraw amount must be a positive number');
    }

    withdraw(amount);
  }

  function handleConnect() {
    connectToBundlr();
  }

  return (
    <Flex
      w="100%"
      border="1px solid"
      borderColor="whiteAlpha.300"
      direction="column"
    >
      <Flex
        justify="center"
        w="100%"
        bg="whiteAlpha.400"
        py={3}
      >
        <Text fontSize="md">BUNDLR</Text>
      </Flex>
      {bundlr ? (
        <Tabs
          variant="enclosed"
          overflow="hidden"
          isFitted
          display="flex"
          flexDirection="column"
          border="1px solid"
          borderColor="whiteAlpha.300"
        >
          <TabList border="none">
            <SarcoTab>Deposit</SarcoTab>
            <SarcoTab>Withdraw</SarcoTab>
          </TabList>
          <TabPanels
            overflow="hidden"
            bg="linear-gradient(180deg, rgba(255, 255, 255, 0) 0%, rgba(255, 255, 255, 0.09) 100%);"
          >
            <TabPanel
              px={10}
              py={6}
              h="100%"
            >
              {isFunding ? (
                <BusyIndicator>Funding. Please wait...</BusyIndicator>
              ) : (
                <BundlrProfile
                  onDeposit={handleDeposit}
                  onConnect={handleConnect}
                  action={bundlr ? BundlrAction.Deposit : BundlrAction.Connect}
                />
              )}
            </TabPanel>
            <TabPanel
              px={10}
              py={6}
              h="100%"
            >
              {isWithdrawing ? (
                <BusyIndicator>Withdrawing. Please wait...</BusyIndicator>
              ) : (
                <BundlrProfile
                  onWithdraw={handleWithdraw}
                  onConnect={handleConnect}
                  action={bundlr ? BundlrAction.Withdraw : BundlrAction.Connect}
                />
              )}
            </TabPanel>
          </TabPanels>
        </Tabs>
      ) : (
        <Flex
          flexDirection="column"
          my={16}
          mx={16}
          textAlign="center"
        >
          <Text>You need to connect to the Bundlr to continue.</Text>
          <Button
            mt={6}
            onClick={handleConnect}
          >
            Connect to Bundlr
          </Button>
        </Flex>
      )}
    </Flex>
  );
}
