// Contains all the colors used by the sarcophagus app

export const colors = {
  // Main brand colors
  // Colors from black to white, lowest number being the darkest and highest number being the
  // lightest
  brand: {
    0: '#000000',
    50: '#0d0d0d',
    100: '#262626',
    200: '#404040',
    300: '#595959',
    400: '#737373',
    500: '#8c8c8c',
    600: '#a6a6a6',
    700: '#bfbfbf',
    800: '#d9d9d9',
    900: '#f2f2f2',
    950: '#ffffff',
  },

  // Border and accent colors
  grayBlue: {
    100: '#B6C4D1',
    200: '#8D9AA8',
    300: '#6F7B87',
    400: '#616C78',
    500: '#525C65',
    600: '#434A52',
    700: '#343A40',
    800: '#2A3036',
    900: '#20262D',
  },

  // Bright colors typically used for toasts and alerts
  blue: '#168FFF',
  green: '#17CB49',
  orange: '#FF9F2D',
  red: '#F74141',
  yellow: '#FFF72D',
  gray: '#8c8c8c',

  // Transparent versions of the bright colors typically used for backgrounds
  transparent: {
    blue: '#168FFF26',
    green: '#17CB4926',
    orange: '#FF9F2D26',
    red: '#F7414126',
    yellow: '#FFF72D26',
    gray: '#8c8c8c26',
  },

  // alert components
  alert: {
    info: '#168FFF',
    infoBackground: '#168FFF26',
    success: '#17CB49',
    successBackground: '#17CB4926',
    warning: '#FF9F2D',
    warningBackground: '#FF9F2D26',
    error: '#F74141',
    errorBackground: '#F7414126',
  },

  table: {
    textBackground: '#383a4066',
    errorBackground: '#F7414126',
  },

  text: {
    primary: '#FFFFFF', // brand.950
    secondary: '#a6a6a6', // brand.600
    disabled: '#737373', // brand.400
  },

  checkboxScheme: {
    500: '#168FFF',
  },

  //TODO, items from oldColors to be resolved and whitAlpha is still being used in places
  errorHighlight: '#F7414126',
  errorAlt: '#290e0e',

  menuBlue: {
    700: '#343A40',
    1000: '#131416',
  },
};
