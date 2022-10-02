import { Text, Flex } from '@chakra-ui/react';
import { StepStatus } from 'store/embalm/reducer';

interface StepStatusIndicatorProps {
  status: StepStatus;
  index: number;
}

export function StepStatusIndicator({ status, index }: StepStatusIndicatorProps) {
  const statusSize = '25px';

  const stepStatusMap = {
    [StepStatus.Complete]: (
      <Flex
        h={statusSize}
        w={statusSize}
        border="1px solid"
        borderColor="brand.950"
        backgroundColor="brand.950"
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
        borderColor="brand.950"
        borderRadius={100}
        align="center"
        justifyContent="center"
      >
        <Text fontSize="xs">{index + 1}</Text>
      </Flex>
    ),
    [StepStatus.NotStarted]: (
      <Flex
        h={statusSize}
        w={statusSize}
        border="1px solid"
        borderColor="brand.950"
        borderRadius={100}
        align="center"
        justifyContent="center"
      >
        <Text fontSize="xs">{index + 1}</Text>
      </Flex>
    ),
  };

  return stepStatusMap[status];
}
