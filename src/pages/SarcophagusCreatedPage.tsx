import { Center } from '@chakra-ui/react';
import { SuccessfulCreateSarcophagus } from 'features/embalm/stepContent/components/SuccessfulCreateSarcophagus';
import { useLocation } from 'react-router-dom';
import { NotFoundPage } from './NotFoundPage';

interface LocationState {
  successEncryptedShardsTxId: string;
  successSarcophagusPayloadTxId: string;
  successSarcophagusTxId: string;
}

export function SarcophagusCreatedPage() {
  const location = useLocation();
  const state = location.state as LocationState;

  if (!state) {
    return <NotFoundPage />;
  }

  return (
    <Center mt={12}>
      <SuccessfulCreateSarcophagus {...state} />
    </Center>
  );
}
