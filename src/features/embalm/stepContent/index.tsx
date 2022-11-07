import { Button, Flex, Heading, HStack, Text, VStack } from '@chakra-ui/react';
import { useSelector } from 'store/index';
import { Step } from 'store/embalm/reducer';
import { useStepContent } from './hooks/useStepContent';
import { FundBundlr } from './steps/FundBundlr';
import { NameSarcophagus } from './steps/NameSarcophagus';
import { SelectArchaeologists } from './steps/SelectArchaeologists';
import { SetRecipientPublicKey } from './steps/SetRecipientPublicKey';
import { TotalRequiredArchaegologists } from './steps/TotalRequiredArchaeologists';
import { UploadPayload } from './steps/UploadPayload';
import { CreateSarcophagus } from './steps/CreateSarcophagus';
import { CreateSarcophagusContextProvider } from './context/CreateSarcophagusContext';

interface StepContentMap {
  component: JSX.Element;
  title: string;
}

export function StepContent() {
  const { currentStep, goToPrev, goToNext } = useStepContent();
  const areStepsDisabled = useSelector(x => x.embalmState.areStepsDisabled);

  // Manages which page to render based on the currentStep in the store
  const contentMap: { [key: number]: StepContentMap } = {
    [Step.NameSarcophagus]: { component: <NameSarcophagus />, title: 'Name your sarcophagus' },
    [Step.UploadPayload]: { component: <UploadPayload />, title: 'Upload your payload' },
    [Step.FundBundlr]: { component: <FundBundlr />, title: 'Fund Arweave Bundlr' },
    [Step.SetRecipient]: { component: <SetRecipientPublicKey />, title: 'Set Recipient' },
    [Step.SelectArchaeologists]: { component: <SelectArchaeologists />, title: '' },
    [Step.RequiredArchaeologists]: { component: <TotalRequiredArchaegologists />, title: '' },
    [Step.CreateSarcophagus]: {
      component: (
        <CreateSarcophagusContextProvider>
          <CreateSarcophagus />
        </CreateSarcophagusContextProvider>
      ),
      title: ''
    },
  };

  function handleClickPrev() {
    if (areStepsDisabled) return;
    goToPrev();
  }

  function handleClickNext() {
    if (areStepsDisabled) return;
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
        {currentStep.valueOf() > 0 ? (
          <Button
            variant="link"
            width="fit-content"
            disabled={currentStep.valueOf() === 0}
            onClick={handleClickPrev}
          >
            <Text fontSize="lg">{'< Prev'}</Text>
          </Button>
        ) : (
          // This is here to keep the space filled with something
          <Flex />
        )}

        {currentStep.valueOf() < Object.keys(contentMap).length - 1 && (
          <Button
            variant="link"
            width="fit-content"
            onClick={handleClickNext}
          >
            <Text fontSize="lg">{'Next >'}</Text>
          </Button>
        )}
      </HStack>
    </VStack>
  );
}
