import { Flex, Text } from '@chakra-ui/react';
import { StepStatus } from 'store/embalm/reducer';
import { StepStatusIndicator } from './StepStatusIndicator';

interface NavigationItemProps {
  title: string;
  index: number;
  status: StepStatus;
  onClickStep: () => void;
}

export function StepElement({ title, index, status, onClickStep }: NavigationItemProps) {
  return (
    <Flex
      onClick={onClickStep}
      opacity={status === StepStatus.NotStarted ? 0.5 : 1}
      cursor="pointer"
      _hover={{
        textDecoration: 'underline',
      }}
    >
      <StepStatusIndicator
        status={status}
        index={index}
      />
      <Flex
        ml={6}
        direction="column"
      >
        <Text noOfLines={1}>{title}</Text>
      </Flex>
    </Flex>
  );
}
