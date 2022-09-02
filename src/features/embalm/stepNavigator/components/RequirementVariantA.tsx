import { CheckCircleIcon } from '@chakra-ui/icons';
import { Flex, Text } from '@chakra-ui/react';
import React from 'react';

interface RequirementVariantAProps {
  title: string;
  value: string;
  valid: boolean;
}

/**
 * Requirement variant A
 * Contains a title and a value
 * Looks like this...
 *
 * Sarcophagus Name: Corporate Blackmail
 */
function RequirementVariantA({ title, value, valid }: RequirementVariantAProps) {
  return (
    <Flex align="top">
      <CheckCircleIcon
        w="1rem"
        h="1rem"
        color={valid ? 'brand.950' : 'brand.400'}
        mt={1}
      />
      <Flex
        ml={3}
        flexWrap="wrap"
      >
        <Text
          noOfLines={1}
          mr={3}
          color={valid ? 'brand.950' : 'brand.400'}
        >
          {title}:
        </Text>
        <Text
          color="brand.500"
          maxWidth={200}
          noOfLines={1}
          textOverflow="ellipsis"
        >
          {value}
        </Text>
      </Flex>
    </Flex>
  );
}

export default React.memo(RequirementVariantA);
