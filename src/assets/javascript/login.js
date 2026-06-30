(function () {
    'use strict'

    const formularioLogin = document.querySelector('#formulario_login');
    const btnIngresar = document.querySelector('#ingresar');
    const mensajeError = document.querySelector('#mensaje');

    function mostrarMensaje(mensaje, esError = true) {
        if (mensajeError) {
            mensajeError.innerHTML = '';
            const li = document.createElement('li');
            li.textContent = mensaje;
            li.style.color = esError ? 'red' : 'green';
            li.style.fontWeight = 'bold';
            mensajeError.appendChild(li);
        }
    }

    function limpiarMensaje() {
        if (mensajeError) {
            mensajeError.innerHTML = '';
        }
    }

    function validarLogin() {
        let esValido = true;

        const usuario = document.querySelector('#usuario');
        const clave = document.querySelector('#contraseña');

        limpiarMensaje();

        if (usuario) usuario.style.border = "";
        if (clave) clave.style.border = "";

        if (!usuario.value.trim()) {
            mostrarMensaje("Usuario es obligatorio");
            if (usuario) usuario.style.border = "2px solid red";
            esValido = false;
        }
        else if (!clave.value.trim()) {
            mostrarMensaje("Contraseña es obligatoria");
            if (clave) clave.style.border = "2px solid red";
            esValido = false;
        }

        return esValido;
    }

    function iniciarSesion(usuario, clave) {
        const usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];

        const usuarioEncontrado = usuarios.find(u =>
            u.usuario.toLowerCase() === usuario.toLowerCase() &&
            u.contraseña === clave
        );

        if (!usuarioEncontrado) {
            mostrarMensaje("Usuario o contraseña incorrectos");
            return false;
        }

        let rol = "normal";
        if (usuarioEncontrado.rol) {
            rol = usuarioEncontrado.rol;
        }

        const sesion = {
            logueado: true,
            usuario: usuarioEncontrado.usuario,
            contraseña: usuarioEncontrado.contraseña,
            nombres: usuarioEncontrado.nombres || '',
            apellido_paterno: usuarioEncontrado.apellido_paterno || '',
            apellido_materno: usuarioEncontrado.apellido_materno || '',
            fecha_nacimiento: usuarioEncontrado.fecha_nacimiento || '',
            edad: usuarioEncontrado.edad || '',
            ciudad: usuarioEncontrado.ciudad || '',
            direccion: usuarioEncontrado.direccion || '',
            rol: rol
        };
        localStorage.setItem('userSession', JSON.stringify(sesion));
        return true;
    }

    if (formularioLogin) {
        formularioLogin.addEventListener('submit', function (e) {
            e.preventDefault();

            if (!validarLogin()) {
                return;
            }

            const usuario = document.querySelector('#usuario').value.trim();
            const clave = document.querySelector('#contraseña').value.trim();

            if (iniciarSesion(usuario, clave)) {
                mostrarMensaje("Inicio de sesión exitoso! Redirigiendo...", false);
            
                    window.location.href = "./perfil";
               
            }
        });
    }

    if (btnIngresar) {
        btnIngresar.addEventListener('click', function (e) {
            if (formularioLogin) {
                formularioLogin.dispatchEvent(new Event('submit'));
            }
        });
    }




})();