import { defineStyle, createMultiStyleConfigHelpers } from '@chakra-ui/styled-system';
import { AlertProps } from '@chakra-ui/react';

const helpers = createMultiStyleConfigHelpers([
  'container',
  'title',
  'description',
  'icon',
  'spinner',
]);

/*
NOTE regarding the icon color: we should be able to set the styles on icon:{} part, but the current
 implmentation of <Alert> in the chakra library utilizes "colorScheme"
  in the alert component to pass down the status color to the icon.
   therefore we have to set our own icon and color on our custom component.
    see : chakra-ui\packages\components\alert\src\alert.tsx line: 44 
    where they retrieve the style "const styles = useMultiStyleConfig("Alert", { ...props, colorScheme })"
*/
const titleAndDescriptionStyle = defineStyle({
  title: {
    color: 'brand.950',
    fontSize: '16px',
    fontWeight: 'normal',
    lineHeight: '1',
  },
  description: {
    color: 'brand.950',
    lineHeight: '1',
  },
});

const alertStatusStyles: { [key: string]: any } = {
  success: {
    container: {
      bg: 'unset',
      backgroundColor: 'alert.success.background',
    },
    ...titleAndDescriptionStyle,
  },
  info: {
    container: {
      bg: 'unset',
      backgroundColor: 'alert.info.background',
    },
    ...titleAndDescriptionStyle,
  },
  warning: {
    container: {
      bg: 'unset',
      backgroundColor: 'alert.warning.background',
    },
    ...titleAndDescriptionStyle,
  },
  error: {
    container: {
      bg: 'unset',
      backgroundColor: 'alert.error.background',
    },
    ...titleAndDescriptionStyle,
  },
};

export const Alert = helpers.defineMultiStyleConfig({
  baseStyle: (props: AlertProps) => alertStatusStyles[props.status || 'default'],
  sizes: {},
  variants: {},
  defaultProps: {},
});
