import { Flex, Tab, TabProps } from '@chakra-ui/react';

// The tab component used in the sarcophagi component as part of the tabs panel
export function SarcoTab({ children, ...props }: TabProps) {
  return (
    <Tab
      py={4}
      bg="linear-gradient(180deg, rgba(255, 255, 255, 0) 0%, rgba(255, 255, 255, 0.09) 100%);"
      border="1px solid"
      borderColor="whiteAlpha.300"
      borderRadius={0}
      _selected={{
        bg: 'none',
        border: 'none',
        borderColor: 'black',
      }}
      {...props}
    >
      <Flex>{children}</Flex>
    </Tab>
  );
}
