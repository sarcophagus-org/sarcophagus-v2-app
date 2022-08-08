import { useState } from 'react';
import { ethers } from 'ethers';
import { useSubmitTransaction } from './useSubmitTransactions';
import { useContractRead, useContractWrite, useAccount } from 'wagmi';
import { SarcoTokenMock } from '../abi/SarcoTokenMock';
import { ArchaeologistFacet } from '../abi/ArchaeologistFacet';

const useDepositFreeBond = () => {
  const [depositAmount, setDepositAmount] = useState('0');

  const { submit } = useSubmitTransaction({
    functionName: 'depositFreeBond',
    contractInterface: ArchaeologistFacet.abi,
  });

  function depositFreeBond() {
    submit({ args: [depositAmount], toastText: 'Deposit Free Bond' });
  }

  const { address } = useAccount();

  const { data: sarcoTokenApprovalAmount, refetch: getSarcoTokenAllowance } = useContractRead({
    addressOrName: process.env.REACT_APP_SARCO_TOKEN_ADDRESS || '',
    contractInterface: SarcoTokenMock.abi,
    functionName: 'allowance',
    args: [address, process.env.REACT_APP_LOCAL_CONTRACT_ADDRESS],
  });

  const { write: approveSarcoToken } = useContractWrite({
    addressOrName: process.env.REACT_APP_SARCO_TOKEN_ADDRESS || '',
    contractInterface: SarcoTokenMock.abi,
    functionName: 'approve',
    args: [process.env.REACT_APP_LOCAL_CONTRACT_ADDRESS, ethers.constants.MaxUint256],
  });

  function hasSarcoTokenApproval() {
    getSarcoTokenAllowance();
    return Number(sarcoTokenApprovalAmount || 0) > 0;
  }

  return {
    depositAmount,
    setDepositAmount,
    depositFreeBond,
    approveSarcoToken,
    hasSarcoTokenApproval,
  };
};

export default useDepositFreeBond;
