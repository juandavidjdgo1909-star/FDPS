document.addEventListener('DOMContentLoaded', () => {
    // Busca el interruptor en la página
    const themeToggleButton = document.getElementById('theme-toggle-button');
    
    // Si no hay interruptor en esta página, no hace nada más
    if (!themeToggleButton) {
        return;
    }

    // Revisa si el usuario ya tenía un tema guardado en su navegador
    const currentTheme = localStorage.getItem('theme');

    // Si el tema guardado es 'dark', activa el modo oscuro
    if (currentTheme === 'dark') {
        document.body.classList.add('dark-mode');
        themeToggleButton.checked = true;
    }

    // Se queda escuchando por si el usuario hace clic en el interruptor
    themeToggleButton.addEventListener('change', () => {
        if (themeToggleButton.checked) {
            // Si se marca, añade la clase 'dark-mode' al body
            document.body.classList.add('dark-mode');
            // Guarda la preferencia para que no se pierda al recargar
            localStorage.setItem('theme', 'dark');
        } else {
            // Si se desmarca, quita la clase 'dark-mode'
            document.body.classList.remove('dark-mode');
            // Guarda la preferencia
            localStorage.setItem('theme', 'light');
        }
    });
});
