import { Button, Dialog, DialogActions, DialogContent, DialogTitle, ImageList, ImageListItem, Typography } from '@mui/material'
import { useEffect, useState } from 'react';


export const VisorImagenes = ({open, onClose, imagenes}) => {

     const [Images, setImages] = useState([])


     useEffect(() => {
       setImages(imagenes);
     
     }, [])
  return (
    <>
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm" disableEnforceFocus disableRestoreFocus>
        <DialogTitle>Imagenes</DialogTitle>
        <DialogContent>
            <Typography 
              variant='h4' 
              align='center'
              gutterBottom 
              sx={
                  {
                    color:'primary.main',
                    fontWeight:'bold',
                    textTransform: 'uppercase',
                    letterSpacing: 1.5,
                    textShadow: '1px 1px 2px rgba(0,0,0,0.1)',
                    mb: 4,
                    transition: 'all 0.3s ease-in-out',
                    '&:hover': {
                      transform: 'scale(1.02)',
                      textShadow: '2px 2px 4px rgba(0,0,0,0.2)',
                    },
                  }
              }>
              Imagenes del Incidente
            </Typography>
            {/* AQUI VA EL VISOR */}
            <ImageList sx={{ width: 500, height: 450 }} cols={3} rowHeight={164}>
              {Images.map((item,index) => (
              <ImageListItem key={index}>
                <img
                srcSet={`http://10.0.100.71:3003${item}?w=164&h=164&fit=crop&auto=format&dpr=2 2x`}
                src={`http://10.0.100.71:3003${item}?w=164&h=164&fit=crop&auto=format`}
                alt={`Imagen #${index}`}
                loading="lazy"
                />
              </ImageListItem>
  ))}
          </ImageList>
        </DialogContent>
        <DialogActions>
            <Button onClick={onClose}>
                Cerrar
            </Button>
        </DialogActions>
        </Dialog>
    </>
  )
}
