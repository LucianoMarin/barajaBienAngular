// recuperar.js

(function() {
    'use strict'

    const btnRecuperar = document.getElementById('btnRecuperar');
    const mensajeDiv = document.getElementById('mensajeRecuperar');
    const inputUsuario = document.getElementById('usuario');

    function obtenerUsuarios() {
        const usuarios = localStorage.getItem('usuarios');
        return usuarios ? JSON.parse(usuarios) : [];
    }

    function buscarUsuario(usuarioBuscado) {
        const usuarios = obtenerUsuarios();
        return usuarios.find(u => u.usuario.toLowerCase() === usuarioBuscado.toLowerCase());
    }

    function mostrarMensaje(tipo, contenido) {
        mensajeDiv.innerHTML = contenido;
        mensajeDiv.style.display = "block";
        
        if (tipo === "exito") {
            mensajeDiv.className = "alert alert-success";
        } else if (tipo === "error") {
            mensajeDiv.className = "alert alert-danger";
        } else if (tipo === "advertencia") {
            mensajeDiv.className = "alert alert-warning";
        }
    }

    function manejarRecuperacion() {
        const usuarioBuscado = inputUsuario.value.trim();
        
        if (usuarioBuscado === "") {
            mostrarMensaje("advertencia", "Por favor, ingrese un nombre de usuario");
            return;
        }

        const usuarioEncontrado = buscarUsuario(usuarioBuscado);
        
        if (usuarioEncontrado) {
            const contenido = `
                <strong> Usuario encontrado!</strong><br>
                Usuario: ${usuarioEncontrado.usuario}<br>
                Contraseña: "${usuarioEncontrado.contraseña}"<br>
                Rol: ${usuarioEncontrado.rol || "normal"}
            `;
            mostrarMensaje("exito", contenido);
        } else {
            mostrarMensaje("error", ` El usuario "${usuarioBuscado}" no existe en el sistema`);
        }
    }

    function limpiarMensaje() {
        mensajeDiv.style.display = "none";
    }

    function manejarEnter(e) {
        if (e.key === 'Enter') {
            manejarRecuperacion();
        }
    }

    btnRecuperar.addEventListener('click', manejarRecuperacion);
    inputUsuario.addEventListener('input', limpiarMensaje);
    inputUsuario.addEventListener('keypress', manejarEnter);
})();