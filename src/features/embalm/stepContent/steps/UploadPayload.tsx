import { Button, Flex, Heading, Text, VStack } from '@chakra-ui/react';
import { updateStepStatus } from 'store/embalm/actions';
import { StepName, StepStatus } from 'store/embalm/reducer';
import { useDispatch } from 'store/index';

export function UploadPayload() {
  const dispatch = useDispatch();

  function handleComplete() {
    dispatch(updateStepStatus(StepName.UploadPayload, StepStatus.Complete));
  }

  function handleStart() {
    dispatch(updateStepStatus(StepName.UploadPayload, StepStatus.Started));
  }

  return (
    <VStack
      spacing={9}
      align="left"
    >
      <Heading>Upload payload</Heading>
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
