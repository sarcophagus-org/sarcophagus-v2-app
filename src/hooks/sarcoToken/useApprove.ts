import { ethers } from 'ethers';
import { SarcoTokenMock__factory } from '@sarcophagus-org/sarcophagus-v2-contracts';
import { useNetworkConfig } from 'lib/config';
import { useSubmitTransaction } from 'hooks/useSubmitTransaction';

export function useApprove() {
  const networkConfig = useNetworkConfig();

  const toastDescription = 'Approved';
  const transactionDescription = 'Approve SARCO spending';

  const { submit } = useSubmitTransaction({
    contractInterface: SarcoTokenMock__factory.abi,
    functionName: 'approve',
    args: [networkConfig.diamondDeployAddress, ethers.constants.MaxUint256],
    toastDescription,
    transactionDescription,
  }, networkConfig.sarcoTokenAddress);


  return { approve: submit };
}
