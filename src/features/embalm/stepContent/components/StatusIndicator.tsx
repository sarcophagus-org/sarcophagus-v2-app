import { CheckIcon } from '@chakra-ui/icons';
import { Flex, Text } from '@chakra-ui/react';
import { StageStatus } from './ProgressTrackerStage';

interface StatusIndicatorProps {
  status: StageStatus;
  index: number;
}

export function StatusIndicator({ status, index }: StatusIndicatorProps) {
  const statusSize = '25px';

  const stageStatusMap = {
    [StageStatus.COMPLETE]: (
      <Flex
        h={statusSize}
        w={statusSize}
        border="1px solid"
        borderColor="blue"
        backgroundColor="blue"
        borderRadius={100}
        align="center"
        justifyContent="center"
      >
        <CheckIcon fontSize="xs" />
      </Flex>
    ),
    [StageStatus.IN_PROGRESS]: (
      <Flex
        h={statusSize}
        w={statusSize}
        border="1px solid"
        borderColor="brand.950"
        borderRadius={100}
        align="center"
        justifyContent="center"
      >
        <Text fontSize="sm">{index + 1}</Text>
      </Flex>
    ),
    [StageStatus.NOT_STARTED]: (
      <Flex
        h={statusSize}
        w={statusSize}
        border="1px solid"
        borderColor="brand.500"
        borderRadius={100}
        align="center"
        justifyContent="center"
      >
        <Text
          fontSize="sm"
          variant="secondary"
        >
          {index + 1}
        </Text>
      </Flex>
    ),
  };

  return stageStatusMap[status];
}
