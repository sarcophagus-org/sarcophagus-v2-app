import { Box } from '@chakra-ui/react';
import { useContractRead, useContractEvent, useAccount } from 'wagmi';
import { ArchaeologistFacet__factory, ViewStateFacet__factory } from '../assets/typechain';

function DisplayFreeBond() {
  const { address } = useAccount();

  const {
    data: amount,
    //    isError,
    //    error,
    refetch,
  } = useContractRead({
    addressOrName: process.env.REACT_APP_LOCAL_CONTRACT_ADDRESS || '',
    contractInterface: ViewStateFacet__factory.abi,
    functionName: 'getFreeBond',
    args: [address],
  });

  useContractEvent({
    addressOrName: process.env.REACT_APP_LOCAL_CONTRACT_ADDRESS || '',
    contractInterface: ArchaeologistFacet__factory.abi,
    eventName: 'DepositFreeBond',
    listener: () => refetch(),
  });

  return <Box>Free Bond Amount: {amount?.toString()}</Box>;
}

export default DisplayFreeBond;
