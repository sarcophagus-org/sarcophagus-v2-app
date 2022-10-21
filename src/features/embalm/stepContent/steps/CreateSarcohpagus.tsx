import { Button, Flex, Heading } from '@chakra-ui/react';
import { ProgressTracker } from '../components/ProgressTracker';
import { ProgressTrackerStage } from '../components/ProgressTrackerStage';
import { SarcophagusData } from '../components/SarcophagusData';
import { CreateSarcophagusStage, useCreateSarcophagus } from '../hooks/useCreateSarcophagus';
import { useSarcophagusData } from '../hooks/useSarcophagusData';

export function CreateSarcophagus() {
  const { currentStage, handleCreate } = useCreateSarcophagus();

  const { canCreateSarcophagus } = useSarcophagusData();

  const isCreateProcessStarted = (): boolean => {
    return currentStage !== CreateSarcophagusStage.NOT_STARTED;
  };

  return (
    <Flex
      direction="column"
      w="100%"
    >
      <Heading mb={6}>Create Sarcophagus</Heading>
      {!isCreateProcessStarted() ? (
        <>
          <SarcophagusData />
          <Button
            mt={6}
            onClick={handleCreate}
            disabled={!canCreateSarcophagus()}
          >
            Create Sarcophagus
          </Button>
        </>
      ) : (
        <ProgressTracker
          title="Creating Sarcophagus"
          currentStage={currentStage}
        >
          <ProgressTrackerStage>Connect to Archaeologists</ProgressTrackerStage>
          <ProgressTrackerStage>Upload Archaeologist Data to Arweave</ProgressTrackerStage>
          <ProgressTrackerStage>Retrieve Archaeologist Signatures</ProgressTrackerStage>
          <ProgressTrackerStage>Upload File Data to Arweave</ProgressTrackerStage>
          <ProgressTrackerStage>Create Sarcophagus</ProgressTrackerStage>
        </ProgressTracker>
      )}
    </Flex>
  );
}
