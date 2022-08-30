import { CheckCircleIcon } from '@chakra-ui/icons';
import { Flex, Text } from '@chakra-ui/react';
import React from 'react';

interface RequirementVariantBProps {
  title: string;
  filled: boolean;
}

/**
 * Requirement variant B
 * Contains just a title
 */
function RequirementVariantB({ title, filled }: RequirementVariantBProps) {
  return (
    <Flex align="top">
      <CheckCircleIcon
        w="1rem"
        h="1rem"
        color={filled ? 'brand.950' : 'brand.400'}
        mt={1}
      />
      <Text
        noOfLines={1}
        mx={3}
        color={filled ? 'brand.950' : 'brand.400'}
      >
        {title}
      </Text>
    </Flex>
  );
}

export default React.memo(RequirementVariantB);
