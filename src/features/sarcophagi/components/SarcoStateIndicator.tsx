import { Text, Badge } from '@chakra-ui/react';

// TODO: Tempory enum until we get real sarco states
export enum SarcoState {
  Active = 'active',
  Failed = 'failed',
  Resurrecting = 'resurrecting',
  Resurrected = 'resurrected',
  Buried = 'buried',
}

interface SarcophagusStateIndicatorProps {
  state?: SarcoState;
}

// A component that displays the state of a sarcophagus in a chip
export function SarcoStateIndicator({ state = SarcoState.Active }: SarcophagusStateIndicatorProps) {
  // TODO: Tempory map until we get real sarco states
  const stateColorMap: { [key: string]: { text: string; bg: string } } = {
    [SarcoState.Active]: { text: 'green', bg: 'greenBg' },
    [SarcoState.Failed]: { text: 'red', bg: 'redBg' },
    [SarcoState.Resurrecting]: { text: 'yellow', bg: 'yellowBg' },
    [SarcoState.Resurrected]: { text: 'controversialBlue', bg: 'blueBg' },
    [SarcoState.Buried]: { text: 'whiteAlpha.600', bg: 'whiteAlpha.300' },
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
      >{`● ${state}`}</Text>
    </Badge>
  );
}
