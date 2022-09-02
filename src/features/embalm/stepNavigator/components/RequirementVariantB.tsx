import { CheckCircleIcon } from '@chakra-ui/icons';
import { Flex, Text } from '@chakra-ui/react';
import React from 'react';

interface RequirementVariantBProps {
  title: string;
  valid: boolean;
}

/**
 * Requirement variant B
 * Contains just a title
 */
function RequirementVariantB({ title, valid }: RequirementVariantBProps) {
  return (
    <Flex align="top">
      <CheckCircleIcon
        w="1rem"
        h="1rem"
        color={valid ? 'brand.950' : 'brand.400'}
        mt={1}
      />
      <Text
        noOfLines={1}
        mx={3}
        color={valid ? 'brand.950' : 'brand.400'}
      >
        {title}
      </Text>
    </Flex>
  );
}

export default React.memo(RequirementVariantB);
