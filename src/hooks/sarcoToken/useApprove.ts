import { ethers } from 'ethers';
import { useContractWrite } from 'wagmi';
import { SarcoTokenABI } from '../../abis/SarcoToken';

export function useApprove() {
  const { write } = useContractWrite({
    addressOrName: process.env.REACT_APP_SARCO_TOKEN_ADDRESS || '',
    contractInterface: SarcoTokenABI,
    functionName: 'approve',
    args: [process.env.REACT_APP_LOCAL_CONTRACT_ADDRESS, ethers.constants.MaxUint256],
  });

  return { approve: write };
}
