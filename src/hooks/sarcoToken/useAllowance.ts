import { BigNumber } from 'ethers';
import { useEffect, useState } from 'react';
import { sarco } from '@sarcophagus-org/sarcophagus-v2-sdk-client';
import { useAccount } from 'wagmi';

export function useAllowance() {
  const { address } = useAccount();
  const [allowance, setAllowance] = useState<BigNumber | undefined>();
  const [isLoading, setIsLoading] = useState(false);
  const [allowanceError, setAllowanceError] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchAllowance() {
      if (!address) return;
      setIsLoading(true);
      try {
        const fetchedAllowance = await sarco.token.allowance(address);
        setAllowance(fetchedAllowance);
        setError(null);
        setAllowanceError(false);
      } catch (e) {
        console.error(`error fetching allowance ${e}`);
        const err = e as Error;
        setError(err.message);
        setAllowanceError(true);
      } finally {
        setIsLoading(false);
      }
    }

    fetchAllowance();
  }, [address]);

  return { allowance, isLoading, allowanceError, error };
}
