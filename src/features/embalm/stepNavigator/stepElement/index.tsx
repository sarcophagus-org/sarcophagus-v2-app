import { Flex, Text } from '@chakra-ui/react';
import { StepStatus } from 'store/embalm/reducer';
import { StepStatusIndicator } from './StepStatusIndicator';

interface NavigationItemProps {
  title: string;
  subTitle: string;
  status: StepStatus;
  onClickStep: () => void;
}

export function StepElement({ title, subTitle, status, onClickStep }: NavigationItemProps) {
  return (
    <Flex
      onClick={onClickStep}
      opacity={status === StepStatus.NotStarted ? 0.5 : 1}
      cursor="pointer"
      _hover={{
        textDecoration: 'underline',
      }}
    >
      <StepStatusIndicator status={status} />
      <Flex
        ml={6}
        direction="column"
      >
        <Text noOfLines={1}>{title}</Text>
        <Text
          noOfLines={1}
          variant="secondary"
          mt={1}
        >
          {subTitle}
        </Text>
      </Flex>
    </Flex>
  );
}
