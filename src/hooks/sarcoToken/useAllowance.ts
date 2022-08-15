import { useAccount, useContractRead } from 'wagmi';
import { SarcoToken } from '../../abi/SarcoToken';

export function useAllowance() {
  const { address } = useAccount();

  const { data } = useContractRead({
    addressOrName: process.env.REACT_APP_SARCO_TOKEN_ADDRESS || '',
    contractInterface: SarcoToken.abi,
    functionName: 'allowance',
    args: [address, process.env.REACT_APP_LOCAL_CONTRACT_ADDRESS],
  });

  return { allowance: data };
}
