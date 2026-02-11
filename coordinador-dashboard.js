document.addEventListener('DOMContentLoaded', () => {
    const usuario = JSON.parse(localStorage.getItem('usuarioActivo'));
    if (!usuario || (usuario.rol !== 'coordinador' && usuario.rol !== 'docente')) { // Permitimos a docentes ver, pero no gestionar
        window.location.href = 'index.html';
        return;
    }
    cargarExcusas();
    mostrar('pendientes');
});

function cargarExcusas() {
    const excusasGlobales = JSON.parse(localStorage.getItem('excusas')) || [];
    const hoy = new Date();

    const pendientes = excusasGlobales.filter(e => e.status === 'en-espera');
    const aceptadas = excusasGlobales.filter(e => e.status === 'aceptada' && new Date(e.fechaFin) >= hoy);
    const denegadas = excusasGlobales.filter(e => e.status === 'denegada');
    const vencidas = excusasGlobales.filter(e => e.status === 'aceptada' && new Date(e.fechaFin) < hoy);

    mostrarExcusasEnContenedor('pendientes-container', pendientes, true);
    mostrarExcusasEnContenedor('aceptadas-container', aceptadas, false);
    mostrarExcusasEnContenedor('denegadas-container', denegadas, false);
    mostrarExcusasEnContenedor('vencidas-container', vencidas, false);
}

function mostrarExcusasEnContenedor(containerId, excusas, conAcciones) {
    const contenedor = document.getElementById(containerId);
    contenedor.innerHTML = '';
    if (excusas.length === 0) {
        contenedor.innerHTML = '<p>No hay excusas en esta categoría.</p>';
        return;
    }

    excusas.forEach(excusa => {
        const excusaDiv = document.createElement('div');
        excusaDiv.className = 'excusa-item';
        let accionesHTML = '';
        if (conAcciones) {
            accionesHTML = `
                <div class="acciones">
                    <button onclick="actualizarEstado(${excusa.id}, 'aceptada')">Aceptar</button>
                    <button onclick="actualizarEstado(${excusa.id}, 'denegada')">Denegar</button>
                </div>
            `;
        }

        excusaDiv.innerHTML = `
            <h4>Estudiante: ${excusa.estudiante.nombre} (Grado: ${excusa.grado})</h4>
            <p><strong>Acudiente:</strong> ${excusa.acudiente.nombre} (${excusa.creadoPor})</p>
            <p><strong>Fechas:</strong> ${excusa.fechaInicio} a ${excusa.fechaFin}</p>
            <button class="ver-mas" onclick="abrirModalConDetalles(${excusa.id})">Ver más</button>
            ${accionesHTML}
        `;
        contenedor.appendChild(excusaDiv);
    });
}

function actualizarEstado(id, nuevoEstado) {
    let excusasGlobales = JSON.parse(localStorage.getItem('excusas')) || [];
    const indice = excusasGlobales.findIndex(e => e.id === id);

    if (indice !== -1) {
        excusasGlobales[indice].status = nuevoEstado;
        localStorage.setItem('excusas', JSON.stringify(excusasGlobales));
        alert(`La excusa ha sido ${nuevoEstado}.`);
        cargarExcusas(); // Recargar la vista para reflejar el cambio
    }
}

function mostrar(seccion) {
    document.getElementById('pendientes-excusas').classList.add('hidden');
    document.getElementById('aceptadas-excusas').classList.add('hidden');
    document.getElementById('denegadas-excusas').classList.add('hidden');
    document.getElementById('vencidas-excusas').classList.add('hidden');

    document.getElementById(`${seccion}-excusas`).classList.remove('hidden');
}

function cerrarSesion() {
    localStorage.removeItem('usuarioActivo');
    window.location.href = 'index.html';
}

// --- Lógica de la Ventana Modal ---

function abrirModalConDetalles(id) {
    const excusasGlobales = JSON.parse(localStorage.getItem('excusas')) || [];
    const excusa = excusasGlobales.find(e => e.id === id);

    if (!excusa) return;

    const modalBody = document.getElementById('modal-body');
    modalBody.innerHTML = `
        <h4>Detalles Completos</h4>
        <p><strong>Estudiante:</strong> ${excusa.estudiante.nombre}</p>
        <p><strong>Tipo de Documento (Estudiante):</strong> ${excusa.estudiante.tipoDoc}</p>
        <p><strong>Número de Documento (Estudiante):</strong> ${excusa.estudiante.documento}</p>
        <p><strong>Grado:</strong> ${excusa.grado}</p>
        <hr>
        <p><strong>Acudiente:</strong> ${excusa.acudiente.nombre}</p>
        <p><strong>Tipo de Documento (Acudiente):</strong> ${excusa.acudiente.tipoDoc}</p>
        <p><strong>Número de Documento (Acudiente):</strong> ${excusa.acudiente.documento}</p>
        <p><strong>Email de Contacto:</strong> ${excusa.creadoPor}</p>
        <hr>
        <p><strong>Tipo de Excusa:</strong> ${excusa.tipo}</p>
        <p><strong>Fechas:</strong> ${excusa.fechaInicio} a ${excusa.fechaFin}</p>
        <p><strong>Motivo:</strong> ${excusa.motivo}</p>
        <p><strong>Firma del Acudiente:</strong></p>
        <img src="${excusa.firma}" alt="Firma del acudiente">
    `;

    document.getElementById('modal-detalles').style.display = 'flex';
}

function cerrarModal() {
    document.getElementById('modal-detalles').style.display = 'none';
}
