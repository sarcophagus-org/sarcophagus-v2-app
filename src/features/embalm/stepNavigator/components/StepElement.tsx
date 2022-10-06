import { Center, Flex, Spinner, Text, HStack } from '@chakra-ui/react';
import { Step } from 'store/embalm/reducer';
import { useStepNavigator } from '../hooks/useStepNavigator';
import { StepStatusIndicator } from './StepStatusIndicator';
import { ChevronDownIcon, ChevronRightIcon } from '@chakra-ui/icons';
import { useSelector } from 'store/index';
interface StepProps {
  title: string;
  step: Step;
  isLoading?: boolean;
}

export function StepElement({ title, step, isLoading }: StepProps) {
  const { getStatus, selectStep } = useStepNavigator();
  const status = getStatus(step);
  const { currentStep } = useSelector(x => x.embalmState);

  function handleSelect() {
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
        cursor="pointer"
        _hover={{
          textDecoration: 'underline',
        }}
      >
        <StepStatusIndicator
          status={status}
          index={step}
        />
        <Text
          color={currentStep === step ? 'brand.950' : 'brand.400'}
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
      <Center
        h="24px"
        w="24px"
        borderRadius={100}
        cursor="pointer"
        _hover={{
          backgroundColor: 'brand.100',
        }}
      >
        {currentStep === step ? <ChevronRightIcon /> : <ChevronDownIcon />}
      </Center>
    </HStack>
  );
}
