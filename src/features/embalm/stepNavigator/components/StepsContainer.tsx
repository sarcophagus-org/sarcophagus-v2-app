import { Accordion } from '@chakra-ui/react';
import React from 'react';
import { useStepNavigator } from '../hooks/useStepNavigator';

export function StepsContainer({ children }: { children: React.ReactNode }) {
  const { expandedIndices } = useStepNavigator();

  return (
    <Accordion
      w="100%"
      allowMultiple
      index={expandedIndices}
    >
      {children} xxx
    </Accordion>
  );
}
