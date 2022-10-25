import { ethers } from 'ethers';
import { useContractWrite } from 'wagmi';
import { SarcoTokenMock__factory } from '@sarcophagus-org/sarcophagus-v2-contracts';
import { useNetworkConfig } from 'lib/config';
import { useState } from 'react';

export function useApprove() {
  const networkConfig = useNetworkConfig();
  const [approveError, setApproveError] = useState('');

  const { write } = useContractWrite({
    addressOrName: networkConfig.sarcoTokenAddress,
    contractInterface: SarcoTokenMock__factory.abi,
    functionName: 'approve',
    args: [networkConfig.diamondDeployAddress, ethers.constants.MaxUint256],
    onError: () => setApproveError('Could not approve'),
  });

  return { approve: write, approveError };
}
