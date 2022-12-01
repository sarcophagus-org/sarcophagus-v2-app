import { useAddRecentTransaction } from '@rainbow-me/rainbowkit';
import { useSarcoToast } from 'components/SarcoToast';
import { useNetworkConfig } from 'lib/config';
import { formatToastMessage } from 'lib/utils/helpers';
import { useContractWrite, usePrepareContractWrite } from 'wagmi';
import { UseContractWriteArgs } from 'wagmi/dist/declarations/src/hooks/contracts/useContractWrite';

type UseSubmitTransactionsArgs = UseContractWriteArgs & {
  toastDescription?: string;
  transactionDescription?: string;
};

export function useSubmitTransaction(
  contractConfig: Omit<UseSubmitTransactionsArgs, 'address'>,
  address?: string
) {
  const defaultSuccessToast = 'Transaction submitted';
  const defaultTransactionDescription = 'Unknown transaction submitted';
  const toastDuration = 5000;
  const sarcoToast = useSarcoToast();
  const networkConfig = useNetworkConfig();
  const addRecentTransaction = useAddRecentTransaction();

  const { config, error } = usePrepareContractWrite({
    address: address ?? networkConfig.diamondDeployAddress,
    ...contractConfig,
  });

  const { writeAsync } = useContractWrite({
    onSuccess(data) {
      sarcoToast.open({
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
    onError(e) {
      console.log('Transaction failed with args\n:', JSON.stringify(contractConfig.args));
      // TODO: Add a click to see more button on the toast message
      sarcoToast.open({
        title: 'Error',
        description: formatToastMessage(e.message),
        status: 'error',
        isClosable: true,
        position: 'bottom-right',
      });
    },
    ...config,
  });

  return {
    submit: !writeAsync ? undefined : async () => (await writeAsync()).wait(),
    error,
  };
}
