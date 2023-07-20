import { VStack, Input, Button, Textarea, AlertStatus } from '@chakra-ui/react';
import { setRecipientState, RecipientSetByOption } from 'store/embalm/actions';
import { useDispatch, useSelector } from 'store/index';
import { SarcoAlert } from 'components/SarcoAlert';
import { useEnterKeyCallback } from 'hooks/useEnterKeyCallback';
import { RecoverPublicKeyErrorStatus } from '@sarcophagus-org/sarcophagus-v2-sdk-client';
import { useRecoverPublicKey } from '../hooks/useRecoverPublicKey';

interface IErrorStatusMap {
  alertMessage: string;
  alertStatus: AlertStatus;
}

export function RecoverPublicKey() {
  const ErrorStatusMap: { [key: number]: IErrorStatusMap } = {
    [RecoverPublicKeyErrorStatus.INVALID_ADDRESS]: {
      alertStatus: 'warning',
      alertMessage: 'Address is not a value Etherum address.',
    },
    [RecoverPublicKeyErrorStatus.CANNOT_RECOVER]: {
      alertStatus: 'warning',
      alertMessage: 'This address has no transactions in which to recover the pubilc key.',
    },
    [RecoverPublicKeyErrorStatus.ERROR]: {
      alertStatus: 'error',
      alertMessage: 'An error occurred while trying to recover the public key.',
    },
  };

  const dispatch = useDispatch();
  const { recipientState } = useSelector(x => x.embalmState);
  const { recoverPublicKey, publicKey, clearErrorStatus, errorStatus, isLoading } =
    useRecoverPublicKey();

  useEnterKeyCallback(() => recoverPublicKey(recipientState.address));

  async function handleOnClick(): Promise<void> {
    if (recipientState.address !== '') await recoverPublicKey(recipientState.address);
  }

  return (
    <VStack
      align="left"
      spacing={6}
    >
      <Input
        placeholder="0x0000..."
        onChange={e => {
          if (errorStatus) clearErrorStatus();
          dispatch(
            setRecipientState({
              address: e.target.value.replaceAll(/\s+/g, ''),
              publicKey: '',
              setByOption: RecipientSetByOption.ADDRESS,
            })
          );
        }}
        value={recipientState.address}
        disabled={isLoading}
        maxLength={42}
      />
      <Textarea
        disabled
        value={recipientState.publicKey}
        resize="none"
      />
      {publicKey && (
        <SarcoAlert status="success">
          Public Key found! You can move on to the next step.
        </SarcoAlert>
      )}
      {!publicKey && errorStatus && (
        <SarcoAlert status={ErrorStatusMap[errorStatus].alertStatus}>
          {ErrorStatusMap[errorStatus].alertMessage}
        </SarcoAlert>
      )}
      <Button
        onClick={handleOnClick}
        isLoading={isLoading}
        disabled={!recipientState.address.trim()}
        w="190px"
      >
        Lookup Public Key
      </Button>
    </VStack>
  );
}
