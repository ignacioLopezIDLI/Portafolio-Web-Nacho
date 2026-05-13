const API_KEY = "0078d062735a1aec2a2bb8bd22b6b70a";
const LAT = -23.1;
const LON = -70.4;

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

                // Diseño compacto y ordenado
                container.innerHTML = `
                    <div class="d-flex flex-column align-items-center w-100">
                        <i class="bi bi-cloud-sun text-info mb-1" style="font-size: 3rem;"></i>
                        
                        <div class="h1 fw-bold text-white mb-0" style="font-size: 1.5rem;">${tempReal}°C</div>
                        
                        <p class="text-secondary small text-uppercase fw-bold mb-3" style="letter-spacing: 1px; font-size: 0.7rem;">
                            ${descReal} - MEJILLONES
                        </p>
                        
                        <hr class="w-100 border-secondary opacity-25 mb-3">
                        
                        <div class="row w-100 g-0">
                            <div class="col-6 d-flex flex-column align-items-center border-end border-secondary border-opacity-25">
                               <i class="bi bi-droplets text-info fs-4 mb-1"></i>
                                <span class="text-info fw-bold" style="font-size: 0.9rem;">${vientoReal} m/s</span>
                                <span class="text-secondary text-uppercase" style="font-size: 0.6rem;">Viento</span>
                            </div>
                            <div class="col-6 d-flex flex-column align-items-center">
                                <i class="bi bi-droplets text-info fs-4 mb-1"></i>
                                <span class="text-info fw-bold" style="font-size: 0.9rem;">${humedad}%</span>
                                <span class="text-secondary text-uppercase" style="font-size: 0.6rem;">Humedad</span>
                            </div>
                        </div>
                    </div>
                `;
            }
        }
    } catch (error) {
        console.error("Error en la API de clima:", error);
    }
}

document.addEventListener('DOMContentLoaded', actualizarClimaReal);