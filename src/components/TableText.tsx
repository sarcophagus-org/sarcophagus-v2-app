import { Center, Text, TextProps } from '@chakra-ui/react';

interface TableTextProps extends TextProps {
  children?: React.ReactNode;
}

// A custom text component that has a light background behind it. Commonly used in tables.
export function TableText({ children, ...props }: TableTextProps) {
  return (
    <Center
      bg="table.textBackground"
      py="2px"
      borderRadius="2px"
      w="fit-content"
      px="6px"
    >
      <Text {...props}>{children}</Text>
    </Center>
  );
}
