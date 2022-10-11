import { Button, Flex, Heading, Text, HStack, VStack } from '@chakra-ui/react';
import { Step } from 'store/embalm/reducer';
import { useStepContent } from './hooks/useStepContent';
import { CreateEncryptionKeypair } from './steps/CreateEncryptionPair';
import { CreateSarcophagus } from './steps/CreateSarcohpagus';
import { FundBundlr } from './steps/FundBundlr';
import { NameSarcophagus } from './steps/NameSarcophagus';
import { SelectArchaeologists } from './steps/SelectArchaeologists';
import { SetDiggingFees } from './steps/SetDiggingFees';
import { SetRecipientPublicKey } from './steps/SetRecipientPublicKey';
import { TotalRequiredArchaegologists } from './steps/TotalRequiredArchaeologists';
import { UploadPayload } from './steps/UploadPayload';

interface StepContentMap {
  component: JSX.Element;
  title: string;
}

export function StepContent() {
  const { currentStep, goToPrev, goToNext } = useStepContent();

  // Manages which page to render based on the currentStep in the store
  const contentMap: { [key: number]: StepContentMap } = {
    [Step.NameSarcophagus]: { component: <NameSarcophagus />, title: 'Name your sarcophagus' },
    [Step.UploadPayload]: { component: <UploadPayload />, title: 'Upload your payload' },
    [Step.FundBundlr]: { component: <FundBundlr />, title: 'Fund Arweave Bundlr' },
    [Step.SetRecipient]: { component: <SetRecipientPublicKey />, title: '' },
    [Step.CreateEncryptionKeypair]: { component: <CreateEncryptionKeypair />, title: '' },
    [Step.SetDiggingFees]: { component: <SetDiggingFees />, title: '' },
    [Step.TotalRequiredArchaeologists]: { component: <TotalRequiredArchaegologists />, title: '' },
    [Step.SelectArchaeologists]: { component: <SelectArchaeologists />, title: '' },
    [Step.CreateSarcophagus]: { component: <CreateSarcophagus />, title: '' },
  };

  function handleClickPrev() {
    goToPrev();
  }

  function handleClickNext() {
    goToNext();
  }

  return (
    <VStack
      align="left"
      minWidth={600}
      w="100%"
      mb="200px"
    >
      {/* Form Content */}
      <Heading>{contentMap[currentStep].title}</Heading>
      <Flex pb={5}>{contentMap[currentStep].component}</Flex>
      <HStack
        justify="space-between"
        spacing={0}
      >
        <Button
          variant="link"
          width="fit-content"
          disabled={currentStep.valueOf() === 0}
          onClick={handleClickPrev}
        >
          <Text fontSize="lg">{'< Prev'}</Text>
        </Button>

        <Button
          variant="link"
          width="fit-content"
          onClick={handleClickNext}
        >
          <Text fontSize="lg">{'Next >'}</Text>
        </Button>
      </HStack>
    </VStack>
  );
}
