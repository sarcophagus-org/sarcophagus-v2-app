import { ExternalLinkIcon } from '@chakra-ui/icons';
import { Button, IconButton, TableRowProps, Td, Text, Tr } from '@chakra-ui/react';
import { TableText } from 'components/TableText';
import { BigNumber } from 'ethers';
import { buildResurrectionDateString } from 'lib/utils/helpers';
import { Sarcophagus } from 'types';
import { useAccount } from 'wagmi';
import { SarcoState, SarcoStateIndicator } from './SarcoStateIndicator';

export enum SarcoAction {
  Rewrap = 'rewrap',
  Clean = 'clean',
  Resurrect = 'resurrect',
}

// Temporary function that picks a random sarcophagus state
// TODO: Remove this function
function getSarcophagusState(): SarcoState {
  const states = Object.values(SarcoState);
  const randomIndex = Math.floor(Math.random() * states.length);
  return states[randomIndex];
}

export interface SarcophagusTableRowProps extends TableRowProps {
  sarco: Sarcophagus;
}

/**
 * Custom TableRow component to be used in place of the default Tr component. Adds a sort icon.
 */
export function SarcoTableRow({ sarco }: SarcophagusTableRowProps) {
  const { address } = useAccount();

  const state = getSarcophagusState();

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
    [SarcoState.Active]: isEmbalmer ? SarcoAction.Rewrap : undefined,
    [SarcoState.Failed]: SarcoAction.Clean,
    [SarcoState.Resurrecting]: !isRecipient ? SarcoAction.Resurrect : undefined,
  };

  // TODO: Remove console logs and navigate to the appropriate page including the sarcoId
  function handleClickAction() {
    const action = stateActionMap[state];
    switch (action) {
      case SarcoAction.Rewrap:
        console.log(`Clicked rewrap on ${sarco.id}`);
        break;
      case SarcoAction.Resurrect:
        console.log(`Clicked resurrect on ${sarco.id}`);
        break;
      case SarcoAction.Clean:
        console.log(`Clicked clean on ${sarco.id}`);
        break;
      default:
        break;
    }
  }

  // TODO: Remove console log and navigate to the appropriate page including the sarcoId
  function handleClickDetails() {
    console.log(`Clicked details on ${sarco.id}`);
  }

  return (
    <Tr>
      <Td>
        <SarcoStateIndicator state={state} />
      </Td>
      <Td>
        <TableText>{sarco.name.toUpperCase()}</TableText>
      </Td>
      <Td>
        <TableText>{resurrectionString}</TableText>
      </Td>
      <Td textAlign="center">
        {stateActionMap[state] ? (
          <Button
            variant="link"
            onClick={handleClickAction}
          >
            {stateActionMap[state]?.toUpperCase() || '--'}
          </Button>
        ) : (
          <Text>--</Text>
        )}
      </Td>
      <Td textAlign="center">
        <IconButton
          aria-label="Details"
          variant="unstyled"
          onClick={handleClickDetails}
          icon={<ExternalLinkIcon />}
        />
      </Td>
    </Tr>
  );
}
