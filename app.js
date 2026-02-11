document.addEventListener("DOMContentLoaded", () => {

  const btnLogin = document.getElementById("btnLogin");
  const btnRegister = document.getElementById("btnRegister");
  const loginForm = document.getElementById("login");
  const registerForm = document.getElementById("register");

  // Tabs
  btnLogin.onclick = () => {
    loginForm.classList.add("active");
    registerForm.classList.remove("active");
    btnLogin.classList.add("active");
    btnRegister.classList.remove("active");
  };

  btnRegister.onclick = () => {
    registerForm.classList.add("active");
    loginForm.classList.remove("active");
    btnRegister.classList.add("active");
    btnLogin.classList.remove("active");
  };
   // Lógica para mostrar/ocultar campo de contraseña de permiso
  const roleSelector = document.getElementById('roleSelector');
  const permissionPassword = document.getElementById('permissionPassword');
  if (roleSelector) {
      roleSelector.addEventListener('change', () => {
          const selectedRole = roleSelector.value;
          if (selectedRole === 'docente' || selectedRole === 'coordinador') {
              permissionPassword.style.display = 'block';
              permissionPassword.setAttribute('required', 'required');
          } else {
              permissionPassword.style.display = 'none';
              permissionPassword.removeAttribute('required');
          }
      });
  }

  // REGISTRO
  registerForm.addEventListener("submit", e => {
    e.preventDefault();

    const nombre = regNombre.value.trim();
    const correo = regCorreo.value.trim();
    const password = regPassword.value;

    const rol = roleSelector.value;
    const permiso = permissionPassword.value;

    if ((rol === 'docente' || rol === 'coordinador') && permiso !== 'FDPS1197463864') {
        alert("❌ El código de permiso para Docente o Coordinador es incorrecto.");
        return;
    }

    let usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];

    if (usuarios.some(u => u.correo === correo)) {
      alert("❌ Este correo ya está registrado");
      return;
    }

    usuarios.push({ nombre, correo, password, rol });
    localStorage.setItem("usuarios", JSON.stringify(usuarios));

    alert("✅ Cuenta creada, ahora inicia sesión");
    btnLogin.click();
  });

  // LOGIN
  loginForm.addEventListener("submit", e => {
    e.preventDefault();

    const correo = loginCorreo.value.trim();
    const password = loginPassword.value;

    const usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];

    const usuario = usuarios.find(
      u => u.correo === correo && u.password === password
    );

    if (!usuario) {
      alert("❌ Correo o contraseña incorrectos");
      return;
    }

    localStorage.setItem("usuarioActivo", JSON.stringify(usuario));
        alert(`✅ ¡Bienvenido, ${usuario.nombre}!`);
    // Redirección por rol
    if (usuario.rol === 'docente') {
        window.location.href = "dashboard.html"; // Panel de docentes
    } else if (usuario.rol === 'coordinador') {
        window.location.href = "coordinador-dashboard.html";
    } else {
        window.location.href = "acudiente-dashboard.html";
    }
  });

});
