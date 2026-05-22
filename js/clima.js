const API_KEY = "0078d062735a1aec2a2bb8bd22b6b70a";
const LAT = -23.1;
const LON = -70.4;

// 1. FUNCIÓN ASÍNCRONA PARA EL CLIMA (API DE TERCEROS)
async function actualizarClimaReal() {
    try {
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${LAT}&lon=${LON}&appid=${API_KEY}&units=metric&lang=es`);
        const datos = await response.json();
        
        if (datos.cod === 200) {
            const container = document.getElementById('weather-container');
            if (container) {
                const tempReal = Math.round(datos.main.temp);
                const descReal = datos.weather[0].description;
                const vientoReal = datos.wind.speed;
                const humedad = datos.main.humidity;

                // Alerta lógica por viento fuerte (Regla de negocio examen final)
                let claseAlertaViento = "text-info fw-bold"; 
                let mensajeSeguridad = "";
                
                if (vientoReal > 8.5) {
                    claseAlertaViento = "text-danger fw-bold text-decoration-underline";
                    mensajeSeguridad = `<div class="alert alert-danger py-1 px-2 mt-2 mb-0 small text-center fw-bold" style="font-size: 0.65rem; border-radius:6px;">
                                            <i class="bi bi-exclamation-triangle-fill me-1"></i> PUERTO CERRADO: VIENTO SEVERO
                                        </div>`;
                }

                container.innerHTML = `
                    <div class="d-flex flex-column align-items-center w-100 p-2">
                        <i class="bi bi-cloud-sun text-info mb-1" style="font-size: 2.8rem;"></i>
                        <div class="h2 fw-bold text-white mb-0" style="font-size: 1.8rem;">${tempReal}°C</div>
                        <p class="text-secondary small text-uppercase fw-bold mb-1" style="letter-spacing: 0.5px; font-size: 0.7rem;">
                            ${descReal} - MEJILLONES
                        </p>
                        
                        ${mensajeSeguridad}
                        
                        <hr class="w-100 border-secondary opacity-25 my-2">
                        
                        <div class="row w-100 g-0">
                            <div class="col-6 d-flex flex-column align-items-center border-end border-secondary border-opacity-25">
                                <i class="bi bi-wind text-danger fs-5 mb-1"></i>
                                <span class="${claseAlertaViento}" style="font-size: 0.85rem;">${vientoReal} m/s</span>
                                <span class="text-secondary text-uppercase" style="font-size: 0.55rem;">Viento</span>
                            </div>
                            <div class="col-6 d-flex flex-column align-items-center">
                                <i class="bi bi-droplets text-info fs-5 mb-1"></i>
                                <span class="text-info fw-bold" style="font-size: 0.85rem;">${humedad}%</span>
                                <span class="text-secondary text-uppercase" style="font-size: 0.55rem;">Humedad</span>
                            </div>
                        </div>
                    </div>
                `;
            }
        }
    } catch (error) {
        console.error("Error en la API de clima externa:", error);
        const container = document.getElementById('weather-container');
        if (container) {
            container.innerHTML = `
                <div class="text-danger small p-2 text-center">
                    <i class="bi bi-exclamation-octagon fs-4 d-block mb-1"></i>
                    Telemetría meteorológica no disponible temporalmente
                </div>`;
        }
    }
}

// 2. FUNCIÓN ASÍNCRONA PARA LOS BUQUES (TU PROPIO BACKEND NODE)
async function cargarBuquesBD() {
    try {
        const response = await fetch('http://localhost:3000/api/buques');
        const buques = await response.json();
        const container = document.getElementById('ship-list');
        
        if (container && Array.isArray(buques)) {
            container.innerHTML = ''; 
            
            buques.forEach(buque => {
                container.innerHTML += `
                    <div class="d-flex align-items-center justify-content-between border-bottom border-secondary border-opacity-10 py-2 w-100 px-3 my-1" style="background-color: rgba(255,255,255,0.02); border-radius: 6px;">
                        <div class="d-flex align-items-center" style="max-width: 75%;">
                            <i class="bi text-warning fs-5 me-3"></i>
                            <div class="text-start">
                                <strong style="color: #FFD800; font-size: 0.85rem; display:block; margin-bottom: 2px;">${buque.nombre}</strong>
                                <small class="text-secondary d-block" style="font-size: 0.65rem; opacity: 0.8;">Origen: ${buque.puerto_origen} | Calado: ${buque.calado}</small>
                            </div>
                        </div>
                        <div class="text-end" style="min-width: 90px;">
                            <span class="badge ${buque.estado === 'EN RUTA' ? 'bg-success text-dark' : buque.estado === 'FONDEADO' ? 'bg-primary' : 'bg-warning text-dark'} p-1 px-2 fw-bold" style="font-size: 0.6rem; border-radius:4px; display: inline-block; width: 100%; text-center;">
                                ${buque.estado}
                            </span>
                        </div>
                    </div>
                `;
            });
        }
    } catch (error) {
        console.error("Error al cargar la base de datos de naves:", error);
        const container = document.getElementById('ship-list');
        if (container) {
            container.innerHTML = `
                <div class="text-danger small p-3 text-center w-100">
                    <i class="bi bi-database-fill-slash fs-4 d-block mb-1"></i>
                    Error de conexión: Bitácora NoSQL fuera de línea (Backend offline)
                </div>`;
        }
    }
}

// Inicializador del DOM
document.addEventListener('DOMContentLoaded', () => {
    actualizarClimaReal();
    cargarBuquesBD();
});