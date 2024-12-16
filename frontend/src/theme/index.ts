import { createTheme, Theme } from '@fluentui/react';

export const theme: Theme = createTheme({
  palette: {
    themePrimary: '#0078d4',
    themeLighterAlt: '#f3f9fd',
    themeLighter: '#d0e7f8',
    themeLight: '#a7d0f2',
    themeTertiary: '#5ca3e5',
    themeSecondary: '#207bd3',
    themeDarkAlt: '#006cbe',
    themeDark: '#005ba1',
    themeDarker: '#004377',
    neutralLighterAlt: '#faf9f8',
    neutralLighter: '#f3f2f1',
    neutralLight: '#edebe9',
    neutralQuaternaryAlt: '#e1dfdd',
    neutralQuaternary: '#d0d0d0',
    neutralTertiaryAlt: '#c8c6c4',
    neutralTertiary: '#a19f9d',
    neutralSecondary: '#605e5c',
    neutralPrimaryAlt: '#3b3a39',
    neutralPrimary: '#323130',
    neutralDark: '#201f1e',
    black: '#000000',
    white: '#ffffff'
  },
  fonts: {
    small: {
      fontSize: '12px'
    },
    medium: {
      fontSize: '14px'
    },
    large: {
      fontSize: '16px'
    },
    xLarge: {
      fontSize: '20px'
    }
  }
});

export const getThemeWithCustomizations = () => {
  return createTheme({
    ...theme,
    components: {
      TextField: {
        styles: {
          field: {
            selectors: {
              '::placeholder': {
                color: theme.palette.neutralTertiary
              }
            }
          }
        }
      },
      DefaultButton: {
        styles: {
          root: {
            borderRadius: '4px'
          }
        }
      },
      PrimaryButton: {
        styles: {
          root: {
            borderRadius: '4px'
          }
        }
      }
    }
  });
};