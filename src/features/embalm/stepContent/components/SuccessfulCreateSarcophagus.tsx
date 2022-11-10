import { Button, Flex, Heading, Text } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from '../../../../store';
import { goToStep } from '../../../../store/embalm/actions';
import { Step } from '../../../../store/embalm/reducer';
import { SuccessData } from '../hooks/useCreateSarcophagus/useClearSarcophagusState';

export function SuccessfulCreateSarcophagus({
  successEncryptedShardsTxId,
  successSarcophagusPayloadTxId,
  successSarcophagusTxId,
}: SuccessData) {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const goToDashboard = () => {
    dispatch(goToStep(Step.NameSarcophagus));
    navigate('/dashboard');
  };

  return (
    <Flex
      mt={6}
      direction="column"
      justifyContent="center"
      alignItems="center"
    >
      <Heading
        fontSize="xl"
        mb={4}
      >
        Sarcophagus Creation Successful!
      </Heading>
      <Heading
        fontSize="md"
        my={4}
      >
        Transaction Details
      </Heading>
      <Flex
        justifyContent="space-between"
        wrap="wrap"
      >
        <Text
          width="40%"
          fontSize="sm"
          mt={4}
        >
          Sarcophagus TX
        </Text>
        <Text
          width="60%"
          fontSize="sm"
          textAlign="right"
          mt={4}
        >
          {successSarcophagusTxId}
        </Text>
        <Text
          width="40%"
          fontSize="sm"
          mt={4}
        >
          Arweave File TX
        </Text>
        <Text
          width="60%"
          fontSize="sm"
          textAlign="right"
          mt={4}
        >
          {successSarcophagusPayloadTxId}
        </Text>
        <Text
          width="40%"
          fontSize="sm"
          mt={4}
        >
          Arweave Archaeologist TX
        </Text>
        <Text
          width="60%"
          fontSize="sm"
          textAlign="right"
          mt={4}
        >
          {successEncryptedShardsTxId}
        </Text>
      </Flex>
      <Button
        onClick={goToDashboard}
        mt={6}
      >
        Go to Dashboard
      </Button>
    </Flex>
  );
}
