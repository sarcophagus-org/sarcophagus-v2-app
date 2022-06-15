import { BigNumber, Contract } from 'ethers';
import { useCallback, useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { useTransaction } from './useTransaction';

const useApproval = (allowance: BigNumber, contract: Contract, tokenContract: Contract) => {
  const { contractCall } = useTransaction();
  const [approved, setApproved] = useState(false);

  const approveTransaction = useCallback(async () => {
    const successCallback = ({ transactionHash }: { transactionHash: string }) => {
      toast.success('SARCO approval made!');
      console.info('Approval TX HASH', transactionHash);
      setApproved(true);
    };

    contractCall(
      () =>
        tokenContract.approve(
          contract?.address,
          BigNumber.from(2).pow(BigNumber.from(256)).sub(BigNumber.from(1))
        ),
      'Approving SARCO...',
      'SARCO approval failed!',
      'SARCO approval made!',
      () => null,
      undefined,
      successCallback
    );
  }, [contract, tokenContract, contractCall]);

  useEffect(() => {
    setApproved(!allowance.isZero());
  }, [allowance]);

  return { approved, approveTransaction };
};

export default useApproval;
