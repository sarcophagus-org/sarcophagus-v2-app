import { Center, VStack, Text } from '@chakra-ui/react';
import { RecipientPublicKey } from 'features/recipients/components/RecipientPublicKey';

export function RecipientsPage() {
  return (
    <Center mt={12}>
      <VStack>
        <RecipientPublicKey />
        <Text
          pt={16}
          variant="secondary"
          size="xs"
        >
          If you are looking to claim your sarcophagus, please visit the Tomb page and click the
          Claim Sarcophagi tab.
        </Text>
      </VStack>
    </Center>
  );
}
