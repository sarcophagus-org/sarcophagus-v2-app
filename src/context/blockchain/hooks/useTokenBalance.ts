import { Contract, BigNumber } from 'ethers';
import { useState, useEffect } from 'react';

export const useTokenBalance = (
  tokenContract: Contract,
  currentBlock: number,
  account: string | null
) => {
  const [balance, setBalance] = useState(BigNumber.from(0));

  useEffect(() => {
    if (!account) return;

    tokenContract
      .balanceOf(account)
      .then((_balance: BigNumber) => {
        setBalance(_balance);
      })
      .catch(console.error);
  }, [account, tokenContract, currentBlock]);

  return { balance };
};
