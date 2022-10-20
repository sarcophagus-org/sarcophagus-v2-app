import { Text, Flex } from '@chakra-ui/react';
import { StepStatus } from 'store/embalm/reducer';

interface StepStatusIndicatorProps {
  status: StepStatus;
  index: number;
  isDisabled?: boolean;
}

export function StepStatusIndicator({ status, index, isDisabled }: StepStatusIndicatorProps) {
  const statusSize = '25px';

  const stepStatusMap = {
    [StepStatus.Complete]: (
      <Flex
        h={statusSize}
        w={statusSize}
        border="1px solid"
        borderColor={isDisabled ? 'brand.400' : 'brand.950'}
        backgroundColor={isDisabled ? 'brand.400' : 'brand.950'}
        borderRadius={100}
        align="center"
        justifyContent="center"
      >
        <Text
          color="brand.0"
          fontSize="xs"
        >
          {index + 1}
        </Text>
      </Flex>
    ),
    [StepStatus.Started]: (
      <Flex
        h={statusSize}
        w={statusSize}
        border="1px solid"
        borderColor={isDisabled ? 'brand.400' : 'brand.950'}
        borderRadius={100}
        align="center"
        justifyContent="center"
      >
        <Text
          fontSize="xs"
          color={isDisabled ? 'brand.400' : 'brand.950'}
        >
          {index + 1}
        </Text>
      </Flex>
    ),
    [StepStatus.NotStarted]: (
      <Flex
        h={statusSize}
        w={statusSize}
        border="1px solid"
        borderColor={isDisabled ? 'brand.400' : 'brand.400'}
        borderRadius={100}
        align="center"
        justifyContent="center"
      >
        <Text
          fontSize="xs"
          color={isDisabled ? 'brand.400' : 'brand.950'}
        >
          {index + 1}
        </Text>
      </Flex>
    ),
  };

  return stepStatusMap[status];
}
