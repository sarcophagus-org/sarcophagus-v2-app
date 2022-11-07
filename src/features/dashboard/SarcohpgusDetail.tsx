import { Text, HStack, VStack, Heading, Input, Button } from '@chakra-ui/react';
import { formatAddress } from 'lib/utils/helpers';
import { useGetSarcophagus } from 'hooks/viewStateFacet';
import { useRewrapSarcophagus } from 'hooks/embalmerFacet';

export function SarcophagusDetail({ id }: { id: string | undefined }) {
  const { sarcophagus } = useGetSarcophagus({ sarcoId: id });
  const { write, resurectionTime, setResurectionTime } = useRewrapSarcophagus({
    sarcoId: sarcophagus?.sarcoId,
  });

  return sarcophagus ? (
    <HStack
      w="100%"
      border="solid 1px"
      borderColor="violet.700"
      bg="brand.0"
      justify="space-between"
      px={6}
      alignItems="start"
    >
      <VStack align="left">
        <Heading>DETAILS</Heading>
        <HStack>
          <Text variant="secondary">Id: </Text>
          <Text>{formatAddress(id || '')}</Text>
        </HStack>
        <HStack>
          <Text variant="secondary">Name: </Text>
          <Text>{sarcophagus?.name}</Text>
        </HStack>
        <HStack>
          <Text variant="secondary">Resurrection Date: </Text>
          <Text>
            {new Date(sarcophagus?.resurrectionTime?.mul(1000).toNumber() || 0).toDateString()}
          </Text>
        </HStack>
        <HStack>
          <Text variant="secondary">Max Rewarp Interval: </Text>
          <Text>{sarcophagus?.maximumRewrapInterval?.toString()}</Text>
        </HStack>
        <HStack>
          <Text variant="secondary">Max Rewarp Date: </Text>
          <Text>
            {Math.trunc(Date.now() / 1000 + (sarcophagus?.maximumRewrapInterval?.toNumber() || 0))}{' '}
            ({' '}
            {new Date(
              Date.now() + (sarcophagus?.maximumRewrapInterval?.toNumber() || 0) * 1000
            ).toDateString()}{' '}
            )
          </Text>
        </HStack>
        <HStack>
          <Text variant="secondary">state: </Text>
          <Text>{sarcophagus?.state}</Text>
        </HStack>
      </VStack>
      <VStack align="center">
        <Heading>REWRAP</Heading>
        <Input
          onChange={e => setResurectionTime(e.target.value)}
          value={resurectionTime}
          placeholder="Epoch Time in Seconds"
        />
        <Button
          disabled={!write}
          onClick={() => write?.()}
        >
          Rewrap
        </Button>
      </VStack>
    </HStack>
  ) : (
    <></>
  );
}
