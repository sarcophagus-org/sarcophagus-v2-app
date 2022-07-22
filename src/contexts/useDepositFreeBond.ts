import { useState, useRef } from 'react';
import { ethers } from 'ethers';
import { useSubmitTransaction } from '../lib/useSubmitTransactions';
import { useContractRead, useContractWrite, useAccount } from 'wagmi';
import { SarcoTokenMock__factory, ArchaeologistFacet__factory } from '../assets/typechain';

const useDepositFreeBond = () => {
  const [depositAmount, setDepositAmount] = useState('0');

  const { submit } = useSubmitTransaction({
    functionName: 'depositFreeBond',
    contractInterface: ArchaeologistFacet__factory.abi,
  });

  function depositFreeBond() {
    submit({ args: [depositAmount], toastText: 'Deposit Free Bond' });
  }

  const { address } = useAccount();

  const { data: sarcoTokenApprovalAmount, refetch: getSarcoTokenAllowance } = useContractRead({
    addressOrName: process.env.REACT_APP_SARCO_TOKEN_ADDRESS || '',
    contractInterface: SarcoTokenMock__factory.abi,
    functionName: 'allowance',
    args: [address, process.env.REACT_APP_LOCAL_CONTRACT_ADDRESS],
  });

  const { write: approveSarcoToken } = useContractWrite({
    addressOrName: process.env.REACT_APP_SARCO_TOKEN_ADDRESS || '',
    contractInterface: SarcoTokenMock__factory.abi,
    functionName: 'approve',
    args: [process.env.REACT_APP_LOCAL_CONTRACT_ADDRESS, ethers.constants.MaxUint256],
  });

  function hasSarcoTokenApproval() {
    getSarcoTokenAllowance();
    console.log('sarcoTokenApprovalAmount', sarcoTokenApprovalAmount);
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
