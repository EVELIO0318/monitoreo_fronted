import React, { useState } from 'react'
import { traerIncidenciasFecha } from '../../api/incidenciasApi';
import { Alert, Box, Button, Snackbar, Table, TableBody, TableCell, TableHead, TableRow, TextField, Typography } from '@mui/material';
import ImageIcon from '@mui/icons-material/Image';
import { VisorImagenes } from '../../components/VisorImagenes';

export const ReporteFechas = () => {
  const [fechaInicio, setFechaInicio] = useState('');
  const [fechaFin, setFechaFin] = useState('');
  const [incidencias, setIncidencias] = useState([]);
  const [snackbar, setSnackbar] = useState({
      open: false,
      severity: "info", // "info", "success", "error"
      message: "",
    })
   const [images, setimages] = useState(null)
   const [Visor, setVisor] = useState(false);

  const handleCloseSnackbar = () => {
    setSnackbar((prev) => ({ ...prev, open: false }));
  };


  const abrirVisor=(images)=>{
    setimages(images)
    setVisor(true);
  }

  const cerrarVisor=()=>{
    setimages(null)
    setVisor(false);
  }

  const cargarReporte = async () => {
    if (!fechaInicio || !fechaFin) {
    setSnackbar({
      open: true,
      severity: "warning",
      message: "Seleccione Ambas fechas",
    });
    return; // no continúa si no hay ID
  }

    const {data} = await traerIncidenciasFecha(fechaInicio,fechaFin);
    console.log(data.data)
    if (Array.isArray(data.data) && (data.data).length > 0) {
        setIncidencias(data.data);
    } else {
        setSnackbar({ open: true, severity: "info", message: "No se encontraron incidencias en este rango." });
        setIncidencias([]); // si prefieres limpiar lo anterior, o simplemente no hacer nada
    }
  };

  return (
    <>
    <Box sx={{ width: '100%'}}>
        <Typography variant="h5" gutterBottom>Reporte por Fechas</Typography>
            <Box sx={{display: 'flex', gap:2,alignItems:'center',mb:3}}>

            <TextField
                type="date"
                label="Desde"
                InputLabelProps={{ shrink: true }}
                value={fechaInicio}
                onChange={(e) => setFechaInicio(e.target.value)}
            />
            <TextField
                type="date"
                label="Hasta"
                InputLabelProps={{ shrink: true }}
                value={fechaFin}
                onChange={(e) => setFechaFin(e.target.value)}
            />
            <Button onClick={cargarReporte} variant='contained' color='primary' sx={{backgroundColor:'orange', '&:hover':{backgroundColor:'darkorange',textTransform:'none'}}}>Cargar Reporte</Button>
            </Box>
        <Table sx={{minWidth:'100%',backgroundColor:'#fafafa', borderRadius:2}}>
            <TableHead>
                <TableRow sx={{backgroundColor:'#e0e0e0'}}>
                    <TableCell>Fecha</TableCell>
                    <TableCell>Filial/Ventanilla</TableCell>
                    <TableCell>Correo Usuario</TableCell>
                    <TableCell>Imagenes</TableCell>
                </TableRow>
            </TableHead>
            <TableBody>
            {incidencias.map(i => (
                <TableRow key={i.IDincidencias}>
                <TableCell>{new Date(i.fecha_reporte).toLocaleString()}</TableCell>
                <TableCell>{i.nombre}</TableCell>
                <TableCell>{i.correo_user}</TableCell>
                <TableCell>
                    <Button
                        variant="contained"
                        startIcon={<ImageIcon/>}
                        sx={{
                            backgroundColor: 'orange',
                            color: 'white',
                            '&:hover': {
                                backgroundColor: 'darkorange',
                            },
                        }}

                        disabled={(i.archivo_url).length===0}
                        onClick={()=>abrirVisor(i.archivo_url)}
                    >
                    </Button>

                </TableCell>
                </TableRow>
            ))}
            </TableBody>
        </Table>
    </Box>

    { images && (
        <VisorImagenes
            open={Visor}
            onClose={cerrarVisor}
            imagenes={images}
        />
    ) }
        <Snackbar
            open={snackbar.open}
            autoHideDuration={4000}
            onClose={handleCloseSnackbar}
            anchorOrigin={{ vertical: "top", horizontal: "center" }}>
            <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: "100%" }}>
                {snackbar.message}
            </Alert>
        </Snackbar>
    </>

    
  );

}
