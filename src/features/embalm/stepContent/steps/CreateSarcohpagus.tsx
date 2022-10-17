import { Text, Button, Flex, Heading } from '@chakra-ui/react';
import { Alert } from 'components/Alert';
import { useCreateSarcophagus } from '../hooks/useCreateSarcohpagus';
import { useApprove } from 'hooks/sarcoToken/useApprove';
import { useAllowance } from 'hooks/sarcoToken/useAllowance';
import { useSarcophagusData } from '../hooks/useSarcophagusData';
import { SarcophagusData } from '../components/SarcophagusData';

export function CreateSarcophagus() {
  const {
    uploadAndSetEncryptedShards,
    handleCreate,
    isUploading,
    payloadTxId,
    shardsTxId,
  } = useCreateSarcophagus();

  const {
    sarcophagusDataMap,
    canCreateSarcophagus
  } = useSarcophagusData();

  const { approve } = useApprove();
  const { allowance } = useAllowance();

  return (
    <Flex
      direction="column"
      w="100%"
    >
      <Heading>Create Sarcophagus</Heading>
      <SarcophagusData />
      <Button
        mt={6}
        onClick={handleCreate}
        disabled={!canCreateSarcophagus()}
      >
        Create Sarcophagus
      </Button>
    </Flex>
  );
}
