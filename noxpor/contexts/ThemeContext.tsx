import {createContext, useContext} from "react"
import { theme, Theme } from "../themes/theme";
import React from "react";

export const ThemeContext = createContext<Theme>(theme)

export const useTheme = () => {
    
    return useContext(ThemeContext);
}

const ThemeContextProvider = ({children}: {children: React.ReactNode}) => {
    return (
        <ThemeContext.Provider value={theme}>
            {children}
        </ThemeContext.Provider>
    )
}

export default ThemeContextProvider;