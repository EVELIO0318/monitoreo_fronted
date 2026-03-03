import { ThemeProvider } from '@emotion/react'
import { createTheme, CssBaseline } from '@mui/material'
import { AppRouter } from './router/AppRouter'


const theme = createTheme({
  palette: {
    primary: { main: '#fb8c00' }, // naranja
    background: { default: '#ffffff' },
    success: { main: '#4caf50' }, // verde para online
    error: { main: '#f44336' },   // rojo para offline
  },
})

export const MonitoreoApp = () => {
  return (
    <ThemeProvider theme={theme}>
        <CssBaseline/>
        <AppRouter/>
    </ThemeProvider>
  )
}
