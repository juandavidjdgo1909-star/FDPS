document.addEventListener('DOMContentLoaded', () => {
    const usuario = JSON.parse(localStorage.getItem('usuarioActivo'));
    if (!usuario || (usuario.rol !== 'docente' && usuario.rol !== 'coordinador')) {
        window.location.href = 'index.html';
        return;
    }

    generarListaDeGrados();
});

function generarListaDeGrados() {
    const listaGrados = document.getElementById('lista-grados');
    if (!listaGrados) return;

    listaGrados.innerHTML = ''; // Limpiar por si acaso

    for (let i = 6; i <= 11; i++) {
        for (let j = 1; j <= 5; j++) {
            const grado = `${i}-${j}`;
            const gradoEl = document.createElement('div');
            gradoEl.className = 'grid-item';
            gradoEl.textContent = `Grado ${grado}`;
            gradoEl.onclick = () => verExcusasPorGrado(grado);
            listaGrados.appendChild(gradoEl);
        }
    }
}

function verExcusasPorGrado(grado) {
    // Ocultar la vista de grados y mostrar la de excusas
    document.getElementById('vista-grados').classList.add('hidden');
    document.getElementById('vista-excusas').classList.remove('hidden');

    // Actualizar título
    document.getElementById('titulo-grado-seleccionado').textContent = `Excusas para el Grado ${grado}`;

    // Cargar y filtrar excusas
    const excusasGlobales = JSON.parse(localStorage.getItem('excusas')) || [];
    const excusasDelGrado = excusasGlobales.filter(e => e.grado === grado && e.status === 'aceptada');

    const hoy = new Date();
    // Clonamos la fecha para no modificar la original
    const hoyClonadoParaActivas = new Date(hoy.getTime());
    const hoyClonadoParaVencidas = new Date(hoy.getTime());

    const activas = excusasDelGrado.filter(e => new Date(e.fechaFin) >= hoyClonadoParaActivas);
    
    // Lógica para eliminar excusas vencidas después de 7 días
    const unaSemanaAtras = new Date(hoyClonadoParaVencidas.setDate(hoyClonadoParaVencidas.getDate() - 7));
    const vencidas = excusasDelGrado.filter(e => {
        const fechaFin = new Date(e.fechaFin);
        return fechaFin < hoyClonadoParaActivas && fechaFin >= unaSemanaAtras;
    });

    mostrarExcusasEnContenedor('excusas-activas-container', activas);
    mostrarExcusasEnContenedor('excusas-vencidas-container', vencidas);
}

function mostrarExcusasEnContenedor(containerId, excusas) {
    const contenedor = document.getElementById(containerId);
    contenedor.innerHTML = '';
    if (excusas.length === 0) {
        contenedor.innerHTML = '<p>No hay excusas para mostrar en esta categoría.</p>';
        return;
    }

    excusas.forEach(excusa => {
        const excusaDiv = document.createElement('div');
        excusaDiv.className = 'excusa-item-docente';
        excusaDiv.innerHTML = `
            <h4>Estudiante: ${excusa.estudiante.nombre}</h4>
            <p><strong>Acudiente:</strong> ${excusa.acudiente.nombre}</p>
            <p><strong>Fechas:</strong> ${excusa.fechaInicio} a ${excusa.fechaFin}</p>
            <p><strong>Motivo:</strong> ${excusa.motivo}</p>
            <p><strong>Tipo:</strong> ${excusa.tipo}</p>
            <img src="${excusa.firma}" alt="Firma" style="width:100px; height:50px; border:1px solid #ccc; margin-top:10px;">
        `;
        contenedor.appendChild(excusaDiv);
    });
}

function volverAListaDeGrados() {
    document.getElementById('vista-grados').classList.remove('hidden');
    document.getElementById('vista-excusas').classList.add('hidden');
}

function cerrarSesion() {
    localStorage.removeItem('usuarioActivo');
    window.location.href = 'index.html';
}
