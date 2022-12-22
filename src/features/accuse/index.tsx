import {
  Button,
  Flex,
  FormControl,
  FormLabel,
  IconButton,
  Input,
  Text,
  Textarea,
} from '@chakra-ui/react';
import { AddIcon } from 'components/icons';

export function Accuse() {
  return (
    <Flex
      w="100%"
      direction="column"
      pr={50}
    >
      <Text fontSize="2xl">Accusals</Text>
      <Text
        mt={3}
        variant="secondary"
      >
        If you found a keyshare an archaeologist has leaked, you can accuse them on this page.
        Please enter the Sarcophagus ID and the Archaeologogist keyshare as evidence.
      </Text>
      <FormControl>
        <FormLabel mt={12}>Sarcophagus ID</FormLabel>
        <Input
          placeholder="0x000..."
          mt={1}
          p={6}
        />
        <FormLabel
          mt={12}
          mb={1}
        >
          Archaeologist Private Key
        </FormLabel>
        <>
          <Flex>
            <Textarea
              placeholder="0x000..."
              h={125}
              mb={6}
              p={6}
            />
          </Flex>
          <Flex position="relative">
            <Textarea
              placeholder="0x000..."
              h={125}
              p={6}
            />
            <IconButton
              size="sm"
              position="absolute"
              right="-48px"
              variant="unstyled"
              aria-label="Add Private Key"
              icon={<AddIcon />}
            />
          </Flex>
        </>
        <Text mt={3}>
          To accuse multiple achaeologists, click the plus sign to the right of the field. You must
          accuse all together if you plan to accuse multiple.
        </Text>
        <FormLabel mt={12}>Send payment to a different wallet</FormLabel>
        <Input
          placeholder="Wallet address or ENS name"
          mt={1}
          p={6}
        />
        <Text mt={2}>Leave this blank if you want funds send to the connected wallet.</Text>
        <Button
          mt={12}
          px={6}
        >
          Accuse
        </Button>
      </FormControl>
    </Flex>
  );
}
