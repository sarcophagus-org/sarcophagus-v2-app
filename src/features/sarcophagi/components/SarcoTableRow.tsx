import { ExternalLinkIcon } from '@chakra-ui/icons';
import { Button, IconButton, TableRowProps, Td, Text, Tr } from '@chakra-ui/react';
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
  const stateActionMap: { [key: string]: SarcoAction | undefined } = {
    [SarcophagusState.Active]: isEmbalmer ? SarcoAction.Rewrap : undefined,
    [SarcophagusState.Failed]: SarcoAction.Clean,
    [SarcophagusState.Resurrected]: !isRecipient ? SarcoAction.Claim : undefined,
  };

  // TODO: Remove console logs and navigate to the appropriate page including the sarcoId
  function handleClickAction() {
    const action = stateActionMap[sarco.state];
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
      <Td>
        <SarcoStateIndicator state={sarco.state} />
      </Td>
      <Td>
        <TableText>{sarco.name?.toUpperCase()}</TableText>
      </Td>
      <Td>
        <TableText>{resurrectionString}</TableText>
      </Td>
      <Td textAlign="center">
        {stateActionMap[sarco.state] ? (
          <Button
            variant="link"
            onClick={handleClickAction}
            isLoading={isLoading || isCleaning}
          >
            {stateActionMap[sarco.state]?.toUpperCase() || '--'}
          </Button>
        ) : (
          <Text>--</Text>
        )}
      </Td>
      <Td textAlign="center">
        <IconButton
          as={NavLink}
          to={sarco.id || ''}
          aria-label="Details"
          variant="unstyled"
          icon={<ExternalLinkIcon />}
        />
      </Td>
    </Tr>
  );
}
