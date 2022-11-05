import { Text, Box, Flex, useColorModeValue, HStack, Checkbox, Icon } from '@chakra-ui/react';
import { InfoOutlineIcon } from '@chakra-ui/icons';

import { sumDiggingFees } from 'lib/utils/helpers';
import { useSelector } from 'store/index';

export function ArchaeologistHeader() {
  const { selectedArchaeologists } = useSelector(x => x.embalmState);

  return (
    <Box mt={6}>
      <Flex
        py={'13.5'}
        border={1}
        borderColor={useColorModeValue('gray.200', 'gray.900')}
        bgGradient="linear(180deg, rgba(255, 255, 255, 0.045) 0%, rgba(255, 255, 255, 0.09) 100%)"
        align={'center'}
        justifyContent={'space-between'}
        borderRadius={'4'}
      >
        <Flex px={3}>
          <HStack direction="row">
            <Checkbox></Checkbox>
            <HStack>
              <Text>
                Show
                <Text
                  m={1.5}
                  fontWeight={700}
                  as="u"
                >
                  {selectedArchaeologists.length}
                </Text>
                selected arches.
              </Text>
            </HStack>
          </HStack>
        </Flex>

        <HStack mr={2}>
          <Icon as={InfoOutlineIcon}></Icon>
          <Text>
            Total Fee:
            <Text
              ml={1.5}
              fontWeight={700}
              as="u"
            >
              {sumDiggingFees(selectedArchaeologists).toString()} SARCO
            </Text>
          </Text>
          <Text
            variant="secondary"
            text-align={'bottom'}
            as="i"
            fontSize={'10'}
          >
            +1% protocol fee
          </Text>
        </HStack>
      </Flex>
    </Box>
  );
}
