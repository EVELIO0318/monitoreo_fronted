import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 5173;

// Middleware para logging (opcional, ayuda a debug)
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
    next();
});

// Servir archivos estáticos de la carpeta dist
app.use(express.static(path.join(__dirname, 'dist')));

// Health check - poner ANTES del comodín
app.get('/health', (req, res) => {
    res.json({ status: 'online', timestamp: new Date().toISOString() });
});

// IMPORTANTE: El comodín debe ir DESPUÉS de todas las rutas específicas
// Para SPA, usamos un middleware en lugar de app.get('*')
app.use((req, res) => {
    res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

// Iniciar servidor
app.listen(PORT, '0.0.0.0', () => {
    console.log(`✅ Frontend ejecutándose en http://localhost:${PORT}`);
    console.log(`📁 Sirviendo archivos desde: ${path.join(__dirname, 'dist')}`);
});