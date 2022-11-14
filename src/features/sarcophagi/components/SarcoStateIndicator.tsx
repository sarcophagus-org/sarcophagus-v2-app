import { Text, Badge, Flex } from '@chakra-ui/react';
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
};

interface SarcophagusStateIndicatorProps {
  state?: SarcophagusState;
}

// A component that displays the state of a sarcophagus in a chip
export function SarcoStateIndicator({
  state = SarcophagusState.Active,
}: SarcophagusStateIndicatorProps) {
  const stateColorMap: { [key: string]: { text: string; bg: string } } = {
    [SarcophagusState.Active]: { text: 'green', bg: 'greenBg' },
    [SarcophagusState.Failed]: { text: 'red', bg: 'redBg' },
    [SarcophagusState.Resurrecting]: { text: 'yellow', bg: 'yellowBg' },
    [SarcophagusState.Resurrected]: { text: 'controversialBlue', bg: 'blueBg' },
    [SarcophagusState.Buried]: { text: 'whiteAlpha.600', bg: 'whiteAlpha.300' },
  };

  return (
    <Flex>
      <Badge
        bg={stateColorMap[state].bg}
        py="4px"
        px="12px"
        borderRadius={100}
        textTransform="capitalize"
      >
        <Text
          fontSize="xs"
          color={stateColorMap[state].text}
        >{`● ${sarcoStateMap[state]}`}</Text>
      </Badge>
    </Flex>
  );
}
