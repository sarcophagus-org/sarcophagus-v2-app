import {
  VStack,
  Text,
  Heading,
  Button,
  Box,
  FormControl,
  FormLabel,
  Input,
  Divider,
} from '@chakra-ui/react';

export function ThemeTestPage() {
  return (
    <VStack
      align="left"
      spacing={6}
    >
      {/* Text */}
      <Heading>This is a Heading</Heading>
      <Text>This is some primary text</Text>
      <Text variant="secondary">This is some secondary text</Text>
      <Divider />

      {/* Buttons */}
      <Button w={200}>Clicky Button</Button>
      <Button
        w={200}
        variant="link"
      >
        Clicky Link
      </Button>

      {/* Form */}
      <FormControl>
        <FormLabel>Input Label</FormLabel>
        <Input />
      </FormControl>

      <Box
        border="1px"
        py={12}
      >
        <Text align="center">Thing with a solid border</Text>
      </Box>
      <Box
        border="1px dashed"
        py={12}
      >
        <Text align="center">Thing with a dashed border</Text>
      </Box>
    </VStack>
  );
}
