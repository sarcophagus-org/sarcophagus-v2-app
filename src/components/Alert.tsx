import { Alert as AlertChakra, AlertIcon, Text, AlertProps } from '@chakra-ui/react';

export function Alert(props: AlertProps) {
  const { status, children } = props;
  return (
    <AlertChakra {...props}>
      <AlertIcon color={status} />
      <Text color={status}>{children}</Text>
    </AlertChakra>
  );
}
