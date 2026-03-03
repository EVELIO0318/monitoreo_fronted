import { Box, Tab, Tabs, Typography } from '@mui/material';
import { useState } from 'react'
import { ReporteFilial } from './ReporteFilial';
import { ReporteFechas } from './ReporteFechas';

export const Reportes = () => {

    const [tabIndex, setTabIndex] = useState(0);

    const handleChange = (event, newValue) => {
    setTabIndex(newValue);
  };
  return (
    <Box sx={{
        width:'100%',
        
         mx:'auto',
         px:3,
         display:'flex',
         flexDirection:'column',
         alignItems:'stretch',
         mt: 10}}>
        <Typography variant='h4' align='center' gutterBottom>Reportes</Typography>
        <Tabs value={tabIndex} onChange={handleChange} centered sx={{mb:2, width: '100%'}}>
            <Tab label="Por Filial"/>
            <Tab label="Por Fechas"/>
        </Tabs>


        {tabIndex===0 && <Box sx={{mt:3}}><ReporteFilial/></Box>}
        {tabIndex===1 && <Box sx={{mt:3}}><ReporteFechas/></Box>}
    </Box>
  )
}
