import { AlertProps, ComponentStyleConfig } from '@chakra-ui/react';

// Controls the opacity of the toast background
const backgroundColor = 'rgba(0, 0, 0, 1)';

const alertStatusStyles: { [key: string]: any } = {
  success: {
    container: {
      background: 'unset',
      backgroundColor,
      border: '1px',
      borderColor: 'success',
    },
    title: {
      color: 'brand.900',
    },
    description: {
      color: 'brand.900',
    },
    icon: {
      color: 'success',
    },
  },
  info: {
    container: {
      background: 'unset',
      backgroundColor,
      border: '1px',
      borderColor: 'info',
    },
    icon: {
      color: 'info',
    },
  },
  warning: {
    container: {
      background: 'unset',
      backgroundColor,
      border: '1px',
      borderColor: 'warning',
    },
    title: {
      color: 'warning',
    },
    description: {
      color: 'warning',
    },
    icon: {
      color: 'warning',
    },
  },
  error: {
    container: {
      background: 'unset',
      backgroundColor,
      border: '1px',
      borderColor: 'error',
    },
    title: {
      color: 'error',
    },
    description: {
      color: 'error',
    },
    icon: {
      color: 'error',
    },
  },
  default: {
    container: {
      background: 'unset',
      backgroundColor,
      border: '1px',
      borderColor: 'info',
    },
    icon: {
      color: 'info',
    },
  },
};

// Border radius for this component is adjusted in theme/styles.ts. See comments for more details.
export const Alert: ComponentStyleConfig = {
  baseStyle: (props: AlertProps) => alertStatusStyles[props.status || 'default'],
};
