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
  // TODO: Will need a way to convey this info more appropriately
  [SarcophagusState.CleanedFailed]: 'Failed',
  [SarcophagusState.CleanedResurrected]: 'Resurrected',
};

interface SarcophagusStateIndicatorProps {
  state?: SarcophagusState;
  tooltip?: string;
}

// A component that displays the state of a sarcophagus in a chip
export function SarcoStateIndicator({
  state = SarcophagusState.Active,
  tooltip = '',
}: SarcophagusStateIndicatorProps) {
  const stateColorMap: { [key: string]: { text: string; bg: string } } = {
    [SarcophagusState.Active]: { text: 'green', bg: 'transparent.green' },
    [SarcophagusState.Failed]: { text: 'red', bg: 'transparent.red' },
    [SarcophagusState.CleanedFailed]: { text: 'red', bg: 'transparent.red' },
    [SarcophagusState.Resurrecting]: { text: 'orange', bg: 'transparent.orange' },
    [SarcophagusState.Resurrected]: { text: 'blue', bg: 'transparent.blue' },
    [SarcophagusState.CleanedResurrected]: { text: 'blue', bg: 'transparent.blue' },
    [SarcophagusState.Buried]: { text: 'gray', bg: 'transparent.gray' },
    [SarcophagusState.DoesNotExist]: { text: 'gray', bg: 'transparent.gray' },
  };

  return (
    <Flex>
      <Tooltip
        placement="right-start"
        openDelay={700}
        isDisabled={!tooltip}
        label={tooltip}
      >
        <Badge
          bg={stateColorMap[state]?.bg}
          py="4px"
          px="12px"
          borderRadius={100}
          textTransform="capitalize"
          cursor={'pointer'}
        >
          <Text
            fontSize="xs"
            color={stateColorMap[state]?.text}
          >{`● ${sarcoStateMap[state]}`}</Text>
        </Badge>
      </Tooltip>
    </Flex>
  );
}
