import { Button, Flex, Text, VStack } from '@chakra-ui/react';
import { Step } from 'store/embalm/reducer';
import { useStepContent } from './hooks/useStepContent';
import { CreateEncryptionKeypair } from './steps/CreateEncryptionPair';
import { CreateSarcophagus } from './steps/CreateSarcohpagus';
import { FundBundlr } from './steps/FundBundlr';
import { NameSarcophagus } from './steps/NameSarcophagus';
import { Resurrections } from './steps/Resurrections';
import { SelectArchaeologists } from './steps/SelectArchaeologists';
import { SetDiggingFees } from './steps/SetDiggingFees';
import { SetRecipientPublicKey } from './steps/SetRecipientPublicKey';
import { TotalRequiredArchaegologists } from './steps/TotalRequiredArchaeologists';
import { UploadPayload } from './steps/UploadPayload';

export function StepContent() {
  const { currentStep, stepCount, goToPrev, goToNext } = useStepContent();

  // Manages which page to render based on the currentStep in the store
  const contentMap: { [key: number]: JSX.Element } = {
    [Step.NameSarcophagus]: <NameSarcophagus />,
    [Step.UploadPayload]: <UploadPayload />,
    [Step.FundBundlr]: <FundBundlr />,
    [Step.SetRecipient]: <SetRecipientPublicKey />,
    [Step.CreateEncryptionKeypair]: <CreateEncryptionKeypair />,
    [Step.Resurrections]: <Resurrections />,
    [Step.SetDiggingFees]: <SetDiggingFees />,
    [Step.TotalRequiredArchaeologists]: <TotalRequiredArchaegologists />,
    [Step.SelectArchaeologists]: <SelectArchaeologists />,
    [Step.CreateSarcophagus]: <CreateSarcophagus />,
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
      minWidth={500}
      w="100%"
      mb="200px"
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
