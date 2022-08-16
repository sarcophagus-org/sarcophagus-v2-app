import { ethers } from 'ethers';
import { useContractWrite } from 'wagmi';
import { SarcoToken } from 'lib/abi/SarcoToken';
import { useNetworkConfig } from 'lib/config';

export function useApprove() {
  const networkConfig = useNetworkConfig();

  const { write } = useContractWrite({
    addressOrName: networkConfig.sarcoTokenAddress,
    contractInterface: SarcoToken.abi,
    functionName: 'approve',
    args: [networkConfig.diamondDeployAddress, ethers.constants.MaxUint256],
  });

  return { approve: write };
}
