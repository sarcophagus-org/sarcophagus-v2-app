import { useToast } from '@chakra-ui/react';
import { useAddRecentTransaction } from '@rainbow-me/rainbowkit';
import { useContractWrite, usePrepareContractWrite, useWaitForTransaction } from 'wagmi';
import { formatToastMessage } from 'lib/utils/helpers';
import { useNetworkConfig } from 'lib/config';
import { ethers } from 'ethers';
import { useState } from 'react';

interface ContractConfigParams {
  address?: `0x${string}`;
  abi: any;
  functionName: string;
  args: (string | ethers.BigNumber)[];
  mode: string;
}

interface UseSubmitTransactionParams {
  toastDescription: string;
  transactionDescription: string;
  contractConfigParams: ContractConfigParams;
}

export function useSubmitTransaction(
  contractConfig: UseSubmitTransactionParams,
  address?: string,
  onTxMined?: Function
) {
  const defaultSuccessToast = 'Transaction submitted';
  const defaultTransactionDescription = 'Unknown transaction submitted';
  const toastDuration = 5000;
  const toast = useToast();
  const networkConfig = useNetworkConfig();
  const addRecentTransaction = useAddRecentTransaction();

  const { config, error } = usePrepareContractWrite({
    address: (address ?? networkConfig.diamondDeployAddress) as `0x${string}`,
    ...contractConfig.contractConfigParams,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const { writeAsync, data } = useContractWrite({
    onSuccess(d) {
      addRecentTransaction({
        hash: d.hash,
        description: contractConfig.transactionDescription || defaultTransactionDescription,
      });
    },
    onError(e) {
      setIsSubmitting(false);
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
    mode: 'prepared',
  });

  useWaitForTransaction({
    hash: data?.hash,
    onSuccess() {
      toast({
        title: 'Successful Transaction',
        description: contractConfig.toastDescription || defaultSuccessToast,
        status: 'success',
        duration: toastDuration,
        isClosable: true,
        position: 'bottom-right',
      });
      setIsSubmitting(false);

      if (!!onTxMined) onTxMined();
    },
    onError(e) {
      console.error(e);
      setIsSubmitting(false);
    },
  });

  return {
    submit: !writeAsync
      ? undefined
      : async () => {
          setIsSubmitting(true);
          (await writeAsync()).wait();
        },
    isSubmitting,
    error,
  };
}
