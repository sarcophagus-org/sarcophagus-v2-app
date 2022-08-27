import { Button, Flex, Heading, Text, VStack } from '@chakra-ui/react';
import { updateStepStatus } from 'store/embalm/actions';
import { StepName, StepStatus } from 'store/embalm/reducer';
import { useDispatch } from 'store/index';

export function SetArchaeologistBounties() {
  const dispatch = useDispatch();

  function handleComplete() {
    dispatch(updateStepStatus(StepName.SetArchaeologistBounties, StepStatus.Complete));
  }

  function handleStart() {
    dispatch(updateStepStatus(StepName.SetArchaeologistBounties, StepStatus.Started));
  }

  return (
    <VStack
      spacing={9}
      align="left"
    >
      <Heading>Set archaeologist bounties</Heading>
      <VStack
        align="left"
        spacing={6}
      >
        <Flex direction="column">
          <Button onClick={handleStart}>Start</Button>
          <Text variant="secondary">Simulate a form that has been started but not completed</Text>
        </Flex>
        <Flex direction="column">
          <Button onClick={handleComplete}>Complete</Button>
          <Text variant="secondary">Simulate a complete form</Text>
        </Flex>
      </VStack>
    </VStack>
  );
}
