import { alertAnatomy } from '@chakra-ui/anatomy';
import { AlertProps } from '@chakra-ui/react';
import { createMultiStyleConfigHelpers } from '@chakra-ui/styled-system';

const { definePartsStyle, defineMultiStyleConfig } = createMultiStyleConfigHelpers(
  alertAnatomy.keys
);

const titleAndDescriptionStyle = definePartsStyle({
  title: {
    color: 'brand.950',
    fontSize: '16px',
    fontWeight: 'normal',
    lineHeight: '1',
  },
  description: {
    color: 'brand.950',
    lineHeight: '1',
    marginTop: '8px',
  },
});

const alertStatusStyles: { [key: string]: any } = {
  success: {
    container: {
      bg: 'unset',
      backgroundColor: 'background.green',
      borderLeft: '4px solid',
      borderColor: 'green',
    },
    icon: {
      color: 'green',
    },
    ...titleAndDescriptionStyle,
  },
  info: {
    container: {
      bg: 'unset',
      backgroundColor: 'background.blue',
      borderLeft: '4px solid',
      borderColor: 'blue',
    },
    icon: {
      color: 'blue',
    },
    ...titleAndDescriptionStyle,
  },
  warning: {
    container: {
      bg: 'unset',
      backgroundColor: 'background.orange',
      borderLeft: '4px solid',
      borderColor: 'orange',
    },
    icon: {
      color: 'orange',
    },
    ...titleAndDescriptionStyle,
  },
  error: {
    container: {
      bg: 'unset',
      backgroundColor: 'background.red',
      borderLeft: '4px solid',
      borderColor: 'red',
    },
    icon: {
      color: 'red',
    },
    ...titleAndDescriptionStyle,
  },
};

export const Alert = defineMultiStyleConfig({
  baseStyle: (props: AlertProps) => alertStatusStyles[props.status || 'default'],
  sizes: {},
  variants: {},
  defaultProps: {},
});
