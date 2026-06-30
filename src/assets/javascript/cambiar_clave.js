(function() {
    'use strict'

    const formulario = document.querySelector('#formulario_cambiar_clave');
    const btnModificar = document.querySelector('#btnModificar');
    const mensaje = document.querySelector('#mensajeModificar');

    function mostrarMensaje(texto, esError = true) {
        if (mensaje) {
            mensaje.innerHTML = '';
            const li = document.createElement('li');
            li.textContent = texto;
            li.style.color = esError ? 'red' : 'green';
            li.style.fontWeight = 'bold';
            mensaje.appendChild(li);
        }
    }

    function limpiarMensaje() {
        if (mensaje) {
            mensaje.innerHTML = '';
        }
    }

    function obtenerSesionActual() {
        const sesion = localStorage.getItem('userSession');
        if (!sesion) return null;
        try {
            return JSON.parse(sesion);
        } catch (error) {
            return null;
        }
    }

    function actualizarContraseña(usuario, nuevaContraseña) {
        const usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];
        
        const usuarioIndex = usuarios.findIndex(u => u.usuario.toLowerCase() === usuario.toLowerCase());
        
        if (usuarioIndex === -1) {
            return false;
        }
        
        usuarios[usuarioIndex].contraseña = nuevaContraseña;
        localStorage.setItem("usuarios", JSON.stringify(usuarios));
        
        const sesionActual = obtenerSesionActual();
        if (sesionActual && sesionActual.usuario.toLowerCase() === usuario.toLowerCase()) {
            sesionActual.contraseña = nuevaContraseña;
            localStorage.setItem('userSession', JSON.stringify(sesionActual));
        }
        
        return true;
    }

    function validarCampos() {
        let esValido = true;
        
        const usuarioInput = document.querySelector('#usuario');
        const antiguaClaveInput = document.querySelector('#antigua_contraseña');
        const nuevaClaveInput = document.querySelector('#nueva_contraseña');
        const confirmarClaveInput = document.querySelector('#confirmar_contraseña');
        
        limpiarMensaje();
        
        if (usuarioInput) usuarioInput.style.border = "";
        if (antiguaClaveInput) antiguaClaveInput.style.border = "";
        if (nuevaClaveInput) nuevaClaveInput.style.border = "";
        if (confirmarClaveInput) confirmarClaveInput.style.border = "";
        
        const sesionActual = obtenerSesionActual();
        
        if (!usuarioInput.value.trim()) {
            mostrarMensaje("Usuario es obligatorio");
            if (usuarioInput) usuarioInput.style.border = "2px solid red";
            esValido = false;
        } else if (!sesionActual || usuarioInput.value.trim() !== sesionActual.usuario) {
            mostrarMensaje("El usuario no coincide con la sesión actual");
            if (usuarioInput) usuarioInput.style.border = "2px solid red";
            esValido = false;
        }
        
        if (!antiguaClaveInput.value.trim()) {
            mostrarMensaje("Antigua contraseña es obligatoria");
            if (antiguaClaveInput) antiguaClaveInput.style.border = "2px solid red";
            esValido = false;
        } else if (sesionActual && antiguaClaveInput.value.trim() !== sesionActual.contraseña) {
            mostrarMensaje("Antigua contraseña incorrecta");
            if (antiguaClaveInput) antiguaClaveInput.style.border = "2px solid red";
            esValido = false;
        }
        
        if (!nuevaClaveInput.value.trim()) {
            mostrarMensaje("Nueva contraseña es obligatoria");
            if (nuevaClaveInput) nuevaClaveInput.style.border = "2px solid red";
            esValido = false;
        } else if (nuevaClaveInput.value.trim().length < 8) {
            mostrarMensaje("La nueva contraseña debe tener al menos 8 caracteres");
            if (nuevaClaveInput) nuevaClaveInput.style.border = "2px solid red";
            esValido = false;
        }
        
        if (!confirmarClaveInput.value.trim()) {
            mostrarMensaje("Confirmar contraseña es obligatorio");
            if (confirmarClaveInput) confirmarClaveInput.style.border = "2px solid red";
            esValido = false;
        } else if (nuevaClaveInput.value.trim() !== confirmarClaveInput.value.trim()) {
            mostrarMensaje("Las contraseñas nuevas no coinciden");
            if (confirmarClaveInput) confirmarClaveInput.style.border = "2px solid red";
            esValido = false;
        }
        
        return esValido;
    }

    function cargarUsuarioSesion() {
        const sesionActual = obtenerSesionActual();
        const usuarioInput = document.querySelector('#usuario');
        
        if (sesionActual && usuarioInput) {
            usuarioInput.value = sesionActual.usuario;
            usuarioInput.readOnly = true;
        }
    }

    if (formulario) {
        formulario.addEventListener('submit', function(e) {
            e.preventDefault();
            
            if (!validarCampos()) {
                return;
            }
            
            const usuarioInput = document.querySelector('#usuario');
            const nuevaClaveInput = document.querySelector('#nueva_contraseña');
            
            if (actualizarContraseña(usuarioInput.value.trim(), nuevaClaveInput.value.trim())) {
                mostrarMensaje("Contraseña modificada exitosamente", false);
                
             
                    localStorage.removeItem('userSession');
                    window.location.href = "../login";
               
            } else {
                mostrarMensaje("Error al modificar la contraseña");
            }
        });
    }
    
    if (btnModificar) {
        btnModificar.addEventListener('click', function(e) {
            if (formulario) {
                formulario.dispatchEvent(new Event('submit'));
            }
        });
    }
    
    cargarUsuarioSesion();
})();