import { ComponentStyleConfig } from '@chakra-ui/react';

export const Button: ComponentStyleConfig = {
  baseStyle: {
    border: 'none',
    borderRadius: 0,
    paddingTop: '20px',
    paddingBottom: '20px',
    fontWeight: 400,
  },
  variants: {
    solid: {
      color: 'brand.0',
      bg: 'brand.950',
      _hover: {
        bg: 'brand.800',
        _disabled: {
          bg: 'brand.950',
        },
      },
      _active: {
        bg: 'brand.700',
      },
    },
    ghost: {
      color: 'brand.950',
      _hover: {
        bg: 'brand.200',
      },
    },
    paginator: {
      _hover: {
        bg: 'brand.200',
      },
    },
    link: {
      color: 'brand.950',
      bg: 'brand.0',
      textDecoration: 'underline',
      fontSize: 'sm',
    },
    outline: {
      py: '1px', //because outline has a border this will made the button the same height as main
      color: 'brand.900',
    },
    disabledLook: {
      bg: 'brand.200',
      color: 'brand.0',
    },
  },
};
