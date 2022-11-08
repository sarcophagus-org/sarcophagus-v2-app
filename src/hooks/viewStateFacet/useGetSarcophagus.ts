import { ViewStateFacet__factory } from '@sarcophagus-org/sarcophagus-v2-contracts';
import { ethers } from 'ethers';
import { useNetworkConfig } from 'lib/config';
import { Sarcophagus } from 'types';
import { useContractRead } from 'wagmi';

export function useGetSarcophagus(sarcoId: string | number): Sarcophagus {
  const networkConfig = useNetworkConfig();

  const { data } = useContractRead({
    address: networkConfig.diamondDeployAddress,
    abi: ViewStateFacet__factory.abi,
    functionName: 'getSarcophagus',
    args: [sarcoId !== '' ? sarcoId : ethers.constants.HashZero],
  });

  return data as Sarcophagus;
}
