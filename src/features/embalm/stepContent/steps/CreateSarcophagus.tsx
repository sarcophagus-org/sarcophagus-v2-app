import { Button, Flex, Heading, Text } from '@chakra-ui/react';
import { ProgressTracker } from '../components/ProgressTracker';
import { ProgressTrackerStage } from '../components/ProgressTrackerStage';
import { CreateSarcophagusStage, useCreateSarcophagus } from '../hooks/useCreateSarcophagus';
import { useSarcophagusParameters } from '../hooks/useSarcophagusParameters';
import { ReviewSarcophagus } from '../components/ReviewSarcophagus';
import { SummaryErrorIcon } from '../components/SummaryErrorIcon';
import { useAllowance } from '../../../../hooks/sarcoToken/useAllowance';
import { BigNumber, ethers } from 'ethers';
import { useEffect, useState } from 'react';

export function CreateSarcophagus() {
  // SARCO approval
  const { allowance, isLoading } = useAllowance();

  const [createSarcophagusStages, setCreateSarcophagusStages] = useState<Record<number, string>>({
    [CreateSarcophagusStage.NOT_STARTED]: '',
    [CreateSarcophagusStage.DIAL_ARCHAEOLOGISTS]: 'Connect to Archaeologists',
    [CreateSarcophagusStage.UPLOAD_ENCRYPTED_SHARDS]: 'Upload Archaeologist Data to Arweave',
    [CreateSarcophagusStage.ARCHAEOLOGIST_NEGOTIATION]: 'Retrieve Archaeologist Signatures',
    [CreateSarcophagusStage.UPLOAD_PAYLOAD]: 'Upload File Data to Arweave',
    [CreateSarcophagusStage.APPROVE]: 'Approve',
    [CreateSarcophagusStage.SUBMIT_SARCOPHAGUS]: 'Create Sarcophagus',
    [CreateSarcophagusStage.COMPLETED]: ''
  });


  const { currentStage, handleCreate, stageError } = useCreateSarcophagus(
    createSarcophagusStages
  );

  const { isSarcophagusComplete } = useSarcophagusParameters();

  const isCreateProcessStarted = (): boolean => {
    return currentStage !== CreateSarcophagusStage.NOT_STARTED;
  };

  useEffect(() => {
    if (!isLoading) {
      // remove approval step if approval is complete
      // TODO: compare with pending fees instead
      if (BigNumber.from(allowance).gte(ethers.constants.MaxUint256.sub(ethers.utils.parseEther('1000')))) {
        const stepsCopy = { ...createSarcophagusStages };
        delete stepsCopy[CreateSarcophagusStage.APPROVE];
        setCreateSarcophagusStages(
          stepsCopy
        );
      }
    }
  }, [isLoading]);

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
              .filter(text => !!text)
              .map(stage =>
                <ProgressTrackerStage key={stage}>{stage}</ProgressTrackerStage>
              )}
          </ProgressTracker>
          {stageError ? <Flex
            mt={3}
            alignItems='center'
          >
            <SummaryErrorIcon error={stageError} />
            <Text
              ml={2}
              color='brand.500'
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
