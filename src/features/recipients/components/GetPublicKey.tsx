import { Button, Text } from '@chakra-ui/react';

interface GetPublicKeyProps {
  onClickGetPublicKey?: () => void;
  isLoading?: boolean;
}

export function GetPublicKey({ onClickGetPublicKey, isLoading }: GetPublicKeyProps) {
  return (
    <>
      <Text variant="secondary">
        Click the button below to digitally sign a message with your connected wallet so that
        Sarcophagus can derive your public key. Send that key to any embalmers interested in
        creating sarcophagi for you.
      </Text>
      <Button
        mt={6}
        py={6}
        onClick={onClickGetPublicKey}
        isLoading={isLoading}
      >
        Get Public Key
      </Button>
    </>
  );
}
