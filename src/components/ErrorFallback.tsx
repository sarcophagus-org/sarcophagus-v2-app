import { Center } from '@chakra-ui/react';
import { SarcoAlert } from 'components/SarcoAlert';

export function ErrorFallback({ error }: { error: Error }) {
  return (
    <Center
      flexDirection="column"
      height="100vh"
    >
      <SarcoAlert title="There was an error." status='error'>{error.message}</SarcoAlert>
    </Center>
  );
}
