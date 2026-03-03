import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Typography,
  CircularProgress,
  Box,
  Snackbar,
  Alert,
  Card,
  CardContent,
  Chip,
  Divider,
} from "@mui/material";
import { useDropzone } from "react-dropzone";
import { guardarIncidencia } from "../../api/incidenciasApi";
import { useEffect, useState } from "react";
import { Email, CloudUpload, Warning, CheckCircle, ContactPhone } from "@mui/icons-material";

export const ReporteModal = ({ open, onClose, filial, onSuccess }) => {
  const [correo, setCorreo] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [archivos, setArchivos] = useState([]);
  const [enviando, setEnviando] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    severity: "info",
    message: "",
  });

  // URL por defecto cuando no hay archivos
  const URL_POR_DEFECTO = "https://taulabe.cooperativataulabe.hn/";

  // Cargar datos automáticamente cuando se abre el modal
  useEffect(() => {
    if (!open) return;

    console.log("🟢 MODAL ABIERTO - Filial:", filial);
    
    // Establecer correo automáticamente desde la base de datos
    if (filial?.CorreoTaulabe) {
      setCorreo(filial.CorreoTaulabe);
    }

    // Generar mensaje automáticamente con el circuitId de la filial
    if (filial?.circuitId) {
      generarMensajeAutomatico(filial.circuitId);
    }
  }, [open, filial]);

  const generarMensajeAutomatico = (circuitID = filial?.circuitId) => {
    if (!circuitID) return;

    const mensajeGenerado = `Buen Día Estimados.
Un placer saludarles.

Me comunico con ustedes para solicitar su valiosa ayuda verificando 
el enlace en la Oficina ${filial.nombre} que se encuentra fuera de servicio, con Id ${circuitID}.

CONTACTOS EN SITIO: 
 ${filial.contactos || filial.contacto || 'No definido'}


HORARIO DE ATENCIÓN: 
Lunes a Viernes 8am a 4:00pm
Sábados de 8:00am a 12:00pm  


Atentamente
Cooperativa Taulabe`;

    setMensaje(mensajeGenerado);
  };

  const onDrop = (acceptedFiles) => {
    setArchivos((prevArchivos) => [...prevArchivos, ...acceptedFiles]);
  };

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    multiple: true,
    accept: { 
      "image/*": [".jpeg", ".jpg", ".png", ".gif"],
      "application/pdf": [".pdf"]
    },
  });

  const eliminarArchivo = (index) => {
    setArchivos(archivos.filter((_, i) => i !== index));
  };

  const enviarReporte = async () => {
    console.log("🚀 ENVIANDO REPORTE - Datos:", {
      filial: filial?.nombre,
      correo,
      circuitID: filial?.circuitId,
      archivos: archivos.length
    });

    if (!filial?.circuitId) {
      setSnackbar({ open: true, severity: "warning", message: "No hay Circuit ID definido para esta filial." });
      return;
    }

    if (!correo.trim()) {
      setSnackbar({ open: true, severity: "warning", message: "El correo es obligatorio." });
      return;
    }

    setEnviando(true);

    try {
      const formData = new FormData();
      formData.append("filial_id", filial.IDfilial);
      formData.append("filialName", filial.nombre);
      formData.append("correo_user", correo);
      formData.append("correo_proveedor", filial.CorreoProveedor || "");
      formData.append("circuit_id", filial.circuitId);
      formData.append("subject", `Reporte de Caída - ${filial.nombre} - Circuit ${filial.circuitId}`);
      formData.append("text", mensaje);
      
      // ✅ AGREGADO: Si no hay archivos, enviar la URL por defecto
      if (archivos.length === 0) {
        formData.append("url_por_defecto", URL_POR_DEFECTO);
        console.log("📎 Usando URL por defecto:", URL_POR_DEFECTO);
      } else {
        // Adjuntar archivos si existen
        archivos.forEach((file) => {
          formData.append("archivos", file);
        });
      }

      const res = await guardarIncidencia(formData);
      console.log("✅ Respuesta del servidor:", res);

      if (res.code === 200) {
        onSuccess("Reporte enviado exitosamente", "success");
        // Limpiar formulario
        setArchivos([]);
        onClose();
      } else {
        setSnackbar({ open: true, severity: "error", message: res.message || "Error al enviar el reporte." });
      }
    } catch (error) {
      console.error("💥 Error en enviarReporte:", error);
      setSnackbar({
        open: true,
        severity: "error",
        message: error.response?.data?.error || "Ocurrió un error inesperado al enviar el reporte.",
      });
    } finally {
      setEnviando(false);
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar((prev) => ({ ...prev, open: false }));
  };

  return (
    <>
      <Dialog 
        open={open} 
        onClose={onClose} 
        fullWidth 
        maxWidth="lg"
        PaperProps={{
          sx: {
            borderRadius: 3,
            boxShadow: '0 10px 40px rgba(0,0,0,0.1)',
            minHeight: '80vh'
          }
        }}
      >
        <DialogTitle sx={{ 
          backgroundColor: 'primary.main', 
          color: 'white',
          textAlign: 'center',
          py: 2
        }}>
          <Box display="flex" alignItems="center" justifyContent="center" gap={1}>
            <Warning fontSize="large" />
            <Typography variant="h5" fontWeight="bold">
              Reporte de Incidencia
            </Typography>
          </Box>
        </DialogTitle>

        <DialogContent sx={{ p: 3, height: '70vh' }}>
          {/* Header con información de la filial */}
          <Card sx={{ mb: 3, backgroundColor: '#f8f9fa', border: '2px solid #e9ecef' }}>
            <CardContent sx={{ textAlign: 'center', py: 2 }}>
              <Typography 
                variant="h4" 
                fontWeight="bold" 
                sx={{ 
                  color: '#28a745',
                  mb: 1,
                  textShadow: '1px 1px 2px rgba(0,0,0,0.1)'
                }}
              >
                {filial?.nombre}
              </Typography>
              <Box display="flex" justifyContent="center" gap={2} flexWrap="wrap">
                <Chip 
                  icon={<Email />} 
                  label={`Proveedor: ${filial?.CorreoProveedor || 'No definido'}`}
                  variant="outlined"
                  color="primary"
                />
              </Box>
            </CardContent>
          </Card>

          <Box display="grid" gridTemplateColumns="1fr 1fr" gap={3} sx={{ height: '100%' }}>
            {/* Columna Izquierda - Información básica */}
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <TextField
                label="Correo Cooperativa Taulabe"
                fullWidth
                value={correo}
                onChange={(e) => setCorreo(e.target.value)}
                margin="normal"
                InputProps={{
                  startAdornment: <Email sx={{ mr: 1, color: 'text.secondary' }} />,
                }}
              />

              {/* Información del Circuit ID */}
              <Box p={2} sx={{ backgroundColor: 'grey.50', borderRadius: 1 }}>
                <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                  Circuit ID:
                </Typography>
                <Typography variant="h6" color="primary.main">
                  {filial?.circuitId || 'No definido'}
                </Typography>
              </Box>

              {/* Información de Contactos */}
              <Box p={2} sx={{ backgroundColor: 'grey.50', borderRadius: 1 }}>
                <Box display="flex" alignItems="center" gap={1} mb={1}>
                  <ContactPhone color="primary" />
                  <Typography variant="subtitle1" fontWeight="bold">
                    Contactos en Sitio:
                  </Typography>
                </Box>
                <Typography variant="body1" sx={{ whiteSpace: 'pre-line' }}>
                  {filial?.contactos || filial?.contacto || 'No definido'}
                </Typography>
              </Box>

              {/* Área de archivos opcional */}
              <Box sx={{ flex: 1 }}>
                <Typography variant="subtitle2" gutterBottom color="text.secondary">
                  Adjuntar archivos (Opcional)
                </Typography>
                <Box
                  {...getRootProps()}
                  sx={{
                    border: '2px dashed',
                    borderColor: 'grey.300',
                    borderRadius: 2,
                    p: 3,
                    textAlign: 'center',
                    cursor: 'pointer',
                    backgroundColor: 'grey.50',
                    transition: 'all 0.3s',
                    '&:hover': {
                      backgroundColor: 'grey.100',
                      borderColor: 'primary.main',
                    }
                  }}
                >
                  <input {...getInputProps()} />
                  <CloudUpload sx={{ fontSize: 40, color: 'primary.main', mb: 1 }} />
                  <Typography variant="body2" color="text.secondary">
                    Haz clic o arrastra archivos aquí
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Imágenes o PDF (opcional)
                  </Typography>
                </Box>

                {/* Información de URL por defecto */}
                {archivos.length === 0 && (
                  <Box mt={2} p={2} sx={{ backgroundColor: '#e8f5e8', borderRadius: 1, border: '1px solid #c8e6c9' }}>
                    <Typography variant="body2" color="success.main" fontWeight="bold">
                      📎 URL por defecto incluida:
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {URL_POR_DEFECTO}
                    </Typography>
                  </Box>
                )}

                {/* Lista de archivos seleccionados */}
                {archivos.length > 0 && (
                  <Box mt={2}>
                    <Typography variant="subtitle2" gutterBottom>
                      Archivos seleccionados:
                    </Typography>
                    {archivos.map((file, index) => (
                      <Box 
                        key={index}
                        display="flex" 
                        justifyContent="space-between" 
                        alignItems="center"
                        sx={{ 
                          p: 1, 
                          backgroundColor: 'grey.50', 
                          borderRadius: 1,
                          mb: 0.5
                        }}
                      >
                        <Typography variant="body2" noWrap flex={1}>
                          {file.name}
                        </Typography>
                        <Button 
                          size="small" 
                          color="error"
                          onClick={() => eliminarArchivo(index)}
                        >
                          Eliminar
                        </Button>
                      </Box>
                    ))}
                  </Box>
                )}
              </Box>
            </Box>

            {/* Columna Derecha - Mensaje */}
            <Box sx={{ height: '100%' }}>
              <TextField
                label="Mensaje del reporte"
                fullWidth
                multiline
                rows={20}
                value={mensaje}
                onChange={(e) => setMensaje(e.target.value)}
                margin="normal"
                sx={{
                  height: '100%',
                  '& .MuiInputBase-root': {
                    height: '100%',
                    alignItems: 'flex-start'
                  }
                }}
                InputProps={{
                  sx: {
                    fontSize: '0.9rem',
                    lineHeight: '1.4',
                    fontFamily: 'monospace',
                    height: '100%'
                  }
                }}
              />
            </Box>
          </Box>
        </DialogContent>

        <Divider />

        <DialogActions sx={{ p: 3, gap: 1 }}>
          <Button 
            onClick={onClose} 
            disabled={enviando}
            variant="outlined"
            size="large"
          >
            Cancelar
          </Button>
          <Button 
            onClick={enviarReporte} 
            variant="contained" 
            disabled={enviando}
            size="large"
            startIcon={enviando ? <CircularProgress size={20} /> : <Email />}
            sx={{
              px: 4,
              background: 'linear-gradient(45deg, #28a745 30%, #20c997 90%)',
              '&:hover': {
                background: 'linear-gradient(45deg, #218838 30%, #1e9e8a 90%)',
              }
            }}
          >
            {enviando ? "Enviando..." : "Enviar Reporte"}
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert 
          onClose={handleCloseSnackbar} 
          severity={snackbar.severity} 
          sx={{ width: "100%" }}
          variant="filled"
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
};