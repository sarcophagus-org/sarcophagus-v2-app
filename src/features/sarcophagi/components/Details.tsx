import { Button, Flex, HStack, Text, Tooltip } from '@chakra-ui/react';
import { BigNumber } from 'ethers';
import { useGetEmbalmerCanClean } from 'hooks/viewStateFacet/useGetEmbalmerCanClean';
import { buildResurrectionDateString } from 'lib/utils/helpers';
import { NavLink, useParams } from 'react-router-dom';
import { useSelector } from 'store/index';
import { useAccount } from 'wagmi';
import { BuryButton } from './BuryButton';
import { CleanButton } from './CleanButton';
import { DetailsCollapse } from './DetailsCollapse';
import { SarcophagusState } from 'sarcophagus-v2-sdk';
import { useGetSarcophagusDetails } from 'hooks/useGetSarcophagusDetails';

export const resurrectTooltip = 'Extend the resurrection date of the Sarcophagus';

export function Details() {
  const { id } = useParams();
  const { address } = useAccount();
  const { timestampMs } = useSelector(x => x.appState);

  const { sarcophagus } =  useGetSarcophagusDetails(id);

  const resurrectionString = buildResurrectionDateString(
    sarcophagus?.resurrectionTime || BigNumber.from(0),
    timestampMs
  );

  // TODO: Find a way to recalculate canWrapOrBury when bury happens
  // Determine if the rewrap and bury functions are available
  const canRewrapOrBury =
    sarcophagus?.state === SarcophagusState.Active && sarcophagus?.embalmerAddress === address;

  const canClaim =
    sarcophagus?.state === SarcophagusState.Resurrected ||
    sarcophagus?.state === SarcophagusState.CleanedResurrected;
  const canEmbalmerClean = useGetEmbalmerCanClean(sarcophagus);

  return (
    <Flex
      pb={100}
      direction="column"
    >
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
              label={resurrectTooltip}
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

        {/* CLEAN BUTTON */}
        {canEmbalmerClean && !!sarcophagus && <CleanButton sarco={sarcophagus} />}
      </HStack>
    </Flex>
  );
}
