import { ComponentStyleConfig } from '@chakra-ui/react';
import { styles } from '../styles';

export const Input: ComponentStyleConfig = {
  variants: {
    main: {
      field: {
        bg: 'brand.0',
        border: '1px',
        borderRadius: 0,
        borderColor: 'brand.950',
        fontSize: styles.global.body.fontSize,
        _disabled: {
          borderColor: 'brand.300',
          color: 'brand.300',
        },
        _placeholder: { color: 'text.secondary' },
      },
    },
  },
  defaultProps: {
    variant: 'main',
  },
};
