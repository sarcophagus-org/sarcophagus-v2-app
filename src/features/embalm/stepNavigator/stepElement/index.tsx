import {
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Center,
  Flex,
  Text,
} from '@chakra-ui/react';
import { StepStatus } from 'store/embalm/reducer';
import { StepStatusIndicator } from './StepStatusIndicator';

interface NavigationItemProps {
  title: string;
  index: number;
  status: StepStatus;
  onClickStep: () => void;
  onClickExpand?: () => void;
}

export function StepElement({
  title,
  index,
  status,
  onClickStep,
  onClickExpand,
}: NavigationItemProps) {
  function handleClickExpand(e: React.MouseEvent<HTMLDivElement>) {
    // Prevents the step from being selected
    e.stopPropagation();
    onClickExpand?.();
  }

  return (
    <AccordionItem
      opacity={status === StepStatus.NotStarted ? 0.5 : 1}
      border="none"
      mb={3}
    >
      <AccordionButton
        px={0}
        justifyContent="space-between"
        cursor="default"
      >
        <Flex
          onClick={onClickStep}
          cursor="pointer"
          _hover={{
            textDecoration: 'underline',
          }}
        >
          <StepStatusIndicator
            status={status}
            index={index}
          />
          <Text
            align="left"
            ml={3}
          >
            {title}
          </Text>
        </Flex>
        <Center
          h="24px"
          w="24px"
          borderRadius={100}
          onClick={handleClickExpand}
          cursor="pointer"
          _hover={{
            backgroundColor: 'brand.100',
          }}
        >
          <AccordionIcon color="brand.300" />
        </Center>
      </AccordionButton>
      <AccordionPanel>Hello?</AccordionPanel>
    </AccordionItem>
  );
}
