import { useToast } from '@chakra-ui/react';
import { useAddRecentTransaction } from '@rainbow-me/rainbowkit';
import { useContractWrite, usePrepareContractWrite } from 'wagmi';
import { formatToastMessage } from 'lib/utils/helpers';
import { useNetworkConfig } from 'lib/config';
import { Abi } from 'abitype';
import { ethers } from 'ethers';

interface ContractConfigParams {
  address?: string;
  abi: Abi;
  functionName: string;
  args: (string | ethers.BigNumber)[];
  mode: string;
}

interface UseSubmitTransactionParams {
  toastDescription: string;
  transactionDescription: string;
  contractConfigParams: ContractConfigParams;
}

export function useSubmitTransaction(contractConfig: UseSubmitTransactionParams, address?: string) {
  const defaultSuccessToast = 'Transaction submitted';
  const defaultTransactionDescription = 'Unknown transaction submitted';
  const toastDuration = 5000;
  const toast = useToast();
  const networkConfig = useNetworkConfig();
  const addRecentTransaction = useAddRecentTransaction();

  const { config, error } = usePrepareContractWrite({
    address: address ?? networkConfig.diamondDeployAddress,
    ...contractConfig.contractConfigParams,
  });

  const { writeAsync } = useContractWrite({
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
    onError(e) {
      console.log(
        'Transaction failed with args\n:',
        JSON.stringify(contractConfig.contractConfigParams.args)
      );
      // TODO: Add a click to see more button on the toast message
      toast({
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
