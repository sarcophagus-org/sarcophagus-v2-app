import { Flex, Spinner, Text } from '@chakra-ui/react';
import { StatusIndicator } from './StatusIndicator';

export enum StageStatus {
  NOT_STARTED = 'NOT_STARTED',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETE = 'COMPLETE',
}

export interface ProgressTrackerStageProps {
  stageStatus?: StageStatus;
  index?: number;
  children: React.ReactNode;
}

export function ProgressTrackerStage({
  stageStatus = StageStatus.NOT_STARTED,
  index = 0,
  children,
}: ProgressTrackerStageProps) {
  return (
    <Flex
      alignItems="center"
      justifyContent="space-between"
    >
      <Flex>
        <StatusIndicator
          status={stageStatus}
          index={index}
        />
        <Text
          ml={3}
          fontSize="md"
          color={stageStatus === StageStatus.NOT_STARTED ? 'brand.500' : 'brand.950'}
        >
          {children}
        </Text>
      </Flex>
      {stageStatus === StageStatus.IN_PROGRESS && <Spinner size="sm" />}
      {/* If we want to show additional information on the stage, we can conditionally add it here. */}
    </Flex>
  );
}
