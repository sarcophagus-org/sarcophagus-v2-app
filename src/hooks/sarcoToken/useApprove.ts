import { ethers } from 'ethers';
import { SarcoTokenMock__factory } from '@sarcophagus-org/sarcophagus-v2-contracts';
import { useNetworkConfig } from 'lib/config';
import { useSubmitTransaction } from 'hooks/useSubmitTransaction';
import { Abi } from 'abitype';

export function useApprove() {
  const networkConfig = useNetworkConfig();

  const toastDescription = 'Approved';
  const transactionDescription = 'Approve SARCO spending';

  const { submit, isSubmitting } = useSubmitTransaction(
    {
      contractConfigParams: {
        abi: SarcoTokenMock__factory.abi as Abi,
        functionName: 'approve',
        args: [networkConfig.diamondDeployAddress, ethers.constants.MaxUint256],
        mode: 'prepared',
      },
      toastDescription,
      transactionDescription,
    },
    networkConfig.sarcoTokenAddress
  );

  return { approve: submit, isApproving: isSubmitting };
}
