import { Alert, CircularProgress, Grid, Snackbar, Typography, Box } from "@mui/material"
import { useEffect, useState } from "react"
import { getAllFiliales } from "../../api/filialApi"
import { Monitorcard } from "./monitorcard"
import { ReporteModal } from "../../components/monitor/ReporteModal"

export const Monitoreo = () => {
  const [filiales, setfiliales] = useState([])
  const [loading, setloading] = useState(true)
  const [error, setError] = useState(false)
  const [modal, setmodal] = useState(false);
  const [filialReporte, setfilialReporte] = useState(null)
  const [snackbar2, setSnackbar2] = useState({
    open: false,
    severity: "info",
    message: "",
  });

  const abrirModal = (filial) => {
    setfilialReporte(filial);
    setmodal(true);
  };

  const cerrarModal = () => {
    setmodal(false);
    setfilialReporte(null);
  };

  const mostrarSnackbar2 = (mensaje, tipo = "success") => {
    setSnackbar2({
      open: true,
      severity: tipo,
      message: mensaje,
    });
  }
    
  const cargarFiliales = async () => {
    try {
      const data = await getAllFiliales();
      setfiliales(data.Filiales);
      console.log("DATA FILIALES ", data.Filiales);
    } catch (error) {
      console.error('error src Monitoreo.jsx line:17 ', 'color: red; display: block; width: 100%;', error);
      setError(true)
    } finally {
      setloading(false);
    }
  }

  useEffect(() => {
    cargarFiliales();
    const intervalo = setInterval(() => {
      cargarFiliales();
    }, 1000);
    return () => clearInterval(intervalo);
  }, [])
  
  return (
    <>
      <div style={{ padding: 20, paddingTop: 84 }}>
      
        {loading ? (
          <CircularProgress/>
        ) : (
          // Diseño de CUATRO columnas compactas
          <Box 
            sx={{ 
              display: 'grid',
              gridTemplateColumns: 'repeat(4, 1fr)', // Cuatro columnas
              gap: 1.5, // Espacio muy reducido
              maxWidth: '100%', // Ocupar todo el ancho disponible
              margin: '0 auto'
            }}
          >
            {filiales.map((filial) => (
              <Monitorcard 
                key={filial.IDfilial}
                filial={filial} 
                forzarOffline={error} 
                onReportar={() => abrirModal(filial)}
              />
            ))}
          </Box>
        )}

        {filialReporte && (
          <ReporteModal
            open={modal}
            onClose={cerrarModal}
            filial={filialReporte}
            onSuccess={mostrarSnackbar2}
          />
        )}

        <Snackbar
          open={snackbar2.open}
          autoHideDuration={4000}
          onClose={() => { setSnackbar2({...snackbar2, open: false}) }}
          anchorOrigin={{ vertical: "top", horizontal: "center" }}
        >
          <Alert onClose={() => { setSnackbar2({...snackbar2, open: false}) }} severity={snackbar2.severity} sx={{ width: "100%" }}>
            {snackbar2.message}
          </Alert>
        </Snackbar>

        <Snackbar
          open={error}
          autoHideDuration={4000}
          onClose={() => setError(false)}
          anchorOrigin={{ vertical: "top", horizontal: "right" }}
        >
          <Alert severity="error" onClose={() => setError(false)} sx={{ width: "100%" }}>
            Error al conectarse al servidor
          </Alert>
        </Snackbar>
      </div>
    </>
  )
}