import { VStack, Text, Heading, Button } from '@chakra-ui/react';

export function ThemeTestPage() {
  return (
    <VStack
      align="left"
      spacing={6}
    >
      {/* <Heading style={{ fontSize: 24 }}>Header test</Heading> */}
      <Heading>This is a Header</Heading>
      <Text>This is some primary text</Text>
      <Text variant="secondary">This is some secondary text</Text>
      <Button w={200}>Clicky Button</Button>
      <Button
        w={200}
        variant="link"
      >
        Clicky Link
      </Button>
    </VStack>
  );
}
