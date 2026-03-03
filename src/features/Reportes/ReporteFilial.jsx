import { useState, useEffect } from 'react';
import { Typography, Select, MenuItem, Button, Table, TableBody, TableCell, TableHead, TableRow, Snackbar, Alert, Box } from '@mui/material';
import ImageIcon from '@mui/icons-material/Image';
import { getAllFiliales } from '../../api/filialApi';
import { traerIncidenciasFilial } from '../../api/incidenciasApi';
import { VisorImagenes } from '../../components/VisorImagenes';

export const ReporteFilial = () => {
  const [filialId, setFilialId] = useState('');
  const [incidencias, setIncidencias] = useState([]);
  const [filiales, setFiliales] = useState([]);
  const [snackbar, setSnackbar] = useState({
      open: false,
      severity: "info", // "info", "success", "error"
      message: "",
    })
   const [images, setimages] = useState(null)
   const [Visor, setVisor] = useState(false)
  // Carga lista de filiales (asume que tienes API para eso)
  useEffect(() => {
      
      const fetchReporteF=async()=>{
          const data= await getAllFiliales();
          console.log(data)
          setFiliales(data.Filiales);
    }
    fetchReporteF();
  }, []);

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
    if (!filialId || filialId === "") {
    setSnackbar({
      open: true,
      severity: "warning",
      message: "Selecciona una filial",
    });
    return; // no continúa si no hay ID
  }

    const {data} = await traerIncidenciasFilial(filialId);
    console.log(data)
    if (Array.isArray(data) && data.length > 0) {
        setIncidencias(data);
    } else {
        setSnackbar({ open: true, severity: "info", message: "No se encontraron incidencias para esta filial." });
        setIncidencias([]); // si prefieres limpiar lo anterior, o simplemente no hacer nada
    }
  };

  return (
    <>
    <Box sx={{ width: '100%'}}>
        <Typography variant="h5" gutterBottom>Reporte por Filial</Typography>
            <Box sx={{display: 'flex', gap:2,alignItems:'center',mb:3}}>
                <Select value={filialId} onChange={(e) => setFilialId(e.target.value)}>
                    <MenuItem value="">Seleccione Filial</MenuItem>
                    {filiales.map(f => (
                    <MenuItem key={f.IDfilial} value={f.IDfilial}>{f.nombre}</MenuItem>
                    ))}
                </Select>
            <Button onClick={cargarReporte} variant='contained' color='primary' sx={{backgroundColor:'orange', '&:hover':{backgroundColor:'darkorange',textTransform:'none'}}}>Cargar Reporte</Button>
            </Box>
        <Table sx={{minWidth:'100%',backgroundColor:'#fafafa', borderRadius:2}}>
            <TableHead>
                <TableRow sx={{backgroundColor:'#e0e0e0'}}>
                    <TableCell>Fecha</TableCell>
                    <TableCell>Correo Usuario</TableCell>
                    <TableCell>Imagenes</TableCell>
                </TableRow>
            </TableHead>
            <TableBody>
            {incidencias.map(i => (
                <TableRow key={i.IDincidencias}>
                <TableCell>{new Date(i.fecha_reporte).toLocaleString()}</TableCell>
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
};
