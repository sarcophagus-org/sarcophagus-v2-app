import { VStack, Heading, Text, Flex } from '@chakra-ui/react';
import { SetResurrection } from '../components/SetResurrection';
import { SarcophagusName } from '../components/SarcophagusName';

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
        <Heading size="sm">Resurrection</Heading>
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
