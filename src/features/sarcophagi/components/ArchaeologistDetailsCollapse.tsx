import { ChevronDownIcon, ChevronUpIcon } from '@chakra-ui/icons';
import { Collapse, Flex, IconButton, Text, useDisclosure, VStack } from '@chakra-ui/react';
import { useGraphQl } from 'hooks/useSubgraph';
import { useState } from 'react';
import { Sarcophagus, SarcophagusArchaeologist } from 'types';
import { ArchaeologistDetailItem } from './ArchaeologistDetailsItem';

interface ArchaeologistsDetailsCollapseProps {
  sarcophagus: Sarcophagus;
  archaeologists: (SarcophagusArchaeologist & { address: `0x${string}` })[];
}

export function ArchaeologistsDetailsCollapse({
  archaeologists,
  sarcophagus,
}: ArchaeologistsDetailsCollapseProps) {
  const { isOpen, onToggle } = useDisclosure();
  const { getSarcophagusRewraps } = useGraphQl();
  const [sarcoHasRewraps, setHasRewraps] = useState<boolean>();

  if (sarcoHasRewraps === undefined)
    getSarcophagusRewraps(sarcophagus.id).then((rewraps) => {
      setHasRewraps(rewraps.length > 0);
    });

  return (
    <>
      <Flex align="center">
        <Text
          cursor="pointer"
          _hover={{ textDecoration: 'underline' }}
          onClick={onToggle}
        >
          <Text>Archaeologists ({archaeologists.length})</Text>
        </Text>
        <IconButton
          aria-label="Expand details"
          bg="none"
          color="brand.950"
          size="xs"
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
          align="left"
          pl={4}
          mt={3}
          spacing={5}
        >
          {archaeologists.map(arch => (
            <ArchaeologistDetailItem
              key={arch.address}
              archaeologist={arch}
              sarcoHasRewraps={!!sarcoHasRewraps}
              isResurrected={sarcophagus.publishedPrivateKeyCount >= sarcophagus.threshold}
            />
          ))}
        </VStack>
      </Collapse>
    </>
  );
}
