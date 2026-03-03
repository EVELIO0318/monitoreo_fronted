import { Button, Card, CardContent, Chip, Stack, Typography, Box } from "@mui/material";

export const Monitorcard = ({filial, forzarOffline, onReportar}) => {
    const {nombre, direccion_ip, estado_actual, ultima_revision, LAN, colorRGB, CorreoProveedor, AnchoBanda, EnlaceAlterno} = filial;
    const estado = forzarOffline ? 'offline' : estado_actual;
    
    const backgroundColor = estado === 'offline' ? '#ffe6e6' : (colorRGB ? `#${colorRGB}` : '#e6ffe6');
    const borderColor = estado === 'offline' ? '#ff4d4d' : (colorRGB ? `#${colorRGB}` : '#66bb6a');

    const opciones = {
        day: 'numeric',
        month: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
    };

    const fecha = (new Date(ultima_revision)).toLocaleString('es-HN', opciones);
    console.log(filial)

    return (
        <Card
            variant="outlined"
            sx={{
                backgroundColor: backgroundColor,
                borderColor: borderColor,
                borderWidth: 1,
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                transition: '0.3s',
                minHeight: '95px',
                maxHeight: '105px',
                width: '100%',
            }}
        >
            <CardContent sx={{ p: 0.8, '&:last-child': { pb: 0.8 }, flex: 1 }}>
                <Stack spacing={0.2}>
                    {/* Fila: Nombre + LAN con AnchoBanda */}
                    <Stack direction="row" justifyContent="space-between" alignItems="flex-start" spacing={0.5}>
                        <Typography 
                            variant="h6" 
                            fontWeight="bold" 
                            sx={{ 
                                fontSize: '1rem',
                                lineHeight: '1.1',
                                flex: 1,
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                whiteSpace: 'nowrap',
                                fontWeight: 'bold'  
                            }}
                        >
                            {nombre}
                        </Typography>
                        
                        {/* Columna derecha: LAN + Enlace Alterno */}
                        <Stack alignItems="flex-end" spacing={0.3}>
                            {LAN && (
                                <Chip 
                                    label={`LAN ${LAN} ${AnchoBanda ? `- ${AnchoBanda}` : ''}`}
                                    size="small"
                                    variant="outlined"
                                    sx={{ 
                                        fontSize: '0.8rem',
                                        height: '20px',
                                        minWidth: '30px',
                                        fontWeight: 'bold'  
                                    }}
                                />
                            )}
                           
                        </Stack>
                    </Stack>

                    {/* IP */}
                    <Typography variant="body2" color="textSecondary" sx={{ fontSize: '0.65rem', lineHeight: '1' }}>
                        {direccion_ip}
                    </Typography>

                    {/* Última Conexión */}
                    <Typography variant="body2" color="textSecondary" sx={{ fontSize: '0.6rem', lineHeight: '1' }}>
                        Última Conexión: {fecha.replace(',', '')}
                    </Typography>

                    {/* Fila: Estado Conectado + Botón Reportar */}
                    <Stack direction="row" justifyContent="space-between" alignItems="center" spacing={0.5}>
                        {/* Indicador de estado conectado */}
                        {estado !== 'offline' && (
                            <Box
                                sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 0.5,
                                }}
                            >
                                <Box
                                    sx={{
                                        width: 8,
                                        height: 8,
                                        backgroundColor: '#4CAF50',
                                        borderRadius: '50%',
                                    }}
                                />
                                <Typography 
                                    variant="body2" 
                                    sx={{ 
                                        fontSize: '0.65rem',
                                        color: '#4CAF50',
                                        fontWeight: 'bold'
                                    }}
                                >
                                    Conectado
                                </Typography>
                            </Box>
                        )}


                         
                  

                        {/* Espacio flexible para alinear el botón a la derecha */}
                        <Box sx={{ flex: 1 }} />

                        {/* Botón Reportar */}
                        {estado_actual === 'offline' && (
                            <Button 
                                variant="contained" 
                                color="error" 
                                onClick={onReportar}
                                size="small"
                                sx={{ 
                                    fontSize: '0.6rem',
                                    py: 0.1,
                                    minHeight: '20px',
                                    minWidth: '60px'
                                }}
                            >
                                Reportar
                            </Button>
                        )}

                                  {/* ✅ NUEVO: Enlace Alterno - En esquina debajo de LAN */}
                            {EnlaceAlterno && 
                             EnlaceAlterno.trim() !== '' && 
                             !EnlaceAlterno.toUpperCase().includes('CABLE') && (
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                    <img
                                        src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQbm9-rcPyozHhKHr74yxdBq5wmbXja7-lJzA&s"
                                        style={{
                                            width: '16px',  // ✅ Más grande
                                            height: '16px', // ✅ Más grande
                                            objectFit: 'contain',
                                            opacity: 0.8
                                        }}
                                        alt="Enlace Alterno"
                                    />
                                    <Typography 
                                        variant="caption" 
                                        color="text.disabled"
                                        sx={{ 
                                            fontSize: '0.65rem', // ✅ Más grande
                                            lineHeight: '1',
                                            fontStyle: 'italic',
                                            opacity: 0.8,
                                            fontWeight: 'bold' // ✅ Negrita
                                        }}
                                    >
                                        {EnlaceAlterno}
                                    </Typography>
                                </Box>
                            )}
                    </Stack>
                </Stack>
            </CardContent>
        </Card>
    )
}