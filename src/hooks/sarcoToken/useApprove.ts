import { BigNumber } from 'ethers';
import { sarco as sarcoSdk } from 'sarcophagus-v2-sdk';
import { useState } from 'react';
import { useToast } from '@chakra-ui/react';

export function useApprove(args: { onApprove?: Function; amount: BigNumber }) {
  const toast = useToast();

  const [isApproving, setIsApproving] = useState(false);
  const [error, setError] = useState<string>();

  const toastDescription = 'Approved';

  async function approve() {
    return new Promise<void>((resolve, reject) => {
      setError(undefined);
      setIsApproving(true);

      sarcoSdk!
        .approveSarcophagus(args.amount, {
          onTxSuccess: () => {
            toast({
              title: 'Approved',
              status: 'success',
              duration: 2000,
              isClosable: true,
              position: 'bottom-right',
            });
            setIsApproving(false);
            if (!!args?.onApprove) args?.onApprove();
            resolve();
          },
        })
        .catch((e: Error) => {
          console.error(e);
          setError(e.message);
          toast({
            title: 'Transaction Failed',
            description: toastDescription,
            status: 'error',
            duration: 5000,
            isClosable: true,
            position: 'bottom-right',
          });
          setIsApproving(false);
          reject('Transaction Failed');
        });
    });
  }

  return {
    approve,
    isApproving,
    error,
  };
}
