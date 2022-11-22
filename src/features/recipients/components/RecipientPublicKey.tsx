import { Flex, Text } from '@chakra-ui/react';
import { usePublicKey } from '../hooks/usePublicKey';
import { CopyPublicKey } from './CopyPublicKey';
import { GetPublicKey } from './GetPublicKey';

export function RecipientPublicKey() {
  const { publicKey, signMessage, isLoading } = usePublicKey();

  function handleGetPublicKey() {
    signMessage();
  }

  return (
    <Flex
      w="500px"
      border="1px solid"
      borderColor="brand.300"
      direction="column"
    >
      <Flex
        justify="center"
        w="100%"
        bg="brand.400"
        py={3}
      >
        <Text fontSize="md">RECIPIENT PUBLIC KEY</Text>
      </Flex>
      <Flex
        direction="column"
        px={9}
        py={6}
      >
        {publicKey === '' ? (
          <GetPublicKey
            onClickGetPublicKey={handleGetPublicKey}
            isLoading={isLoading}
          />
        ) : (
          <CopyPublicKey publicKey={publicKey} />
        )}
      </Flex>
    </Flex>
  );
}
