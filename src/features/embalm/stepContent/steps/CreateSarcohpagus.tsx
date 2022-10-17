import { Button, Flex, Heading } from '@chakra-ui/react';
import { CreateSarcophagusStep, useCreateSarcophagus } from '../hooks/useCreateSarcohpagus';
import { useApprove } from 'hooks/sarcoToken/useApprove';
import { useAllowance } from 'hooks/sarcoToken/useAllowance';
import { useSarcophagusData } from '../hooks/useSarcophagusData';
import { SarcophagusData } from '../components/SarcophagusData';

export function CreateSarcophagus() {
  const {
    currentStep,
    uploadAndSetEncryptedShards,
    handleCreate,
    payloadTxId,
    shardsTxId
  } = useCreateSarcophagus();

  const {
    sarcophagusDataMap,
    canCreateSarcophagus
  } = useSarcophagusData();

  const { approve } = useApprove();
  const { allowance } = useAllowance();

  const isCreateProcessStarted = (): boolean => {
    return currentStep !== CreateSarcophagusStep.NOT_STARTED;
  };

  return (
    <Flex
      direction='column'
      w='100%'
    >
      <Heading>Create Sarcophagus</Heading>
      {
        !isCreateProcessStarted() ?
          (
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
          ) :
          (
            <>
              WE STARTED
            </>
          )
      }
    </Flex>
  );
}
