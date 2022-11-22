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
  HStack,
} from '@chakra-ui/react';
import { SarcoAlert } from 'components/SarcoAlert';
import { useSarcoToast } from 'components/SarcoToast';

export function ThemeTestPage() {
  const sarcoToast = useSarcoToast();

  function handleClickInfo() {
    sarcoToast.open({ title: 'Info Title', status: 'info', description: 'Info description here' });
  }

  function handleClickSuccess() {
    sarcoToast.open({
      title: 'Success Title Here',
      status: 'success',
      description: 'This is a success',
      duration: 1000,
      position: 'top',
    });
  }

  function handleClickWarning() {
    sarcoToast.open({
      title: 'Warning',
      status: 'warning',
      duration: null,
      isClosable: true,
      description: (
        <Box>
          <Button>DANGER</Button> Will Robbinson
        </Box>
      ),
    });
  }

  function handleClickError() {
    sarcoToast.open({
      title: 'Error',
      status: 'error',
      description:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus vel velit eleifend, posuere nisi sed, condimentum dolor. Nullam laoreet odio non tortor vestibulum, vitae fringilla quam porta.',
      isClosable: true,
    });
  }
  return (
    <VStack
      align="left"
      spacing={6}
      mb={200}
    >
      <Heading>This is a Heading</Heading>
      <Text>This is some primary text</Text>
      <Text variant="secondary">This is some secondary text</Text>
      <Button
        w={200}
        variant="link"
      >
        A Clicky Link
      </Button>

      <Heading>Toasts</Heading>
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
      </HStack>

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
        <Button>Clicky Button</Button>
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

      <Button
        w={200}
        variant="link"
      >
        A Clicky Link
      </Button>

      <Divider />

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
        color="grayBlue.800"
        py={12}
      >
        <Text align="center">Thing with a secondary border</Text>
      </Box>
    </VStack>
  );
}
