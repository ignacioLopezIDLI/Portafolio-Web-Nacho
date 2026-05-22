const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 3000;

// Definición de rutas base absolutas
const rutaRaiz = path.join(__dirname, '..');
const pathBD = path.join(rutaRaiz, 'json', 'base_datos.json');
const carpetaJson = path.join(rutaRaiz, 'json');

// Crear la carpeta 'json' si no existe
if (!fs.existsSync(carpetaJson)){
    fs.mkdirSync(carpetaJson);
}

// Inicializar la Base de Datos NoSQL de Buques si no existe
if (!fs.existsSync(pathBD)) {
    const buquesIniciales = [
        { id: 1, nombre: "MSC KANOKO", estado: "FONDEADO", puerto_origen: "VALPARAÍSO", calado: "14.5m", icono: "bi-ship-at-sea" },
        { id: 2, nombre: "VALPARAISO EXPRESS", estado: "EN RUTA", puerto_origen: "CALLAO", calado: "12.1m", icono: "bi-tsunami" },
        { id: 3, nombre: "COPIAPO", estado: "MANIOBRA ATRAQUE", puerto_origen: "SAN ANTONIO", calado: "13.8m", icono: "bi-anchor" }
    ];
    fs.writeFileSync(pathBD, JSON.stringify(buquesIniciales, null, 2));
}

// Servidor HTTP con Enrutamiento estricto
const server = http.createServer((req, res) => {
    
    // CORRECCIÓN CRÍTICA: Interceptamos la petición de la API mediante coincidencia de texto exacta
    if (req.url === '/api/buques' || req.url.endsWith('/api/buques')) {
        fs.readFile(pathBD, 'utf8', (err, data) => {
            if (err) {
                res.writeHead(500, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: "Error en la base de datos" }));
                return;
            }
            res.writeHead(200, { 
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*' 
            });
            res.end(data);
        });
        return; // IMPORTANTE: Corta la ejecución para que no busque un archivo html
    }

    // ENRUTADOR ESTÁTICO DE ARCHIVOS
    let urlSolicitada = req.url === '/' ? '/maritimo.html' : req.url;
    let filePath = path.join(rutaRaiz, urlSolicitada);

    const extname = String(path.extname(filePath)).toLowerCase();
    const mimeTypes = {
        '.html': 'text/html',
        '.js': 'text/javascript',
        '.css': 'text/css',
        '.json': 'application/json',
        '.png': 'image/png',
        '.jpg': 'image/jpg',
        '.svg': 'image/svg+xml'
    };

    const contentType = mimeTypes[extname] || 'application/octet-stream';

    fs.readFile(filePath, (error, content) => {
        if (error) {
            if (error.code === 'ENOENT') {
                res.writeHead(404, { 'Content-Type': 'text/html' });
                res.end('<h1>404 - No encontrado en Control Room</h1>', 'utf-8');
            } else {
                res.writeHead(500);
                res.end('Error interno: ' + error.code + '\n');
            }
        } else {
            res.writeHead(200, { 'Content-Type': contentType });
            res.end(content, 'utf-8');
        }
    });
});

server.listen(PORT, () => {
    console.log("=========================================================");
    console.log(` CONTROL ROOM ACTIVADA CON RUTA ABSOLUTA`);
    console.log(` Abre la aplicación en: http://localhost:${PORT}`);
    console.log("=========================================================");
}); 