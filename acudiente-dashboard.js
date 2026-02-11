const usuario = JSON.parse(localStorage.getItem("usuarioActivo"));
if (!usuario) {
    window.location.href = "index.html";
}

document.addEventListener("DOMContentLoaded", () => {
    cargarExcusas();
    mostrar('activas');
});

// ================= MOSTRAR SECCIONES =================
function mostrar(id) {
    // Oculta todas las secciones
    document.querySelectorAll('.seccion').forEach(seccion => {
        seccion.style.display = 'none';
    });

    // Muestra la sección seleccionada
    const seccionActiva = document.getElementById(id);
    if (seccionActiva) {
        seccionActiva.style.display = 'block';
        
        // Desplazamiento suave a la sección
        seccionActiva.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    }
}
// ================= ABRIR FORMULARIOS (MODIFICADO) =================
function abrirFormulario(tipo) {
    // Campos comunes para todos los formularios
    let html = `
    <form onsubmit="guardarExcusa(event, '${tipo}')">
      <label for="fecha">Fecha:</label>
      <input type="date" id="fecha" required>
 
      <label for="estudiante">Nombre del estudiante:</label>
      <input type="text" id="estudiante" placeholder="Nombre completo del estudiante" required>
 
      <label for="tipoDocEst">Tipo de documento del estudiante:</label>
      <select id="tipoDocEst" required>
        <option value="" disabled selected>Selecciona un tipo</option>
        <option value="TI">Tarjeta de Identidad</option>
        <option value="CC">Cédula de Ciudadanía</option>
        <option value="CE">Cédula de Extranjería</option>
      </select>

      <label for="docEst">Número de documento del estudiante:</label>
      <input type="text" id="docEst" placeholder="Número de documento" required>
      
      <label for="grado">Grado:</label>
      <select id="grado" required>
        <option value="" disabled selected>Selecciona el grado</option>
        ${generarOpcionesGrados()}
      </select>
 
      <label for="acudiente">Nombre del acudiente:</label>
      <input type="text" id="acudiente" value="${usuario.nombre}" required>
 
      <label for="tipoDocAcu">Tipo de documento del acudiente:</label>
      <select id="tipoDocAcu" required>
        <option value="" disabled selected>Selecciona un tipo</option>
        <option value="CC">Cédula de Ciudadanía</option>
        <option value="CE">Cédula de Extranjería</option>
      </select>
 
      <label for="docAcu">Número de documento del acudiente:</label>
      <input type="text" id="docAcu" placeholder="Número de documento" required>
    `;
 
    // Campos específicos por tipo de excusa
    switch (tipo) {
        case 'medica':
            html += `
              <label for="motivo">Motivo de inasistencia:</label>
              <textarea id="motivo" placeholder="Ej: Cita médica general" required></textarea>
              <label for="dias">Días de excusa:</label>
              <input type="number" id="dias" placeholder="Número de días" required>
            `;
            break;
        case 'salida':
            html += `
              <label for="motivo">Motivo de la salida:</label>
              <textarea id="motivo" placeholder="Ej: Cita odontológica" required></textarea>
            `;
            break;
        case 'incapacidad':
            html += `
              <label for="motivo">Motivo de inasistencia:</label>
              <textarea id="motivo" placeholder="Ej: Incapacidad por enfermedad" required></textarea>
              <label for="dias">Días de incapacidad:</label>
              <input type="number" id="dias" placeholder="Número de días" required>
              <label for="archivo">Cargar archivo de incapacidad:</label>
              <input type="file" id="archivo" accept="image/*,.pdf" required>
            `;
            break;
        case 'inasistencia':
            html += `
              <label for="motivo">Motivo de la inasistencia:</label>
              <textarea id="motivo" placeholder="Ej: Calamidad doméstica" required></textarea>
              <label for="dias">Días de inasistencia:</label>
              <input type="number" id="dias" placeholder="Número de días" required>
            `;
            break;
    }
 
    // Firma (común para todos) y botón de envío
    html += `
      <label>Firma del acudiente:</label>
      <canvas id="firmaCanvas"></canvas>
      <button type="button" onclick="limpiarFirma()">Limpiar Firma</button>
      <button type="submit">Guardar Excusa</button>
    </form>`;
 
    document.getElementById("formulario").innerHTML = html;
    activarFirma(); // Activar la lógica del canvas para la firma
}
 
function generarOpcionesGrados() {
    let opciones = '';
    for (let i = 6; i <= 11; i++) {
        for (let j = 1; j <= 5; j++) {
            const grado = `${i}-${j}`;
            opciones += `<option value="${grado}">Grado ${grado}</option>`;
        }
    }
    return opciones;
}
 
// ================= FIRMA DIGITAL =================
let firmaCanvas, ctx, dibujando = false;
 
function activarFirma() {
    firmaCanvas = document.getElementById("firmaCanvas");
    if (!firmaCanvas) return;
    ctx = firmaCanvas.getContext("2d");
    ctx.lineWidth = 2;
    ctx.lineCap = 'round';
 
    // Eventos para Mouse (Desktop)
    firmaCanvas.addEventListener("mousedown", (e) => {
        dibujando = true;
        ctx.beginPath();
        ctx.moveTo(e.offsetX, e.offsetY);
    });
    firmaCanvas.addEventListener("mouseup", () => dibujando = false);
    firmaCanvas.addEventListener("mousemove", (e) => {
        if (!dibujando) return;
        ctx.lineTo(e.offsetX, e.offsetY);
        ctx.stroke();
    });
    firmaCanvas.addEventListener("mouseout", () => dibujando = false);
 
    // Eventos para Táctil (Móvil)
    firmaCanvas.addEventListener("touchstart", (e) => {
        if (e.target == firmaCanvas) e.preventDefault();
        const t = e.touches[0];
        const rect = firmaCanvas.getBoundingClientRect();
        dibujando = true;
        ctx.beginPath();
        ctx.moveTo(t.clientX - rect.left, t.clientY - rect.top);
    }, { passive: false });
    firmaCanvas.addEventListener("touchend", (e) => {
        if (e.target == firmaCanvas) e.preventDefault();
        dibujando = false;
    }, { passive: false });
    firmaCanvas.addEventListener("touchmove", (e) => {
        if (e.target == firmaCanvas) e.preventDefault();
        if (!dibujando) return;
        const t = e.touches[0];
        const rect = firmaCanvas.getBoundingClientRect();
        ctx.lineTo(t.clientX - rect.left, t.clientY - rect.top);
        ctx.stroke();
    }, { passive: false });
}
 
function limpiarFirma() {
    if (ctx) {
        ctx.clearRect(0, 0, firmaCanvas.width, firmaCanvas.height);
    }
}
 
// ================= GUARDAR EXCUSA (MODIFICADO) =================
function guardarExcusa(e, tipo) {
    e.preventDefault();
 
    const firmaData = firmaCanvas.toDataURL();
    if (firmaCanvas.getContext('2d').getImageData(0, 0, firmaCanvas.width, firmaCanvas.height).data.some(channel => channel !== 0)) {
        // El canvas no está vacío
    } else {
        alert("Por favor, la firma del acudiente es requerida.");
        return;
    }
 
    const fechaInicio = document.getElementById("fecha").value;
    let fechaFin = fechaInicio;
    const diasInput = document.getElementById("dias");
    if (diasInput && diasInput.value) {
        const dias = parseInt(diasInput.value);
        const f = new Date(fechaInicio);
        f.setDate(f.getDate() + dias);
        fechaFin = f.toISOString().split("T")[0];
    }
 
    const excusa = {
        id: Date.now(), // ID único para cada excusa
        status: 'en-espera', // Estado inicial
        creadoPor: usuario.correo,
        tipo,
        fechaInicio,
        fechaFin,
        estudiante: {
            nombre: document.getElementById("estudiante").value,
            tipoDoc: document.getElementById("tipoDocEst").value,
            documento: document.getElementById("docEst").value,
        },
        grado: document.getElementById("grado").value,
        acudiente: {
            nombre: document.getElementById("acudiente").value,
            tipoDoc: document.getElementById("tipoDocAcu").value,
            documento: document.getElementById("docAcu").value,
        },
        motivo: document.getElementById("motivo") ? document.getElementById("motivo").value : '',
        firma: firmaData,
        // Falta guardar el archivo de incapacidad, lo haremos en un próximo paso
    };
 
    const excusasGlobales = JSON.parse(localStorage.getItem("excusas")) || [];
    excusasGlobales.push(excusa);
    localStorage.setItem("excusas", JSON.stringify(excusasGlobales));
 
    alert("✅ Excusa guardada correctamente");
    document.getElementById("formulario").innerHTML = "";
    cargarExcusas();
    mostrar("activas");
}
 
// ================= CARGAR EXCUSAS (MODIFICADO) =================
function cargarExcusas() {
    const hoy = new Date();
    const excusasGlobales = JSON.parse(localStorage.getItem("excusas")) || [];
    
    const misExcusas = excusasGlobales.filter(e => e.creadoPor === usuario.correo);

    // Asumimos que existen estos contenedores en el HTML
    const activasCont = document.getElementById("activas");
    const vencidasCont = document.getElementById("vencidas");
    const pendientesCont = document.getElementById("pendientes"); // Nuevo
    const rechazadasCont = document.getElementById("rechazadas"); // Nuevo

    // Limpiar contenedores y añadir títulos
    activasCont.innerHTML = "<h3>Excusas Aceptadas (Activas)</h3>";
    vencidasCont.innerHTML = "<h3>Excusas Aceptadas (Vencidas)</h3>";
    pendientesCont.innerHTML = "<h3>Excusas Pendientes de Revisión</h3>";
    rechazadasCont.innerHTML = "<h3>Excusas Rechazadas</h3>";

    const excusasActivas = misExcusas.filter(e => e.status === 'aceptada' && new Date(e.fechaFin) >= hoy);
    const excusasVencidas = misExcusas.filter(e => e.status === 'aceptada' && new Date(e.fechaFin) < hoy);
    const excusasPendientes = misExcusas.filter(e => e.status === 'en-espera');
    const excusasRechazadas = misExcusas.filter(e => e.status === 'denegada');

    mostrarExcusasEnContenedor(excusasActivas, activasCont, "No tienes excusas activas.");
    mostrarExcusasEnContenedor(excusasVencidas, vencidasCont, "No tienes excusas vencidas.");
    mostrarExcusasEnContenedor(excusasPendientes, pendientesCont, "No tienes excusas pendientes de revisión.");
    mostrarExcusasEnContenedor(excusasRechazadas, rechazadasCont, "No tienes excusas rechazadas.");
}

function mostrarExcusasEnContenedor(excusas, contenedor, mensajeVacio) {
    if (excusas.length === 0) {
        contenedor.innerHTML += `<p>${mensajeVacio}</p>`;
        return;
    }

    excusas.forEach(e => {
        const card = `
            <div class="excusa-card" onclick="mostrarDetalleExcusa(${e.id})">
                <strong>Estudiante:</strong> ${e.estudiante.nombre} (Grado ${e.grado})<br>
                <strong>Tipo:</strong> ${e.tipo}<br>
                <strong>Vigente hasta:</strong> ${e.fechaFin}<br>
                <strong>Estado:</strong> <span class="status-${e.status}">${traducirEstado(e.status)}</span>
            </div>
        `;
        contenedor.innerHTML += card;
    });
}

function traducirEstado(estado) {
    switch (estado) {
        case 'en-espera':
            return 'En espera de revisión';
        case 'aceptada':
            return 'Aceptada';
        case 'denegada':
            return 'Denegada';
        default:
            return estado;
    }
}
 
function cerrarSesion() {
    localStorage.removeItem("usuarioActivo");
    window.location.href = "index.html";
}
