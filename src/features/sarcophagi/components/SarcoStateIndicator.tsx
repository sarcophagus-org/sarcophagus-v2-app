import { Text, Badge } from '@chakra-ui/react';
import { SarcophagusState } from 'types';
import { sarcoStateMap } from 'lib/utils/helpers';

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
  );
}
