import { Text, VStack } from '@chakra-ui/react';
import { ethers } from 'ethers';
import { useNetworkConfig } from 'lib/config';
import { convertSarcoPerSecondToPerMonth, formatSarco } from 'lib/utils/helpers';
import { SarcophagusArchaeologist } from 'types';
import { useEnsName } from 'wagmi';
interface ArchaeologistDetailItemProps {
  archaeologist: SarcophagusArchaeologist & { address: `0x${string}` };
}

export function ArchaeologistDetailItem({ archaeologist }: ArchaeologistDetailItemProps) {
  const networkConfig = useNetworkConfig();
  const { data: ensName } = useEnsName({
    address: archaeologist.address,
    chainId: networkConfig.chainId,
  });

  return (
    <VStack
      align="left"
      key={archaeologist.address}
      spacing={1}
    >
      {archaeologist.isAccused && (
        <Text
          color="red"
          textTransform="uppercase"
        >
          Accused
        </Text>
      )}
      {archaeologist.privateKey !== ethers.constants.HashZero && (
        <Text
          color="green"
          textTransform="uppercase"
        >
          Unwrapped
        </Text>
      )}
      <Text>Address: {ensName ?? archaeologist.address}</Text>
      <Text>
        Digging Fee Per Month:{' '}
        {formatSarco(convertSarcoPerSecondToPerMonth(archaeologist.diggingFeePerSecond.toString()))}{' '}
        SARCO
      </Text>
      <Text>Public Key: {archaeologist.publicKey}</Text>
      {archaeologist.privateKey !== ethers.constants.HashZero && (
        <Text>Private Key: {archaeologist.privateKey}</Text>
      )}
    </VStack>
  );
}