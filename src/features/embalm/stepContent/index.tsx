import { Button, Flex, Text, VStack } from '@chakra-ui/react';
import { StepMap, steps } from '../stepNavigator/steps';
import { useStepNavigator } from '../stepNavigator/useStepNavigator';
import { useStepContent } from './useStepContent';

export function StepContent() {
  const { currentStep, goToPrev, goToNext } = useStepContent();
  const stepCount = steps.length;

  function handleClickPrev() {
    goToPrev();
  }

  function handleClickNext() {
    goToNext();
  }

  return (
    <VStack
      direction="column"
      align="left"
      spacing={4}
    >
      <Button
        variant="link"
        width="fit-content"
        disabled={currentStep.index === 0}
        onClick={handleClickPrev}
      >
        <Text fontSize="lg">{'< Prev'}</Text>
      </Button>
      <Text fontSize="lg">
        Step {currentStep.index + 1}/{stepCount}
      </Text>

      {/* Form Content */}
      <Flex py={8}>{currentStep && currentStep.component()}</Flex>

      <Flex justify="flex-end">
        <Button
          variant="link"
          width="fit-content"
          onClick={handleClickNext}
        >
          <Text fontSize="lg">{'Next >'}</Text>
        </Button>
      </Flex>
    </VStack>
  );
}
