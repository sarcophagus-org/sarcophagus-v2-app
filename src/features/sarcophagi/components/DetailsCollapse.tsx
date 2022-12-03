import { ChevronDownIcon, ChevronUpIcon } from '@chakra-ui/icons';
import { Collapse, Flex, IconButton, Text, useDisclosure, VStack } from '@chakra-ui/react';
import { ethers } from 'ethers';
import { Sarcophagus } from 'types';

interface DetailsCollapseProps {
  id?: string;
  sarcophagus: Sarcophagus;
}

export function DetailsCollapse({
  id = ethers.constants.HashZero,
  sarcophagus,
}: DetailsCollapseProps) {
  const { isOpen, onToggle } = useDisclosure();

  return (
    <>
      <Flex align="center">
        <Text>Sarco Details</Text>
        <IconButton
          aria-label="Expand details"
          bg="none"
          color="brand.950"
          size="sm"
          _hover={{
            bg: 'none',
          }}
          _active={{
            bg: 'none',
          }}
          icon={isOpen ? <ChevronUpIcon /> : <ChevronDownIcon />}
          onClick={onToggle}
        />
      </Flex>
      <Collapse in={isOpen}>
        <VStack
          mt={6}
          mb={6}
          p={6}
          bg="brand.100"
          align="left"
          spacing={2}
        >
          <Text>ID: {id}</Text>
          <Text>Arweave File ID: {sarcophagus?.arweaveTxIds[0]}</Text>
          <Text>Embalmer Address: {sarcophagus?.embalmerAddress}</Text>
          <Text>Recipient Address: {sarcophagus?.recipientAddress}</Text>
          <Text>Minimum Archaeologists: {sarcophagus?.threshold}</Text>
          <Text>Total Archaeologists: {sarcophagus?.archaeologistAddresses?.length}</Text>
        </VStack>
      </Collapse>
    </>
  );
}
