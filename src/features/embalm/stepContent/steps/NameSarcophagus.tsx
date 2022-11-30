import { VStack, Heading, Text, Flex, HStack, Icon, Tooltip } from '@chakra-ui/react';
import { SetResurrection } from '../components/SetResurrection';
import { SarcophagusName } from '../components/SarcophagusName';
import { InfoOutlineIcon } from '@chakra-ui/icons';

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
            label="Your Sarcophagus cannot be claimed until after this date.
            This is also the rewrap interval, and is the duration your Sarchophagus will be extended by whenever you rewrap it."
            placement="top"
          >
            <Icon as={InfoOutlineIcon} />
          </Tooltip>
        </HStack>

        <Text
          variant="secondary"
          mt={4}
        >
          When do you want your Sarcophagus resurrected? You can change this later.
        </Text>
      </Flex>
      <SetResurrection />
    </VStack>
  );
}
