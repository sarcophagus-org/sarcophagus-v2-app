import { BigNumber } from 'ethers';
import { useState } from 'react';
import { useToast } from '@chakra-ui/react';
import { sarco } from '@sarcophagus-org/sarcophagus-v2-sdk-client';
import { approveFailure, approveSuccess } from 'lib/utils/toast';

export function useApprove(args: { onApprove?: Function; amount: BigNumber }) {
  const toast = useToast();

  const [isApproving, setIsApproving] = useState(false);
  const [error, setError] = useState<string>();

  async function approve() {
    try {
      const tx = await sarco.token.approve(args.amount);
      await tx.wait();
      toast(approveSuccess());
      if (!!args?.onApprove) args?.onApprove();
    } catch (e) {
      const err = e as Error;
      console.error(err);
      setError(err.message);
      toast(approveFailure());
      throw new Error(err.message || 'Error Approving SARCO token');
    } finally {
      setIsApproving(false);
    }
  }

  return {
    approve,
    isApproving,
    error,
  };
}
