import { Button, Flex, Heading, Text } from '@chakra-ui/react';
import { ProgressTracker } from '../components/ProgressTracker';
import { ProgressTrackerStage } from '../components/ProgressTrackerStage';
import { CreateSarcophagusStage, useCreateSarcophagus } from '../hooks/useCreateSarcophagus';
import { useSarcophagusParameters } from '../hooks/useSarcophagusParameters';
import { ReviewSarcophagus } from '../components/ReviewSarcophagus';
import { SummaryErrorIcon } from '../components/SummaryErrorIcon';

export function CreateSarcophagus() {
  const { currentStage, handleCreate, stageError, createSarcophagusStages, hasApproved } = useCreateSarcophagus();
  const { isSarcophagusComplete } = useSarcophagusParameters();

  const isCreateProcessStarted = (): boolean => {
    return currentStage !== CreateSarcophagusStage.NOT_STARTED;
  };

  return (
    <Flex
      direction='column'
      w='100%'
    >
      <Heading mb={6}>Create Sarcophagus</Heading>
      {!isCreateProcessStarted() ? (
        <>
          <ReviewSarcophagus />
          <Flex justifyContent='center'>
            <Button
              w={250}
              p={6}
              mt={9}
              onClick={handleCreate}
              disabled={!isSarcophagusComplete()}
            >
              Create Sarcophagus
            </Button>
          </Flex>
        </>
      ) : (
        <>
          <ProgressTracker
            title='Creating Sarcophagus'
            currentStage={currentStage}
            stageError={stageError}
          >
            {Object.values(createSarcophagusStages)
              // Necessarily, a couple of these mappings don't have UI importance, thus no titles.
              // We exclude those, and, if already approved, also exclude the approve stage
              .filter(text => !!text && (hasApproved ? text !== createSarcophagusStages[CreateSarcophagusStage.APPROVE] : true))
              .map(stage =>
                <ProgressTrackerStage key={stage}>{stage}</ProgressTrackerStage>
              )}
          </ProgressTracker>
          {stageError ? <Flex
            mt={3}
            alignItems="center"
          >
            <SummaryErrorIcon />
            <Text
              ml={2}
              color="brand.500"
            >
              = {stageError}
            </Text>
          </Flex> : ''}
          {(currentStage === CreateSarcophagusStage.COMPLETED) ? (
            <Flex
              mt={6}
              direction='column'
            >
              <Text>Sarcophagus creation successful!</Text>
              <Text mt={2}>Redirecting you to the embalmer dashboard....</Text>
            </Flex>
          ) : (<></>)}
        </>
      )}
    </Flex>
  );
}
