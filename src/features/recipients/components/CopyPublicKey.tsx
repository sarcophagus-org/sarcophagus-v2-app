import { CheckIcon, CopyIcon } from '@chakra-ui/icons';
import { Button, Text, useClipboard } from '@chakra-ui/react';

interface CopyPublicKeyProps {
  publicKey: string;
}

export function CopyPublicKey({ publicKey }: CopyPublicKeyProps) {
  const { onCopy, hasCopied } = useClipboard(publicKey, {
    timeout: 5000,
  });

  return (
    <>
      <Text variant="secondary">
        Sarcophagus has derived your public key! You can copy this and send to embalmers interested
        in creating sarcophagi for you.
      </Text>
      <Text
        p={5}
        mt={6}
        border="1px solid"
        borderColor="brand.700"
        variant="secondary"
        h="150px"
      >
        {publicKey}
      </Text>
      <Button
        mt={6}
        py={6}
        leftIcon={!hasCopied ? <CopyIcon /> : <CheckIcon />}
        onClick={onCopy}
      >
        Copy to Clipbard
      </Button>
    </>
  );
}
