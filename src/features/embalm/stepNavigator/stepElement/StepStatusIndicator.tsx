import { Flex } from '@chakra-ui/react';
import { StepStatus } from 'store/embalm/reducer';

interface StepStatusIndicatorProps {
  status: StepStatus;
  index: number;
}

export function StepStatusIndicator({ status, index }: StepStatusIndicatorProps) {
  const stepStatusMap = {
    [StepStatus.Complete]: (
      <Flex
        h="24px"
        w="24px"
        border="1px solid"
        borderColor="brand.950"
        backgroundColor="brand.950"
        borderRadius={100}
        align="center"
        justifyContent="center"
        color="brand.0"
      >
        {index}
      </Flex>
    ),
    [StepStatus.Started]: (
      <Flex
        h="24px"
        w="24px"
        border="1px solid"
        borderColor="brand.950"
        borderRadius={100}
        align="center"
        justifyContent="center"
      >
        {index}
      </Flex>
    ),
    [StepStatus.NotStarted]: (
      <Flex
        h="24px"
        w="24px"
        border="1px solid"
        borderColor="brand.950"
        borderRadius={100}
        align="center"
        justifyContent="center"
      >
        {index}
      </Flex>
    ),
  };

  return stepStatusMap[status];
}
