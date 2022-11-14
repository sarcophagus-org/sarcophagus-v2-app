import { Button, HStack, Text, VStack } from '@chakra-ui/react';
import { BigNumber, ethers } from 'ethers';
import { useBurySarcophagus } from 'hooks/embalmerFacet';
import { useGetSarcophagusDetails } from 'hooks/viewStateFacet';
import { buildResurrectionDateString } from 'lib/utils/helpers';
import { NavLink, useParams } from 'react-router-dom';
import { SarcophagusState } from 'types';
import { useAccount } from 'wagmi';

export function Details() {
  const { id } = useParams();
  const { sarcophagus } = useGetSarcophagusDetails({ sarcoId: id });
  const { address } = useAccount();
  const { bury, isLoading, isBurying } = useBurySarcophagus(id || ethers.constants.HashZero);
  const resurrectionString = buildResurrectionDateString(
    sarcophagus?.resurrectionTime || BigNumber.from(0)
  );

  // Determine if the rewrap and bury functions are available
  const canRewrapOrBury =
    sarcophagus?.state === SarcophagusState.Active && sarcophagus?.embalmer === address;

  // Determine if the claim function is available
  const canClaim =
    sarcophagus?.state === SarcophagusState.Resurrected &&
    sarcophagus?.recipientAddress === address;

  function handleBury() {
    bury?.();
  }

  return (
    <VStack
      spacing={0}
      align="left"
    >
      <Text>Resurrection Date</Text>
      <Text variant="secondary">{sarcophagus?.resurrectionTime ? resurrectionString : '--'}</Text>

      <HStack pt={10}>
        {canRewrapOrBury && (
          <>
            <Button
              as={NavLink}
              to="?action=rewrap"
            >
              Rewrap
            </Button>
            <Button
              onClick={handleBury}
              isLoading={isLoading}
              loadingText={isBurying ? 'Burying...' : undefined}
            >
              Bury
            </Button>
          </>
        )}
        {canClaim && (
          <Button
            as={NavLink}
            to="?action=claim"
          >
            Claim
          </Button>
        )}
      </HStack>
    </VStack>
  );
}
