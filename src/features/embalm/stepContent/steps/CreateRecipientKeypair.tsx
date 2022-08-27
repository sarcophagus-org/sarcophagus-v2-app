import { Button, Flex, Heading, Text, VStack } from '@chakra-ui/react';
import { StepMap } from 'features/embalm/stepNavigator/steps';
import { updateStepStatus } from 'store/embalm/actions';
import { StepStatus } from 'store/embalm/reducer';
import { useDispatch } from 'store/index';

export function CreateRecipientKeypair() {
  const dispatch = useDispatch();

  function handleComplete() {
    dispatch(updateStepStatus(StepMap.CreateRecientyPair.id, StepStatus.Complete));
  }

  function handleStart() {
    dispatch(updateStepStatus(StepMap.CreateRecipientKeypair.id, StepStatus.Started));
  }

  return (
    <VStack
      spacing={9}
      align="left"
    >
      <Heading>Create recipient keypair</Heading>
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
