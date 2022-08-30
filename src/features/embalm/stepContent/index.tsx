import { Button, Flex, Text, VStack } from '@chakra-ui/react';
import { Step } from 'store/embalm/reducer';
import { CreateRecipientKeypair } from './steps/CreateRecipientKeypair';
import { FinalizeSarcophagus } from './steps/FinalizeSarcophagus';
import { InitializeSarcophagus } from './steps/InitializeSarcophagus';
import { NameSarcophagus } from './steps/NameSarcophagus';
import { SelectArchaeologists } from './steps/SelectArchaeologists';
import { SetResurrectionDate } from './steps/SetResurrectionDate';
import { UploadPayload } from './steps/UploadPayload';
import { useStepContent } from './hooks/useStepContent';

export function StepContent() {
  const { currentStep, stepCount, goToPrev, goToNext } = useStepContent();

  // Manages which page to render based on the currentStep in the store
  const contentMap: { [key: number]: JSX.Element } = {
    [Step.NameSarcophagus]: <NameSarcophagus />,
    [Step.UploadPayload]: <UploadPayload />,
    [Step.CreateRecipientKeypair]: <CreateRecipientKeypair />,
    [Step.SetResurrection]: <SetResurrectionDate />,
    [Step.SelectArchaeologists]: <SelectArchaeologists />,
    [Step.InitializeSarophagus]: <InitializeSarcophagus />,
    [Step.FinalizeSarcophagus]: <FinalizeSarcophagus />,
  };

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
      w="50%"
      minWidth={500}
    >
      <Button
        variant="link"
        width="fit-content"
        disabled={currentStep.valueOf() === 0}
        onClick={handleClickPrev}
      >
        <Text fontSize="lg">{'< Prev'}</Text>
      </Button>
      <Text fontSize="lg">
        Step {currentStep.valueOf() + 1}/{stepCount}
      </Text>

      {/* Form Content */}
      <Flex py={8}>{contentMap[currentStep]}</Flex>

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
