import { Button, Flex, Spinner, Text } from '@chakra-ui/react';
import { StatusIndicator } from './StatusIndicator';
import { SummaryErrorIcon } from './SummaryErrorIcon';
import React from 'react';

export enum StageStatus {
  NOT_STARTED = 'NOT_STARTED',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETE = 'COMPLETE',
}

export interface ProgressTrackerStageProps {
  stageStatus?: StageStatus;
  index?: number;
  stageIndex: number;
  stageError?: string | undefined;
  retryStage?: () => void;
  children: React.ReactNode;
}

export function ProgressTrackerStage({
  stageStatus = StageStatus.NOT_STARTED,
  index = 0,
  children,
  stageError,
  retryStage,
}: ProgressTrackerStageProps) {
  // Checks that children is a string. If we don't do this and someone tries to put a non-text thing
  // in the <Text> tag, an error will be thrown in the console but that error is easier to miss and
  // harder to debug.
  if (typeof children !== 'string') {
    throw new Error('ProgressTrackerStage children must be a string');
  }

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
      {stageStatus === StageStatus.IN_PROGRESS &&
        (stageError ? (
          <Flex alignItems="center">
            <Button
              size="xs"
              variant="outline"
              py="11px"
              px="13px"
              mr="15px"
              onClick={retryStage}
            >
              Retry
            </Button>
            <SummaryErrorIcon error={stageError} />
          </Flex>
        ) : (
          <Spinner size="sm" />
        ))}
      {/* If we want to show additional information on the stage, we can conditionally add it here. */}
    </Flex>
  );
}
