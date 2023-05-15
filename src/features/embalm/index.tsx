import { Flex, Heading } from '@chakra-ui/react';
import { MagicFormFiller } from 'components/MagicFormFiller';
import { StepContent } from 'features/embalm/stepContent';
import { useLoadArchaeologists } from './stepContent/hooks/useLoadArchaeologists';
import { StepNavigator } from './stepNavigator';

// Set to true to remove the magic form filler button on the top right
const hideMagicFormFiller = false;

export function Embalm() {
  useLoadArchaeologists();

  return (
    <Flex
      minWidth="500px"
      direction="column"
      height="100%"
    >
      {process.env.NODE_ENV === 'development' && !hideMagicFormFiller && <MagicFormFiller />}

      {/* Upper section with title */}
      <Heading pb="48px">New Sarcophagus</Heading>

      {/* Lower section with content */}
      <Flex
        flex={1}
        direction="row"
        height="100%"
        width="100%"
      >
        {/* Left side container */}
        <Flex
          minWidth={300}
          maxWidth={300}
        >
          <StepNavigator />
        </Flex>

        {/* Space between */}
        <Flex minWidth={{ xl: '100px', lg: 0 }} />

        {/* Right side container */}
        <Flex flex={1}>
          <StepContent />
        </Flex>
      </Flex>
    </Flex>
  );
}
