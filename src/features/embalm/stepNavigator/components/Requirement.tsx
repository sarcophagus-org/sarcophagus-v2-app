import { CheckCircleIcon } from '@chakra-ui/icons';
import { Flex } from '@chakra-ui/react';
import React, { ReactNode } from 'react';

interface RequirementVariantCProps {
  valid: boolean;
  children: ReactNode;
}

/**
 * Requirement variant C
 * Contains a title and a value
 * Looks like this...
 *
 * 0 Archaeologists Total
 */
function Requirement({ valid, children }: RequirementVariantCProps) {
  return (
    <Flex align="top">
      <CheckCircleIcon
        w="1rem"
        h="1rem"
        color={valid ? 'brand.950' : 'disabled'}
        mt={1}
      />
      <Flex
        noOfLines={2}
        mx={3}
        color={valid ? 'brand.950' : 'disabled'}
      >
        {children}
      </Flex>
    </Flex>
  );
}

export default React.memo(Requirement);
