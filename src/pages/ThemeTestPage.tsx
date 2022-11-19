import {
  Box,
  Button,
  Divider,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Text,
  VStack,
} from '@chakra-ui/react';
import { SarcoAlert } from 'components/SarcoAlert';

export function ThemeTestPage() {
  return (
    <VStack
      align="left"
      spacing={6}
      mb={200}
    >
      <Heading>Alerts</Heading>

      <SarcoAlert
        status="success"
        title="Title goes here"
      >
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus vel velit eleifend, posuere
        nisi sed, condimentum dolor. Nullam laoreet odio non tortor vestibulum, vitae fringilla quam
        porta.
      </SarcoAlert>

      <SarcoAlert status="success">
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus vel velit eleifend, posuere
        nisi sed, condimentum dolor. Nullam laoreet odio non tortor vestibulum, vitae fringilla quam
        porta.
      </SarcoAlert>

      <SarcoAlert
        status="info"
        title="info Title"
      >
        xxx<Button>Clicky Button</Button>xxx
      </SarcoAlert>

      <SarcoAlert
        status="warning"
        title="Warning Title"
      >
        <Text>text in a text tag goes here</Text>
      </SarcoAlert>

      <SarcoAlert
        status="error"
        title="Error Title"
      >
        This is the error message
      </SarcoAlert>

      <SarcoAlert status="error">
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus vel velit eleifend, posuere
        nisi sed, condimentum dolor. Nullam laoreet odio non tortor vestibulum, vitae fringilla quam
        porta.
      </SarcoAlert>

      <Heading>This is a Heading</Heading>
      <Text>This is some primary text</Text>
      <Text variant="secondary">This is some secondary text</Text>
      <Button
        w={200}
        variant="link"
      >
        A Clicky Link
      </Button>

      <Divider />

      {/* <Heading>Toasts</Heading>
      <HStack spacing={3}>
        <Button
          w={200}
          onClick={handleClickInfo}
        >
          Info
        </Button>
        <Button
          w={200}
          onClick={handleClickSuccess}
        >
          Success
        </Button>
        <Button
          w={200}
          onClick={handleClickWarning}
        >
          Warning
        </Button>
        <Button
          w={200}
          onClick={handleClickError}
        >
          Error
        </Button>
      </HStack> */}

      <Divider />
      <Heading>Form</Heading>
      <FormControl>
        <FormLabel>Input Label</FormLabel>
        <Input />
      </FormControl>

      <Box
        border="1px"
        py={12}
      >
        <Text align="center">Thing with a border</Text>
      </Box>
      <Box
        border="2px"
        color="violet.800"
        py={12}
      >
        <Text align="center">Thing with a secondary border</Text>
      </Box>
    </VStack>
  );
}
