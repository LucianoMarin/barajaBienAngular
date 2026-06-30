(function () {
    'use strict'

    function verificarSesion() {
        const sesion = localStorage.getItem('userSession');

        if (!sesion) {
            window.location.href = "./login";
            return null;
        }

        try {
            const datosSesion = JSON.parse(sesion);

            if (!datosSesion.logueado) {
                window.location.href = "./login";
                return null;
            }

            return datosSesion;
        } catch (error) {
            window.location.href = "./login";
            return null;
        }
    }

    function obtenerSesion() {
        const sesion = localStorage.getItem('userSession');
        if (!sesion) return null;

        try {
            return JSON.parse(sesion);
        } catch (error) {
            return null;
        }
    }

    function cerrarSesion() {
        localStorage.removeItem('userSession');
        window.location.href = "./login";
    }

    function mostrarInfoUsuario() {
        const sesion = obtenerSesion();
        if (!sesion) return;

        const bienvenida = document.querySelector('#bienvenida');
        const usuarioInfo = document.querySelector('#mensaje');

        if (bienvenida) {
            bienvenida.textContent = `Bienvenido ${sesion.nombres || ''} ${sesion.apellido_paterno || ''}`;
        }

        if (usuarioInfo) {
            usuarioInfo.innerHTML = `
                <p><strong>Usuario:</strong> ${sesion.usuario || 'No disponible'}</p>
                <p><strong>Nombre:</strong> ${sesion.nombres || ''} ${sesion.apellido_paterno || ''} ${sesion.apellido_materno || ''}</p>
                <p><strong>Edad:</strong> ${sesion.edad || 'No disponible'} años</p>
                <p><strong>Ciudad:</strong> ${sesion.ciudad || 'No disponible'}</p>
                <p><strong>Dirección:</strong> ${sesion.direccion || 'No disponible'}</p>
                <p><strong>Rol:</strong> ${sesion.rol || 'normal'}</p>
            `;
        }
    }

    const sesionActual = verificarSesion();

    if (sesionActual) {
        mostrarInfoUsuario();

        const btnCerrarSesion = document.querySelector('#btnCerrarSesion');
        if (btnCerrarSesion) {
            btnCerrarSesion.addEventListener('click', function (e) {
                e.preventDefault();
                cerrarSesion();
            });
        }





    }


    function mostrarNavPorRol() {
        const sesion = JSON.parse(localStorage.getItem('userSession'));
        const gestionarUsuario = document.querySelector('#gestionar_usuario');

        if (gestionarUsuario) {
            if (!sesion || sesion.rol !== 'administrador') {
                gestionarUsuario.style.display = 'none';
            } else {
                gestionarUsuario.style.display = 'block';
            }
        }
    }

    document.addEventListener('DOMContentLoaded', function () {
        mostrarNavPorRol();
    });


})();