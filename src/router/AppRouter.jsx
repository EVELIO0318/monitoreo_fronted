import { AppBar, Box, Button, Toolbar, Typography } from '@mui/material'
import React from 'react'
import { BrowserRouter, Link, Route, Routes } from 'react-router-dom'
import { Monitoreo } from '../features/monitor/monitoreo'
import { Reportes } from '../features/Reportes/Reportes'

export const AppRouter = () => {
  return (
    <BrowserRouter>
        <AppBar position='fixed' color='primary'>
            <Toolbar>
                <Typography variant='h6' sx={{flexGrow:1}}>
                    Monitoreo de Filiales
                </Typography>
                <Button color="inherit" component={Link} to="/">
                    Monitor
                </Button>
                 <Button color="inherit" component={Link} to="/reportes">
                    Reportes
                </Button>
            </Toolbar>
        </AppBar>


            <Box component="main" sx={{width: '100%', py:4}}>
                <Routes>
                    <Route path="/" element={<Monitoreo/>}/>
                    <Route path="/reportes" element={<Reportes/>}/>
                </Routes>
            </Box>

    </BrowserRouter>
  )
}
