import { EditIcon } from '@chakra-ui/icons';
import { Button, IconButton, TableRowProps, Td, Text, Tooltip, Tr } from '@chakra-ui/react';
import { TableText } from 'components/TableText';
import { BigNumber } from 'ethers';
import { useCleanSarcophagus } from 'hooks/thirdPartyFacet/useCleanSarcophagus';
import { buildResurrectionDateString } from 'lib/utils/helpers';
import { NavLink, useNavigate } from 'react-router-dom';
import { Sarcophagus, SarcophagusState } from 'types';
import { useAccount } from 'wagmi';
import { SarcoStateIndicator } from './SarcoStateIndicator';

export enum SarcoAction {
  Rewrap = 'rewrap',
  Clean = 'clean',
  Claim = 'claim',
}

export interface SarcophagusTableRowProps extends TableRowProps {
  sarco: Sarcophagus;
}

/**
 * Custom TableRow component to be used in place of the default Tr component. Adds a sort icon.
 */
export function SarcoTableRow({ sarco }: SarcophagusTableRowProps) {
  const { address } = useAccount();
  const navigate = useNavigate();

  // Payment for clean automacally goes to the current user
  const { clean, isLoading, isCleaning } = useCleanSarcophagus(sarco.id, address);

  const resurrectionString = buildResurrectionDateString(
    sarco.resurrectionTime || BigNumber.from(0)
  );

  // If we ever decide to add a dashboard for archaeologists that case will need to be considered
  // here.
  // This logic shows the actions a user can make on a sarcophagus regardless of which tab they are
  // on. If a user is both the embalmer and the recipient on a sarcohpagus, they will see both the
  // rewrap and resurrect actions on the "My Sarcohagi" tab and the "Claim Sarcohpagi" tab.
  const isEmbalmer = sarco.embalmer === address;
  const isRecipient = sarco.recipientAddress === address;

  const stateToActionMap: {
    [key: string]: {
      action?: SarcoAction;
      tooltip?: string;
      stateTooltip: string;
    };
  } = {
    [SarcophagusState.Active]: {
      action: isEmbalmer ? SarcoAction.Rewrap : undefined,
      tooltip: 'Extend the resurrection date of the Sarcophagus',
      stateTooltip: 'The Sarcophagus is on course to be resurrected',
    },
    [SarcophagusState.Failed]: {
      action: SarcoAction.Clean,
      tooltip: 'Clean sarco',
      stateTooltip: 'Too few archeologists unwrapped the Sarcophagus. It can no longer be claimed.',
    },
    [SarcophagusState.Resurrected]: {
      action: !isRecipient ? SarcoAction.Claim : undefined,
      tooltip: !isRecipient ? 'Decrypt and download the Sarcophagus payload' : '',
      stateTooltip: 'The Sarcophagus has been resurrected can be claimed',
    },
    [SarcophagusState.Accused]: {
      stateTooltip:
        'Too many of the archaeologists have leaked assigned keys. This Sarcophagus is compromised.',
    },
    [SarcophagusState.Buried]: {
      stateTooltip: 'The Sarcophagus has been deactivated. No further action can be taken on it.',
    },
    [SarcophagusState.Cleaned]: {
      stateTooltip: 'The Sarcophagus has been deactivated. No further action can be taken on it.',
    },
    [SarcophagusState.Resurrecting]: {
      stateTooltip:
        'The Sarcophagus resurrection time has passed and is within a grace period of unwrapping',
    },
  };

  const action = stateToActionMap[sarco.state]?.action;
  const actionTooltip = stateToActionMap[sarco.state]?.tooltip;
  const stateTooltip = stateToActionMap[sarco.state]?.stateTooltip;

  // TODO: Remove console logs and navigate to the appropriate page including the sarcoId
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

  return (
    <Tr>
      {/* SARCO STATE */}
      <Td>
        <SarcoStateIndicator
          state={sarco.state}
          tooltip={stateTooltip}
        />
      </Td>

      {/* SARCO NAME */}
      <Td>
        <TableText>{sarco.name?.toUpperCase()}</TableText>
      </Td>

      {/* SARCO RESURRETION */}
      <Td>
        <TableText>{resurrectionString}</TableText>
      </Td>

      {/* QUICK ACTION */}
      <Td textAlign="center">
        {stateToActionMap[sarco.state] ? (
          <Tooltip
            isDisabled={!actionTooltip}
            openDelay={500}
            label={actionTooltip}
            placement="right-start"
          >
            <Button
              variant="link"
              onClick={handleClickAction}
              isLoading={isLoading || isCleaning}
            >
              {action?.toUpperCase() || '--'}
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
