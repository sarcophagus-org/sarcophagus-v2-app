import { ChevronDownIcon, ChevronUpIcon } from '@chakra-ui/icons';
import { Collapse, Flex, IconButton, Text, useDisclosure, VStack } from '@chakra-ui/react';
import { ethers } from 'ethers';
import { useGetSarcophagusArchaeologists } from 'hooks/viewStateFacet';
import { Sarcophagus } from 'types';
import { ArchaeologistsDetailsCollapse } from './ArchaeologistDetailsCollapse';

interface DetailsCollapseProps {
  id?: string;
  sarcophagus: Sarcophagus;
}

export function DetailsCollapse({
  id = ethers.constants.HashZero,
  sarcophagus,
}: DetailsCollapseProps) {
  const { isOpen, onToggle } = useDisclosure();

  const archaeologists = useGetSarcophagusArchaeologists(
    sarcophagus.id,
    sarcophagus.archaeologistAddresses
  );

  const archaeologistsWithAddresses = archaeologists.map((a, i) => ({
    ...a,
    address: sarcophagus.archaeologistAddresses[i] as `0x${string}`,
  }));

  return (
    <>
      <Flex align="center">
        <Text
          cursor="pointer"
          onClick={onToggle}
        >
          Details
        </Text>
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
          <Text>Arweave File ID: {sarcophagus?.arweaveTxId}</Text>
          <Text>Embalmer Address: {sarcophagus?.embalmerAddress}</Text>
          <Text>Recipient Address: {sarcophagus?.recipientAddress}</Text>
          <Text>Minimum Archaeologists: {sarcophagus?.threshold}</Text>
          <ArchaeologistsDetailsCollapse
            sarcophagus={sarcophagus}
            archaeologists={archaeologistsWithAddresses}
          />
        </VStack>
      </Collapse>
    </>
  );
}
