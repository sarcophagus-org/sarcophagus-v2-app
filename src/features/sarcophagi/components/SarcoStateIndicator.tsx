import { Text, Badge, Flex, Tooltip } from '@chakra-ui/react';
import { SarcophagusState } from 'types';

export const sarcoStateMap = {
  [SarcophagusState.DoesNotExist]: '',
  [SarcophagusState.Active]: 'Active',
  [SarcophagusState.Resurrecting]: 'Resurrecting',
  [SarcophagusState.Resurrected]: 'Resurrected',
  [SarcophagusState.Buried]: 'Buried',
  [SarcophagusState.Cleaned]: 'Cleaned',
  [SarcophagusState.Accused]: 'Accused',
  [SarcophagusState.Failed]: 'Failed',
  // All cleanable sarco will have a bright icon next to it indicating such.
  // Cleaned sarco (or sarco that were never cleanable) will not.
  [SarcophagusState.CleanedFailed]: 'Failed',
  [SarcophagusState.CleanedResurrected]: 'Resurrected',
};

interface SarcophagusStateIndicatorProps {
  state?: SarcophagusState;
}

// A component that displays the state of a sarcophagus in a chip
export function SarcoStateIndicator({
  state = SarcophagusState.Active,
}: SarcophagusStateIndicatorProps) {
  const failedTooltip =
    'Too few archeologists unwrapped the Sarcophagus. It can no longer be claimed.';
  const resurrectedTooltip = 'The Sarcophagus has been resurrected and can be claimed.';

  const stateMap: { [key: string]: { text?: string; bg?: string; tooltip?: string } } = {
    [SarcophagusState.Active]: {
      text: 'green',
      bg: 'transparent.green',
      tooltip: 'The Sarcophagus is on course to be resurrected.',
    },
    [SarcophagusState.Accused]: {
      text: 'red',
      bg: 'transparent.red',
      tooltip:
        'Too many of the archaeologists have leaked assigned keys. This Sarcophagus is compromised.',
    },
    [SarcophagusState.Cleaned]: {
      text: 'gray',
      bg: 'transparent.gray',
      tooltip: 'The Sarcophagus has been cleaned. No further action can be taken on it.',
    },
    [SarcophagusState.Failed]: {
      text: 'red',
      bg: 'transparent.red',
      tooltip: failedTooltip,
    },
    [SarcophagusState.CleanedFailed]: {
      text: 'grey',
      bg: 'brand.100',
      tooltip: '',
    },
    [SarcophagusState.Resurrecting]: {
      text: 'orange',
      bg: 'transparent.orange',
      tooltip:
        'The Sarcophagus resurrection time has passed and is within a grace period of unwrapping.',
    },
    [SarcophagusState.Resurrected]: {
      text: 'blue',
      bg: 'transparent.blue',
      tooltip: resurrectedTooltip,
    },
    [SarcophagusState.CleanedResurrected]: {
      text: 'blue',
      bg: 'transparent.blue',
      tooltip: resurrectedTooltip,
    },
    [SarcophagusState.Buried]: {
      text: 'gray',
      bg: 'transparent.gray',
      tooltip: 'The Sarcophagus has been deactivated. No further action can be taken on it.',
    },
    [SarcophagusState.DoesNotExist]: { text: 'gray', bg: 'transparent.gray' },
  };

  return (
    <Flex>
      <Tooltip
        placement="right-start"
        openDelay={700}
        isDisabled={!stateMap[state].tooltip}
        label={stateMap[state].tooltip}
      >
        <Badge
          bg={stateMap[state]?.bg}
          py="4px"
          px="12px"
          borderRadius={100}
          textTransform="capitalize"
          cursor={'pointer'}
        >
          <Text
            fontSize="xs"
            color={stateMap[state]?.text}
          >{`● ${sarcoStateMap[state]}`}</Text>
        </Badge>
      </Tooltip>
    </Flex>
  );
}
