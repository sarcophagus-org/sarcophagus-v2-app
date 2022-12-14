import { VStack, Input, Button, Textarea, AlertStatus } from '@chakra-ui/react';
import { useRecoverPublicKey, ErrorStatus } from '../hooks/useRecoverPublicKey';
import { setRecipientState, RecipientSetByOption } from 'store/embalm/actions';
import { useDispatch, useSelector } from 'store/index';
import { SarcoAlert } from 'components/SarcoAlert';

interface IErrorStatusMap {
  alertMessage: string;
  alertStatus: AlertStatus;
}

export function RecoverPublicKey() {
  const ErrorStatusMap: { [key: number]: IErrorStatusMap } = {
    [ErrorStatus.SUCCESS]: {
      alertStatus: 'success',
      alertMessage: 'Public Key found! You can move on to the next step.',
    },
    [ErrorStatus.INVALID_ADDRESS]: {
      alertStatus: 'warning',
      alertMessage: 'Address is not a value Etherum address.',
    },
    [ErrorStatus.CANNOT_RECOVER]: {
      alertStatus: 'warning',
      alertMessage: 'This address has no transactions in which to recover the pubilc key.',
    },
    [ErrorStatus.ERROR]: {
      alertStatus: 'error',
      alertMessage: 'An error occurred while trying to recover the public key.',
    },
  };

  const dispatch = useDispatch();
  const { recipientState } = useSelector(x => x.embalmState);

  const { recoverPublicKey, isLoading, errorStatus, clearErrorStatus } = useRecoverPublicKey();

  async function handleOnClick(): Promise<void> {
    if (recipientState.address !== '') await recoverPublicKey(recipientState.address);
  }

  return (
    <VStack
      align="left"
      spacing={6}
    >
      <Input
        placeholder="0x0..."
        onChange={e => {
          if (errorStatus) clearErrorStatus();
          dispatch(
            setRecipientState({
              address: e.target.value.trim(),
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
      {errorStatus && (
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
