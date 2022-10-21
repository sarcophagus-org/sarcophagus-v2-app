import { Flex, HStack, Spinner, Text } from '@chakra-ui/react';
import { Step } from 'store/embalm/reducer';
import { useSelector } from 'store/index';
import { useStepNavigator } from '../hooks/useStepNavigator';
import { StepStatusIndicator } from './StepStatusIndicator';
export interface StepProps {
  title: string;
  step: Step;
  isLoading?: boolean;
  isDisabled?: boolean;
}

export function StepElement({ title, step, isLoading, isDisabled }: StepProps) {
  const { getStatus, selectStep } = useStepNavigator();
  const status = getStatus(step);
  const { currentStep } = useSelector(x => x.embalmState);

  function handleSelect() {
    if (isDisabled) return;
    selectStep(step);
  }

  return (
    <HStack
      mb={6}
      onClick={handleSelect}
      justify="space-between"
    >
      <Flex
        align="center"
        cursor={!isDisabled ? 'pointer' : 'not-allowed'}
        _hover={
          !isDisabled
            ? {
                textDecoration: 'underline',
              }
            : {}
        }
      >
        <StepStatusIndicator
          status={status}
          index={step}
          isDisabled={isDisabled}
        />
        <Text
          color={currentStep !== step || isDisabled ? 'disabled' : 'brand.950'}
          align="left"
          ml={3}
        >
          {title}
        </Text>
        {isLoading && (
          <Spinner
            ml={3}
            size="xs"
          />
        )}
      </Flex>
    </HStack>
  );
}
