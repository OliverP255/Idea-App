import React from 'react';


export const theme = {
colors: {
bg: '#0f1724',
panel: '#0b1220',
primary: '#6ee7b7',
text: '#e6eef9',
muted: '#98a2b3'
},
spacing: (n: number) => n * 8
};


export const ThemeContext = React.createContext(theme);


export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
return <ThemeContext.Provider value={theme}>{children}</ThemeContext.Provider>;
};


export default theme;