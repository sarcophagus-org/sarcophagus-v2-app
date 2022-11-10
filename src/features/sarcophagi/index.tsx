import { QuestionIcon } from '@chakra-ui/icons';
import { Center, Flex, Spinner, TabList, TabPanel, TabPanels, Tabs, Text } from '@chakra-ui/react';
import { ethers } from 'ethers';
import { useGetEmbalmerSarcophagi, useGetRecipientSarcophagi } from 'hooks/viewStateFacet';
import { useAccount } from 'wagmi';
import { NoSarcpohagi } from './components/NoSarcophagi';
import { SarcoTab } from './components/SarcoTab';
import { SarcoTable } from './components/SarcoTable';

/**
 * A component that manages the app's sarcophagi. Should be styled to fit any container.
 */
export function Sarcophagi() {
  const { address } = useAccount();
  const { data: embalmerSarcophagi, isLoading } = useGetEmbalmerSarcophagi(
    address || ethers.constants.AddressZero
  ) as { data: string[]; isLoading: boolean };

  const recipientSarcophagi = useGetRecipientSarcophagi(address || ethers.constants.AddressZero);

  function embalmerPanel() {
    if (isLoading) {
      return (
        <Center my={16}>
          <Spinner size="xl" />
        </Center>
      );
    }
    if (!isLoading && embalmerSarcophagi?.length === 0) {
      return <NoSarcpohagi />;
    }
    return <SarcoTable ids={embalmerSarcophagi} />;
  }

  return (
    <Flex
      direction="column"
      w="100%"
      h="100%"
    >
      <Flex
        justify="center"
        w="100%"
        bg="whiteAlpha.400"
        py={3}
      >
        <Text>SARCOPHAGI</Text>
        <QuestionIcon
          ml={1}
          fontSize="xs"
        />
      </Flex>
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
          <SarcoTab>My Sarcophagi</SarcoTab>
          <SarcoTab>Claim Sarcophagi</SarcoTab>
        </TabList>
        <TabPanels
          overflow="hidden"
          bg="linear-gradient(180deg, rgba(255, 255, 255, 0) 0%, rgba(255, 255, 255, 0.09) 100%);"
        >
          <TabPanel h="100%">{embalmerPanel()}</TabPanel>
          <TabPanel h="100%">
            <SarcoTable ids={recipientSarcophagi} />
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Flex>
  );
}
