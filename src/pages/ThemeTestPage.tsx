import {
  Alert,
  AlertIcon,
  Box,
  Button,
  Divider,
  FormControl,
  FormLabel,
  Heading,
  HStack,
  Input,
  Text,
  useToast,
  VStack,
} from '@chakra-ui/react';
import { errorSample, infoSample, successSample, warningSample } from '../lib/utils/toast';

export function ThemeTestPage() {
  const toast = useToast();

  function handleClickInfo() {
    toast(infoSample());
  }

  function handleClickSuccess() {
    toast(successSample());
  }

  function handleClickWarning() {
    toast(warningSample());
  }

  function handleClickError() {
    toast(errorSample());
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

      <Divider />

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

      <Divider />
      <Heading>Alerts</Heading>
      <Text variant="secondary">These might be used or might not. We will see</Text>
      <Alert status="info">
        <AlertIcon color="info" />
        <Text>This is some info</Text>
      </Alert>

      <Alert status="success">
        <AlertIcon color="success" />
        <Text>This is some good info</Text>
      </Alert>

      <Alert status="warning">
        <AlertIcon color="warning" />
        <Text color="warning">This is a warning</Text>
      </Alert>

      <Alert status="error">
        <AlertIcon color="error" />
        <Text color="error">This is an error. This is bad.</Text>
      </Alert>

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
