import { VStack, Input, Button } from '@chakra-ui/react';
import { useRecoverPublicKey } from './useRecoverPublicKey';
import { setRecipient } from 'store/embalm/actions';
import { useDispatch, useSelector } from 'store/index';

export function RecoverPublicKey() {
  const dispatch = useDispatch();
  const { recipient } = useSelector(x => x.embalmState);

  const { recoverPublicKey, isLoading } = useRecoverPublicKey();

  async function handleOnClick(): Promise<void> {
    if (recipient.address !== '') await recoverPublicKey(recipient.address);
  }

  return (
    <VStack
      align="left"
      spacing={6}
    >
      <Input
        placeholder="0x0..."
        onChange={e => dispatch(setRecipient({ address: e.target.value, publicKey: '' }))}
        value={recipient.address}
        disabled={isLoading}
      />
      <Button
        onClick={handleOnClick}
        isLoading={isLoading}
        w="190px"
      >
        Lookup Public Key
      </Button>
    </VStack>
  );
}
