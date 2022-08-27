import { VStack } from '@chakra-ui/react';
import { StepElement } from './stepElement';
import { steps } from './steps';
import { useStepNavigator } from './useStepNavigator';

/**
 * The embalm step navigator.
 * Uses the state in the store to keep track of the current step.
 * Does not use routes to track the current step.
 */
export function StepNavigator() {
  const { selectStep, calculateStatusOfCurrentStep } = useStepNavigator();

  function handleClickStep(id: string) {
    // Set the current step in the store
    selectStep(id);
  }

  return (
    <VStack
      spacing={9}
      align="left"
      pr={6}
    >
      {steps.map(step => (
        <StepElement
          key={step.id}
          title={step.title}
          index={step.index}
          status={calculateStatusOfCurrentStep(step.id)}
          onClickStep={() => handleClickStep(step.id)}
        />
      ))}
    </VStack>
  );
}
