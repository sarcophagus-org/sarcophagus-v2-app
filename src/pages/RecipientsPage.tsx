import { Center } from '@chakra-ui/react';
import { RecipientPublicKey } from 'features/recipients/components/RecipientPublicKey';

export function RecipientsPage() {
  return (
    <Center mt={12}>
      <RecipientPublicKey />
    </Center>
  );
}
