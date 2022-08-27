import { Flex } from '@chakra-ui/react';
import { StepStatus } from 'store/embalm/reducer';

interface StepStatusIndicatorProps {
  status: StepStatus;
}

export function StepStatusIndicator({ status }: StepStatusIndicatorProps) {
  const stepStatusMap = {
    [StepStatus.Complete]: (
      <Flex
        h="20px"
        w="20px"
        border="1px solid"
        borderColor="brand.950"
        backgroundColor="brand.500"
        borderRadius={100}
      />
    ),
    [StepStatus.Started]: (
      <Flex
        h="20px"
        w="20px"
        border="1px solid"
        borderColor="brand.950"
        borderRadius={100}
      />
    ),
    [StepStatus.NotStarted]: (
      <Flex
        h="20px"
        w="20px"
        border="1px solid"
        borderColor="brand.950"
        borderRadius={100}
      />
    ),
  };

  return stepStatusMap[status];
}
