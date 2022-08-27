import { Button, Text, VStack } from '@chakra-ui/react';
import { useSelector } from 'store/index';
import { Step, steps } from '../stepNavigator/steps';

function getStep(id: string): Step | undefined {
  return steps.find(x => x.id === id);
}

export function StepContent() {
  const currentStepId = useSelector(x => x.embalmState.currentStepId);
  const step = getStep(currentStepId);

  function handleClickPrev() {
    //
  }

  function handleClickNext() {
    //
  }

  return (
    <VStack
      direction="column"
      mx={12}
    >
      <Button
        variant="link"
        onClick={handleClickPrev}
      >
        {'< Prev'}
      </Button>
      <Text>Step 2/X</Text>
      {step && step.component()}
    </VStack>
  );
}
