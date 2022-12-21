import { VStack, Heading, Text, Flex, HStack, Icon, Tooltip } from '@chakra-ui/react';
import { SetResurrection } from '../components/SetResurrection';
import { SarcophagusName } from '../components/SarcophagusName';
import { InfoOutlineIcon } from '@chakra-ui/icons';
import { PageBlockModal } from '../components/PageBlockModal';

export function NameSarcophagus() {
  return (
    <VStack
      spacing={6}
      align="left"
      w="100%"
    >
      <SarcophagusName />
      <Flex
        pt={6}
        direction="column"
      >
        <HStack>
          <Heading size="sm">Resurrection</Heading>
          <Tooltip
            label="This is the time you must rewrap your sarcophagus by. If you fail to rewrap by this date, your sarcophagus will be unwrapped and available to the recipient."
            placement="top"
          >
            <Icon as={InfoOutlineIcon} />
          </Tooltip>
        </HStack>

        <Text
          variant="secondary"
          mt={4}
        >
          When do you want your Sarcophagus resurrected?
        </Text>
      </Flex>
      <SetResurrection />
      <PageBlockModal />
    </VStack>
  );
}
