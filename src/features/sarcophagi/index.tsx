import {
  Center,
  Flex,
  HStack,
  Icon,
  Spinner,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
  Tooltip,
} from '@chakra-ui/react';
import { ethers } from 'ethers';
import { useAccount } from 'wagmi';
import { NoSarcpohagi } from './components/NoSarcophagi';
import { SarcoTab } from './components/SarcoTab';
import { SarcoTable } from './components/SarcoTable';
import { InfoOutlineIcon } from '@chakra-ui/icons';
import { SarcophagusData, sarco } from '@sarcophagus-org/sarcophagus-v2-sdk-client';
import { useEffect, useState } from 'react';
import { useSupportedNetwork } from 'lib/config/useSupportedNetwork';

/**
 * A component that manages the app's sarcophagi. Should be styled to fit any container.
 */
export function Sarcophagi() {
  const { address } = useAccount();

  const [isLoadingEmbalmerSarcophagi, setIsLoadingEmbalmerSarcophagi] = useState(false);
  const [embalmerSarcophagi, setEmbalmerSarcophagi] = useState<SarcophagusData[]>([]);
  const [isLoadingRecipientSarcophagi, setIsLoadingRecipientSarcophagi] = useState(false);
  const [recipientSarcophagi, setRecipientSarcophagi] = useState<SarcophagusData[]>([]);

  const { isSarcoInitialized } = useSupportedNetwork();

  useEffect(() => {
    if (isSarcoInitialized) {
      // EMALMER SARCO
      setIsLoadingEmbalmerSarcophagi(true);
      sarco.api.getEmbalmerSarcophagi(address || ethers.constants.AddressZero).then(res => {
        setEmbalmerSarcophagi(res);
        setIsLoadingEmbalmerSarcophagi(false);
      });

      // RECIPIENT SARCO
      setIsLoadingRecipientSarcophagi(true);
      sarco.api.getRecipientSarcophagi(address || ethers.constants.AddressZero).then(res => {
        setRecipientSarcophagi(res);
        setIsLoadingRecipientSarcophagi(false);
      });
    }
  }, [address, isSarcoInitialized]);

  function embalmerPanel() {
    if (isLoadingEmbalmerSarcophagi) {
      return (
        <Center my={16}>
          <Spinner size="xl" />
        </Center>
      );
    }
    if (!isLoadingEmbalmerSarcophagi && embalmerSarcophagi?.length === 0) {
      return <NoSarcpohagi />;
    }
    return <SarcoTable sarcophagi={embalmerSarcophagi} />;
  }

  function recipientPanel() {
    if (isLoadingRecipientSarcophagi) {
      return (
        <Center my={16}>
          <Spinner size="xl" />
        </Center>
      );
    }
    if (!isLoadingRecipientSarcophagi && recipientSarcophagi?.length === 0) {
      return <NoSarcpohagi />;
    }
    return (
      <SarcoTable
        isClaimTab
        sarcophagi={recipientSarcophagi}
      />
    );
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
        {/* TODO: Do we need this icon? */}
        {/* <Tooltip label="s">
          <QuestionIcon
            ml={1}
            fontSize="xs"
          />
        </Tooltip> */}
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
          <SarcoTab>
            <HStack>
              <Text>My Sarcophagi</Text>
              <Tooltip
                label="Sarcophagi you have created."
                placement="top"
              >
                <Icon as={InfoOutlineIcon} />
              </Tooltip>
            </HStack>
          </SarcoTab>
          <SarcoTab>
            <HStack>
              <Text>Claim Sarcophagi</Text>
              <Tooltip
                label="Sarcophagi you are the recipient for."
                placement="top"
              >
                <Icon as={InfoOutlineIcon} />
              </Tooltip>
            </HStack>
          </SarcoTab>
        </TabList>
        <TabPanels
          overflow="hidden"
          bg="linear-gradient(180deg, rgba(255, 255, 255, 0) 0%, rgba(255, 255, 255, 0.09) 100%);"
        >
          <TabPanel h="100%">{embalmerPanel()}</TabPanel>
          <TabPanel h="100%">{recipientPanel()}</TabPanel>
        </TabPanels>
      </Tabs>
    </Flex>
  );
}
