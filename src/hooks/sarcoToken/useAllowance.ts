import { BigNumber } from 'ethers';
import { useCallback, useEffect, useState } from 'react';
import { sarco } from '@sarcophagus-org/sarcophagus-v2-sdk-client';
import { useAccount } from 'wagmi';

export function useAllowance() {
  const { address } = useAccount();
  const [allowance, setAllowance] = useState<BigNumber | undefined>();
  const [isLoading, setIsLoading] = useState(false);
  const [allowanceError, setAllowanceError] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const retryInterval = 3000; // Time in milliseconds to wait before retrying
  const maxRetries = 4; // Maximum number of retries

  const fetchAllowanceWithRetry = useCallback(
    async (retryCount: number = 0) => {
      if (!address) return;
      setIsLoading(true);
      try {
        const fetchedAllowance = await sarco.token.allowance(address);
        setAllowance(fetchedAllowance);
        setError(null);
        setAllowanceError(false);
      } catch (e) {
        const err = e as Error;
        if (retryCount < maxRetries) {
          setTimeout(() => fetchAllowanceWithRetry(retryCount + 1), retryInterval);
        } else {
          setError(err.message);
          setAllowanceError(true);
        }
      } finally {
        setIsLoading(false);
      }
    },
    [address]
  );

  useEffect(() => {
    fetchAllowanceWithRetry();
  }, [address, fetchAllowanceWithRetry]);

  return { allowance, isAllowanceLoading: isLoading, allowanceError, error };
}
