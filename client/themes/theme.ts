const palette = {
    background: '#FAF4F2',
    secondary: '#EED6E8',
    text: '#FFFFFF',
    accent1: "#D1EDBF",
    accent2: "#B8D8E8", 
    green: "#63A88A",
    dark: '#24282C',
  }
  
export type Theme = {
  colors: typeof theme.colors,
  spacing: typeof theme.spacing,
  textVariants: typeof theme.textVariants
}

  export const theme = {
    colors: {
      background: palette.background,
      contrast: palette.dark,
      secondary: "#fcf8f7",
      text: "#24282C",
      textContrast: "#FEFEFF",
      accentMain: palette.accent1,
      accentSecondary: palette.accent2,
    },
    spacing: {
      s: 8,
      m: 16,
      l: 24,
      xl: 40,
    },
    textVariants: {
      header: {
        fontFamily: 'Raleway',
        fontSize: 26,
      },
      body: {
        fontFamily: 'Raleway',
        // fontFamily: 'Merriweather',
        fontSize: 16,
      },
    }
  };
  
  export const darkTheme = {
    ...theme,
    colors: {
      ...theme.colors,
      background: palette.dark,
      foreground: palette.background,
    }
  }