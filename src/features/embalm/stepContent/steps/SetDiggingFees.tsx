import {
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Image,
  NumberInput,
  NumberInputField,
  Text,
} from '@chakra-ui/react';

export function SetDiggingFees() {
  return (
    <Flex>
      <Heading
        size="sm"
        mt={9}
      >
        How much are you willing to pay each time your rewrap?
      </Heading>
      <FormControl mt={6}>
        <FormLabel>Rewrap digging fees *</FormLabel>
        <Flex align="center">
          <NumberInput w="125px">
            <NumberInputField
              pl={12}
              pr={1}
              borderColor="violet.700"
            />
          </NumberInput>
          <Image
            src="sarco-token-icon.png"
            position="absolute"
            top="39px"
            left="16px"
          />
          <Flex align="center">
            <Text ml={6}>Total digging fees </Text>
            <Text>300 </Text>
            <Text>every 3 months</Text>
          </Flex>
        </Flex>
      </FormControl>
    </Flex>
  );
}
