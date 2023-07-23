const palette = {
    background: '#FAF4F2',
    secondary: '#e3bdda',
    text: '#FFFFFF',
    accent1: "#D1EDBF",
    accent2: "#F1F9FB", 
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
      background: "#FAF4F2",
      contrast: palette.dark,
      secondary: "#EDE8E6",
      text: "#24282C",
      textContrast: "#FEFEFF",
      accentMain: "#E6EDEC",
      accentSecondary: "#E0D3CE",
      success: "#caf4de",
      successDark: "#9aeac0",
      error: "#fbd8df"
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