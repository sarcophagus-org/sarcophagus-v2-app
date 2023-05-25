import { Text, VStack } from '@chakra-ui/react';
import { ethers } from 'ethers';
import { useNetworkConfig } from 'lib/config';
import { sarco, SarcophagusArchaeologist } from 'sarcophagus-v2-sdk';
import { useEnsName } from 'wagmi';
interface ArchaeologistDetailItemProps {
  archaeologist: SarcophagusArchaeologist & { address: `0x${string}` };
  sarcoHasRewraps: boolean;
  isResurrected: boolean;
}

export function ArchaeologistDetailItem({
  archaeologist,
  sarcoHasRewraps,
  isResurrected,
}: ArchaeologistDetailItemProps) {
  const networkConfig = useNetworkConfig();
  const { data: ensName } = useEnsName({
    address: archaeologist.address,
    chainId: networkConfig.chainId,
  });

  const curseFeePaid = isResurrected || sarcoHasRewraps;

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
        Curse Fee: {sarco.utils.formatSarco(archaeologist.curseFee.toString())} SARCO{' '}
        {` ${curseFeePaid ? '(PAID)' : ''}`}
      </Text>
      <Text>
        Digging Fee Per Month:{' '}
        {sarco.utils.formatSarco(
          sarco.utils.convertSarcoPerSecondToPerMonth(archaeologist.diggingFeePerSecond.toString())
        )}{' '}
        SARCO
      </Text>
      <Text>Public Key: {archaeologist.publicKey}</Text>
      {archaeologist.privateKey !== ethers.constants.HashZero && (
        <Text>Private Key: {archaeologist.privateKey}</Text>
      )}
    </VStack>
  );
}
