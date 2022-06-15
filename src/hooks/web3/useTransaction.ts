import { ethers } from 'ethers';
import React, { useState } from 'react';
import { toast } from 'react-toastify';

interface ProviderRpcError extends Error {
  message: string;
  code: number;
  data?: unknown;
}

// @todo this hook could use a closer look to make more readable and reusuable
export function useTransaction() {
  const [pending, setPending] = useState(false);

  /**
   *
   * @param contractFn function to call
   * @param pendingMessage toast message while pending
   * @param failedMessage toast message when failed
   * @param successMessage toast message when successful
   * @param broadcastCallback function prior while waiting
   * @param failedCallback functionc called when failed
   * @param successCallback function called when successful
   * @param completedCallback function called when transaction is complete (regardless of success)
   */
  const contractCall = (
    contractFn: () => Promise<ethers.ContractTransaction>,
    pendingMessage: string,
    failedMessage: string,
    successMessage: string,
    broadcastCallback?: () => void,
    failedCallback?: () => void,
    successCallback?: (txRecipient: { transactionHash: string }) => void,
    completedCallback?: () => void
  ) => {
    let toastId: React.ReactText;
    setPending(true);
    contractFn()
      .then((txResponse: ethers.ContractTransaction) => {
        toastId = toast.dark(pendingMessage, {
          autoClose: false,
          closeOnClick: false,
          draggable: false,
          closeButton: false,
        });
        const wait =
          process.env.NODE_ENV !== 'development'
            ? 0
            : process.env.REACT_APP_DEVELOPMENT_TX_WAIT_MS
            ? parseInt(process.env.REACT_APP_DEVELOPMENT_TX_WAIT_MS)
            : 0;
        if (broadcastCallback) broadcastCallback();
        return Promise.all([
          new Promise(resolve => setTimeout(() => resolve(null), wait)).then(() =>
            txResponse.wait()
          ),
          toastId,
        ]);
      })
      .then(([txReceipt, _toastId]) => {
        setTimeout(() => {
          setPending(false);
        }, 5000);
        toast.dismiss(_toastId);
        if (!txReceipt.status) {
          toast.error(failedMessage);
          if (failedCallback) failedCallback();
        } else if (!!txReceipt.status) {
          toast.dark(successMessage);
          if (successCallback) successCallback(txReceipt);
        } else {
          toast.error('Not sure what happened with that transaction');
          if (failedCallback) failedCallback();
        }
        if (completedCallback) completedCallback();
      })
      .catch((error: ProviderRpcError) => {
        console.error(error);
        setPending(false);
        toast.dismiss(toastId);
        if (error.code !== 4001) {
          toast.error("There was an error! Check your browser's console logs for more details.");
        }
        if (failedCallback) failedCallback();
      });
  };
  return { contractCall, pending };
}
