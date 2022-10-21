import { Button, Flex, Heading, Text, VStack } from '@chakra-ui/react';
import { CreateSarcophagusStage, useCreateSarcophagus } from '../hooks/useCreateSarcophagus';
import { useSarcophagusData } from '../hooks/useSarcophagusData';
import { SarcophagusData } from '../components/SarcophagusData';

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
      <Heading>Create Sarcophagus</Heading>
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
        <VStack
          mt={8}
          mb={6}
          justify="space-between"
          align="left"
        >
          <Text
            color={
              currentStage === CreateSarcophagusStage.DIAL_ARCHAEOLOGISTS
                ? 'brand.950'
                : 'brand.400'
            }
            align="left"
          >
            1. Dialing Archaeologists
          </Text>
          <Text
            color={
              currentStage === CreateSarcophagusStage.UPLOAD_ENCRYPTED_SHARDS
                ? 'brand.950'
                : 'brand.400'
            }
            align="left"
          >
            2. Uploading Encrypted Shards to Arweave
          </Text>
          <Text
            color={
              currentStage === CreateSarcophagusStage.ARCHAEOLOGIST_NEGOTIATION
                ? 'brand.950'
                : 'brand.400'
            }
            align="left"
          >
            3. Getting Archaeologist Signatures
          </Text>
          <Text
            color={
              currentStage === CreateSarcophagusStage.UPLOAD_PAYLOAD ? 'brand.950' : 'brand.400'
            }
            align="left"
          >
            4. Uploading Payload to Arweave
          </Text>
          <Text
            color={
              currentStage === CreateSarcophagusStage.SUBMIT_SARCOPHAGUS ? 'brand.950' : 'brand.400'
            }
            align="left"
          >
            5. Finalizing Sarcophagus
          </Text>
          <Text
            color={currentStage === CreateSarcophagusStage.COMPLETED ? 'brand.950' : 'brand.400'}
            align="left"
          >
            6. Sarcophagus successfully completed!
          </Text>
        </VStack>
      )}
    </Flex>
  );
}
