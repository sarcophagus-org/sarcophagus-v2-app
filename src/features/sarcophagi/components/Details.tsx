import { Button, Flex, HStack, Text, Tooltip } from '@chakra-ui/react';
import { BigNumber, ethers } from 'ethers';
import { useBurySarcophagus } from 'hooks/embalmerFacet';
import { useGetSarcophagusDetails } from 'hooks/viewStateFacet';
import { buildResurrectionDateString } from 'lib/utils/helpers';
import { getSarcophagusState } from 'lib/utils/sarcophagusState';
import { NavLink, useParams } from 'react-router-dom';
import { SarcophagusState } from 'types';
import { useAccount } from 'wagmi';
import { DetailsCollapse } from './DetailsCollapse';

export function Details() {
  const { id } = useParams();
  const { sarcophagus } = useGetSarcophagusDetails({ sarcoId: id });
  const { address } = useAccount();
  const { bury, isLoading, isBurying } = useBurySarcophagus(id || ethers.constants.HashZero);
  const resurrectionString = buildResurrectionDateString(
    sarcophagus?.resurrectionTime || BigNumber.from(0)
  );

  const sarcophagusState = getSarcophagusState(sarcophagus);

  // Determine if the rewrap and bury functions are available
  const canRewrapOrBury =
    sarcophagusState === SarcophagusState.Active && sarcophagus?.embalmerAddress === address;

  // Determine if the claim function is available
  const canClaim =
    sarcophagusState === SarcophagusState.Resurrected && sarcophagus.recipientAddress === address;

  function handleBury() {
    bury?.();
  }

  return (
    <Flex direction="column">
      <DetailsCollapse
        id={id}
        sarcophagus={sarcophagus}
      />
      <Text mt={6}>Resurrection Date</Text>
      <Text variant="secondary">{sarcophagus.resurrectionTime ? resurrectionString : '--'}</Text>

      <HStack pt={10}>
        {canRewrapOrBury && (
          <>
            {/* REWRAP BUTTON */}
            <Tooltip
              placement="top"
              label="Extend the resurrection date of the Sarcophagus"
            >
              <Button
                as={NavLink}
                to="?action=rewrap"
              >
                Rewrap
              </Button>
            </Tooltip>

            {/* BURY BUTTON */}
            <Tooltip
              placement="top"
              label="Deactivate this Sarcophagus so it can never be resurrected"
            >
              <Button
                onClick={handleBury}
                isLoading={isLoading}
                loadingText={isBurying ? 'Burying...' : undefined}
              >
                Bury
              </Button>
            </Tooltip>
          </>
        )}

        {/* CLAIM BUTTON */}
        {canClaim && (
          <Tooltip
            placement="top"
            label="Decrypt and download the Sarcophagus payload"
          >
            <Button
              as={NavLink}
              to="?action=claim"
            >
              Claim
            </Button>
          </Tooltip>
        )}
      </HStack>
    </Flex>
  );
}
