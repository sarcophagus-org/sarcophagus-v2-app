import { Button, Flex, HStack, Text, Tooltip } from '@chakra-ui/react';
import { BigNumber } from 'ethers';
import { useGetSarcophagus } from 'hooks/viewStateFacet';
import { buildResurrectionDateString } from 'lib/utils/helpers';
import { NavLink, useParams } from 'react-router-dom';
import { SarcophagusState } from 'types';
import { useAccount } from 'wagmi';
import { BuryButton } from './BuryButton';
import { DetailsCollapse } from './DetailsCollapse';

export function Details() {
  const { id } = useParams();
  const { sarcophagus } = useGetSarcophagus(id);
  const { address } = useAccount();
  const resurrectionString = buildResurrectionDateString(
    sarcophagus?.resurrectionTime || BigNumber.from(0)
  );

  // TODO: Find a way to recalculate canWrapOrBury when bury happens
  // Determine if the rewrap and bury functions are available
  const canRewrapOrBury =
    sarcophagus?.state === SarcophagusState.Active && sarcophagus?.embalmerAddress === address;

  // Determine if the claim function is available
  const canClaim =
    sarcophagus?.state === SarcophagusState.Resurrected && sarcophagus.recipientAddress === address;

  return (
    <Flex direction="column">
      {sarcophagus && (
        <DetailsCollapse
          id={id}
          sarcophagus={sarcophagus}
        />
      )}
      <Text mt={6}>Resurrection Date</Text>
      <Text variant="secondary">{sarcophagus?.resurrectionTime ? resurrectionString : '--'}</Text>

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
            <BuryButton id={id} />
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
