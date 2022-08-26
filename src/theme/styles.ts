export const styles = {
  global: {
    body: {
      bg: 'brand.0',
      color: 'brand.950',
      fontSize: '14px',

      // This is a hacky fix to force the alert/toast edges to be square.
      // Note that this means any attempt to override the alert/toast container's border radius may
      // fail.
      //
      // This all started with an issue where toast messages would not take on a square edge
      // https://github.com/chakra-ui/chakra-ui/issues/2579
      '.chakra-alert': {
        borderRadius: 0,
      },
    },
  },
};
