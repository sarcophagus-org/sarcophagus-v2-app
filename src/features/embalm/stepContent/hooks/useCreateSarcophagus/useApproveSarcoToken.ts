import { ethers } from 'ethers';
import { useCallback } from 'react';
import { useNetworkConfig } from '../../../../../lib/config';

export function useApproveSarcoToken(sarcoToken: ethers.Contract) {
  const networkConfig = useNetworkConfig();

  const approveSarcoToken = useCallback(async () => {
    const tx = await sarcoToken.approve(
      networkConfig.diamondDeployAddress,
      ethers.constants.MaxUint256
    );

    await tx.wait();
  }, [sarcoToken, networkConfig.diamondDeployAddress]);

  return {
    approveSarcoToken,
  };
}
