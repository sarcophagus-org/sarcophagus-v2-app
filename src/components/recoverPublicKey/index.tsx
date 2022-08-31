import { VStack, Input, Button } from '@chakra-ui/react';
import { useRecoverPublicKey } from './useRecoverPublicKey';
import { setRecipientAddress } from 'store/embalm/actions';
import { useDispatch, useSelector } from 'store/index';

export function RecoverPublicKey() {
  const dispatch = useDispatch();
  const { recipientAddress } = useSelector(x => x.embalmState);

  const { recoverPublicKey, isLoading } = useRecoverPublicKey();

  function handleNameChange(e: React.ChangeEvent<HTMLInputElement>) {
    dispatch(setRecipientAddress(e.target.value));
  }

  async function handleOnClick(): Promise<void> {
    if (recipientAddress !== '') await recoverPublicKey(recipientAddress);
  }

  return (
    <VStack align="left">
      <Input
        placeholder="0x0..."
        onChange={e => dispatch(setRecipientAddress(e.target.value))}
        value={recipientAddress}
        disabled={isLoading}
      />
      <Button
        background="gray"
        onClick={handleOnClick}
        isLoading={isLoading}
        w="190px"
      >
        Lookup Public Key
      </Button>
    </VStack>
  );
}
