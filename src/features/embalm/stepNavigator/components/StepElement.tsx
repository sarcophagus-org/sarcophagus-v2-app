import {
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Center,
  Flex,
  Text,
} from '@chakra-ui/react';
import React, { ReactNode } from 'react';
import { Step, StepStatus } from 'store/embalm/reducer';
import { useStepNavigator } from '../hooks/useStepNavigator';
import { StepStatusIndicator } from './StepStatusIndicator';

interface StepProps {
  title: string;
  step: Step;
  children: ReactNode;
}

export function StepElement({ title, step, children }: StepProps) {
  const { getStatus, selectStep, toggleStep } = useStepNavigator();
  const status = getStatus(step);

  function handleSelect() {
    selectStep(step);
  }

  function handleClickExpand(e: React.MouseEvent<HTMLDivElement>) {
    // Prevent the selection of the step
    e.stopPropagation();
    toggleStep(step);
  }

  return (
    <AccordionItem
      opacity={status === StepStatus.NotStarted ? 0.5 : 1}
      border="none"
      mb={3}
    >
      <AccordionButton
        px={0}
        justifyContent="space-between"
        cursor="default"
      >
        <Flex
          onClick={handleSelect}
          cursor="pointer"
          _hover={{
            textDecoration: 'underline',
          }}
        >
          <StepStatusIndicator
            status={status}
            index={step}
          />
          <Text
            align="left"
            ml={3}
          >
            {title}
          </Text>
        </Flex>
        <Center
          h="24px"
          w="24px"
          borderRadius={100}
          onClick={handleClickExpand}
          cursor="pointer"
          _hover={{
            backgroundColor: 'brand.100',
          }}
        >
          <AccordionIcon color="brand.300" />
        </Center>
      </AccordionButton>
      <AccordionPanel mx={5}>{children}</AccordionPanel>
    </AccordionItem>
  );
}