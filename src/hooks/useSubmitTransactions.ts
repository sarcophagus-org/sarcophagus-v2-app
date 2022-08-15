import { useToast } from '@chakra-ui/react';
import { useAddRecentTransaction } from '@rainbow-me/rainbowkit';
import { useContractWrite } from 'wagmi';
import { UseContractWriteArgs } from 'wagmi/dist/declarations/src/hooks/contracts/useContractWrite';
import { formatToastMessage } from '../utils/helpers';

type UseSubmitTransactionsArgs = UseContractWriteArgs & {
  toastDescription?: string;
  transactionDescription?: string;
};

export function useSubmitTransaction(
  contractConfig: Omit<UseSubmitTransactionsArgs, 'addressOrName'>
) {
  // Constants
  const defaultSuccessToast = 'Transaction submitted';
  const defaultTransactionDescription = 'Unknown transaction submitted';
  const toastDuration = 5000;

  const toast = useToast();
  const addRecentTransaction = useAddRecentTransaction();

  const { writeAsync } = useContractWrite({
    addressOrName: process.env.REACT_APP_LOCAL_CONTRACT_ADDRESS || '',
    onSuccess(data) {
      toast({
        title: 'Successful Transaction',
        description: contractConfig.toastDescription || defaultSuccessToast,
        status: 'success',
        duration: toastDuration,
        isClosable: true,
        position: 'bottom-right',
      });
      addRecentTransaction({
        hash: data.hash,
        description: contractConfig.transactionDescription || defaultTransactionDescription,
      });
    },
    onError(error) {
      // TODO: Add a click to see more button on the toast message
      toast({
        title: 'Error',
        description: formatToastMessage(error.message),
        status: 'error',
        isClosable: true,
        position: 'bottom-right',
      });
    },
    ...contractConfig,
  });

  return {
    submit: writeAsync,
  };
}
