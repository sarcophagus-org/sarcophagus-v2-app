import { Alert as AlertChakra, AlertIcon, Text, AlertProps } from '@chakra-ui/react';

export function Alert(props: AlertProps) {
  const { status, children } = props;

  let textColor = status?.toString();
  if (status === 'info' || status === 'success') {
    textColor = 'brand.950';
  }

  return (
    <AlertChakra
      alignItems="flex-start"
      {...props}
    >
      <AlertIcon color={status} />
      <Text color={textColor}>{children}</Text>
    </AlertChakra>
  );
}
