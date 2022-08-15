import { Box } from '@chakra-ui/react';
import { useContractRead, useContractEvent, useAccount } from 'wagmi';
import { ArchaeologistFacet } from 'lib/abi/ArchaeologistFacet';
import { ViewStateFacet } from 'lib/abi/ViewStateFacet';
import { useNetworkConfig } from 'lib/config';

function DisplayFreeBond() {
  const { address } = useAccount();
  const networkConfig = useNetworkConfig();

  const {
    data: amount,
    //    isError,
    //    error,
    refetch,
  } = useContractRead({
    addressOrName: networkConfig.diamondDeployAddress,
    contractInterface: ViewStateFacet.abi,
    functionName: 'getFreeBond',
    args: [address],
  });

  useContractEvent({
    addressOrName: networkConfig.diamondDeployAddress,
    contractInterface: ArchaeologistFacet.abi,
    eventName: 'DepositFreeBond',
    listener: () => refetch(),
  });

  return <Box>Free Bond Amount: {amount?.toString()}</Box>;
}

export default DisplayFreeBond;
