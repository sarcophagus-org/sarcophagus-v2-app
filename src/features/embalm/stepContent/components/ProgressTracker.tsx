import { Flex, Text, VStack } from '@chakra-ui/react';
import React, { FunctionComponentElement } from 'react';
import { ProgressTrackerStageProps, StageStatus } from './ProgressTrackerStage';
import { CreateSarcophagusStage } from '../utils/createSarcophagus';

interface ProgressTrackerProps {
  title: string;
  currentStage: number;
  stageError: string | undefined;
  children: FunctionComponentElement<ProgressTrackerStageProps>[];
}

export function ProgressTracker({
  title,
  currentStage,
  stageError,
  children,
}: ProgressTrackerProps) {
  // Determine the current stage status using the stage of a child and the current stage passed on a
  // prop.
  function getStageStatus(stage: CreateSarcophagusStage): StageStatus {
    if (currentStage < stage) {
      return StageStatus.NOT_STARTED;
    } else if (currentStage === stage) {
      return StageStatus.IN_PROGRESS;
    } else {
      return StageStatus.COMPLETE;
    }
  }

  // Determines the stage status and manually adds the stageStatus prop to each child
  // https://stackoverflow.com/a/32371612/9285856
  const childrenWithProps = React.Children.map(children, (child, index) => {
    if (React.isValidElement(child)) {
      return React.cloneElement<ProgressTrackerStageProps>(child, {
        // index is a number but is being used as a value of the CreateSarcophagusStage enum
        stageStatus: getStageStatus(
          currentStage === CreateSarcophagusStage.SUBMIT_SARCOPHAGUS ? index + 2 : index + 1
        ),
        index,
        stageError,
      });
    }
    return child;
  });

  return (
    <Flex
      border="1px solid"
      borderColor="brand.100"
      flexDirection="column"
    >
      <Flex
        justifyContent="center"
        py={4}
        background="linear-gradient(180deg, rgba(255, 255, 255, 0.045) 0%, rgba(255, 255, 255, 0.09) 100%)"
      >
        <Text fontWeight="bold">{title}</Text>
      </Flex>
      <VStack
        flexDirection="column"
        align="left"
        p={4}
        spacing={5}
      >
        {childrenWithProps}
      </VStack>
    </Flex>
  );
}
