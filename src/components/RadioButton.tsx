import { Box, Center } from '@chakra-ui/react';

interface RadioButtonProps {
  checked?: boolean;
}

export function RadioButton({ checked }: RadioButtonProps) {
  const color = 'brand.950';
  return (
    <Center
      h="15px"
      w="15px"
      border="1px solid"
      borderColor={color}
      borderRadius="100px"
    >
      {checked && (
        <Box
          h="9px"
          w="9px"
          border="1px solid"
          borderColor={color}
          borderRadius="100px"
          bg={color}
        />
      )}
    </Center>
  );
}
