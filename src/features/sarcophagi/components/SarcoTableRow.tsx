import { EditIcon, InfoOutlineIcon } from '@chakra-ui/icons';
import { Button, HStack, IconButton, TableRowProps, Td, Text, Tooltip, Tr } from '@chakra-ui/react';
import { TableText } from 'components/TableText';
import { BigNumber } from 'ethers';
import { useCleanSarcophagus } from 'hooks/thirdPartyFacet/useCleanSarcophagus';
import { useGetEmbalmerCanClean } from 'hooks/viewStateFacet/useGetEmbalmerCanClean';
import { buildResurrectionDateString } from 'lib/utils/helpers';
import { useEffect, useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useSelector } from 'store/index';
import { Sarcophagus, SarcophagusState } from 'types';
import { useAccount } from 'wagmi';
import { cleanTooltip } from './CleanButton';
import { resurrectTooltip } from './Details';
import { SarcoStateIndicator } from './SarcoStateIndicator';

export enum SarcoAction {
  Rewrap = 'rewrap',
  Clean = 'clean',
  Claim = 'claim',
}

export interface SarcophagusTableRowProps extends TableRowProps {
  sarco: Sarcophagus;
  isClaimTab?: boolean;
  dateCalculationInterval?: number;
}

/**
 * Custom TableRow component to be used in place of the default Tr component. Adds a sort icon.
 */
export function SarcoTableRow({
  sarco,
  isClaimTab,
  dateCalculationInterval = 60_000,
}: SarcophagusTableRowProps) {
  const { address } = useAccount();
  const navigate = useNavigate();
  const { timestampMs } = useSelector(x => x.appState);

  const [resurrectionString, setResurrectionString] = useState('');

  // Payment for clean automatically goes to the current user
  const { clean, isCleaning } = useCleanSarcophagus(sarco.id);
  const canEmbalmerClean = useGetEmbalmerCanClean(sarco);

  // If we ever decide to add a dashboard for archaeologists that case will need to be considered
  // here.
  // This logic shows the actions a user can make on a sarcophagus regardless of which tab they are
  // on. If a user is both the embalmer and the recipient on a sarcohpagus, they will see both the
  // rewrap and resurrect actions on the "My Sarcophagi" tab and the "Claim Sarcophagi" tab.
  const isEmbalmer = sarco.embalmerAddress === address;
  const isRecipient = sarco.recipientAddress === address;

  const claimTooltip = 'Decrypt and download the Sarcophagus payload';

  const stateToActionMap: {
    [key: string]: {
      action?: SarcoAction;
      tooltip?: string;
    };
  } = {
    [SarcophagusState.Active]: {
      action: isEmbalmer && !isClaimTab ? SarcoAction.Rewrap : undefined,
      tooltip: isEmbalmer && !isClaimTab ? resurrectTooltip : '',
    },
    [SarcophagusState.Resurrected]: {
      // The embalmer isn't concerned with claiming a sarco. BUT, if they can clean a resurrected sarco,
      // that's something they care about. Otherwise we show the Claim action to the recipient.
      action: canEmbalmerClean
        ? SarcoAction.Clean
        : isRecipient && isClaimTab
        ? SarcoAction.Claim
        : undefined,
      tooltip: isRecipient && isClaimTab ? claimTooltip : '',
    },
    [SarcophagusState.CleanedResurrected]: {
      action: isRecipient && isClaimTab ? SarcoAction.Claim : undefined,
      tooltip: isRecipient && isClaimTab ? claimTooltip : '',
    },
    [SarcophagusState.Failed]: {
      action: canEmbalmerClean ? SarcoAction.Clean : undefined,
      tooltip: canEmbalmerClean ? cleanTooltip : '',
    },
  };

  const action = stateToActionMap[sarco.state]?.action;
  const actionTooltip = stateToActionMap[sarco.state]?.tooltip;

  function handleClickAction() {
    switch (action) {
      case SarcoAction.Rewrap:
        navigate(`${sarco.id}?action=rewrap`);
        break;
      case SarcoAction.Claim:
        navigate(`${sarco.id}?action=claim`);
        break;
      case SarcoAction.Clean:
        clean?.();
        break;
      default:
        break;
    }
  }

  // Updates the resurrection date string on an interval
  useEffect(() => {
    setResurrectionString(
      buildResurrectionDateString(sarco.resurrectionTime || BigNumber.from(0), timestampMs)
    );

    const intervalId = setInterval(() => {
      setResurrectionString(
        buildResurrectionDateString(sarco.resurrectionTime || BigNumber.from(0), timestampMs)
      );
    }, dateCalculationInterval);

    return () => {
      clearInterval(intervalId);
    };
  }, [dateCalculationInterval, sarco.resurrectionTime, timestampMs]);

  return (
    <Tr>
      {/* SARCO STATE */}
      <Td>
        <HStack>
          <SarcoStateIndicator state={sarco.state} />

          {/* Using `canEmbalmerClean` to draw attention to this row */}
          {canEmbalmerClean && (
            <Tooltip
              placement="right-start"
              label="You can clean this sarcophagus to claim back funds"
            >
              <InfoOutlineIcon color="orange" />
            </Tooltip>
          )}
        </HStack>
      </Td>

      {/* SARCO NAME */}
      <Td>
        <TableText>{sarco.name?.toUpperCase()}</TableText>
      </Td>

      {/* SARCO RESURRECTION */}
      <Td>
        <TableText>{resurrectionString}</TableText>
      </Td>

      {/* QUICK ACTION */}
      <Td textAlign="center">
        {action ? (
          <Tooltip
            isDisabled={!actionTooltip}
            openDelay={500}
            label={actionTooltip}
            placement="right-start"
          >
            <Button
              variant="link"
              onClick={handleClickAction}
              isLoading={isCleaning}
            >
              {action.toUpperCase()}
            </Button>
          </Tooltip>
        ) : (
          <Text>--</Text>
        )}
      </Td>

      {/* SARCO DETAILS LINK */}
      <Td textAlign="center">
        <IconButton
          as={NavLink}
          to={sarco.id || ''}
          aria-label="Details"
          variant="unstyled"
          icon={<EditIcon />}
        />
      </Td>
    </Tr>
  );
}
