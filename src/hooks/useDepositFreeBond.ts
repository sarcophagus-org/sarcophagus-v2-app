import { useState } from 'react';
import { ArchaeologistFacetABI } from '../abis/ArchaeologistFacet';
import { useAllowance } from './sarcoToken/useAllowance';
import { useApprove } from './sarcoToken/useApprove';
import { useSubmitTransaction } from './useSubmitTransactions';

const useDepositFreeBond = () => {
  const [depositAmount, setDepositAmount] = useState('0');

  const { submit: depositFreeBond } = useSubmitTransaction({
    contractInterface: ArchaeologistFacetABI,
    functionName: 'depositFreeBond',
    args: [depositAmount],
    toastDescription: `Deposited ${depositAmount} free bond`,
  });

  const { allowance } = useAllowance();
  const { approve } = useApprove();

  function hasSarcoTokenApproval() {
    return allowance?.gt(0);
  }

  return {
    depositAmount,
    setDepositAmount,
    depositFreeBond,
    approveSarcoToken: approve,
    hasSarcoTokenApproval,
  };
};

export default useDepositFreeBond;
