import { Center } from '@chakra-ui/react';
import { SuccessfulCreateSarcophagus } from 'features/embalm/stepContent/components/SuccessfulCreateSarcophagus';
import { SuccessData } from 'features/embalm/stepContent/hooks/useCreateSarcophagus/useClearSarcophagusState';
import { useLocation } from 'react-router-dom';
import { NotFoundPage } from './NotFoundPage';

export function SarcophagusCreatedPage() {
  const location = useLocation();
  const state = location.state as SuccessData;

  if (!state) {
    return <NotFoundPage />;
  }

  return (
    <Center mt={12}>
      <SuccessfulCreateSarcophagus {...state} />
    </Center>
  );
}
