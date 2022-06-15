import { Contract, BigNumber } from 'ethers';
import { useState, useEffect } from 'react';

export function useTokenAllowance(
  contract: Contract,
  tokenContract: Contract,
  account: string | null
) {
  const [allowance, setAllowance] = useState(BigNumber.from(0));

  useEffect(() => {
    if (!account) {
      return;
    }
    tokenContract
      .allowance(account, contract.address)
      .then((_allowance: BigNumber) => {
        setAllowance(_allowance);
      })
      .catch(console.error);
  }, [account, contract, tokenContract]);
  return allowance;
}
