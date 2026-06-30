(function() {
    'use strict'

    const formulario = document.querySelector('#formulario_registro');
    const btnRegistrar = document.querySelector('#registrar');
    const mensajeCuerpo = document.querySelector('#mensaje');

    let usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];
    
    const adminExiste = usuarios.some(u => u.usuario === "admin");
    
    if (!adminExiste) {
        usuarios.push({
            usuario: "admin",
            contraseña: "admin",
            rol: "administrador"
        });
        
        localStorage.setItem("usuarios", JSON.stringify(usuarios));
        console.log("Admin creado", usuarios);
    } else {
        console.log("Admin ya existe", usuarios);
    }

    console.log("Usuarios en localStorage:", JSON.parse(localStorage.getItem("usuarios")));

    function validarUsuario(usuario) {
        let regex = /^[a-zA-Z0-9_]{3,20}$/;
        return regex.test(usuario);
    }
    
    function validarContraseña(contraseña) {
        let errores = [];
        
        if (contraseña.length < 8) {
            errores.push("longitud mínima de 8 caracteres");
        }
        
        if (contraseña.length > 20) {
            errores.push("longitud máxima de 20 caracteres");
        }
        
        if (!/[A-Z]/.test(contraseña)) {
            errores.push("al menos una letra mayúscula");
        }
        
        if (!/[a-z]/.test(contraseña)) {
            errores.push("al menos una letra minúscula");
        }
        
        if (!/[0-9]/.test(contraseña)) {
            errores.push("al menos un número");
        }
        
        if (!/[!@#$%^&*(),.?":{}|<>]/.test(contraseña)) {
            errores.push("al menos un carácter especial");
        }
        
        if (/\s/.test(contraseña)) {
            errores.push("no debe contener espacios");
        }
        
        return {
            valida: errores.length === 0,
            errores: errores
        };
    }
    
    function validarNombres(nombre) {
        let regex = /^[a-zA-ZáéíóúñÑüÜ\s]{2,50}$/;
        return regex.test(nombre);
    }
    
    function validarEdad(edad) {
        let regex = /^(1[0-9]|[1-9][0-9]?|120)$/;
        return regex.test(edad);
    }
    
    function validarFecha(fecha) {
        let regex = /^\d{4}-\d{2}-\d{2}$/;
        if (!regex.test(fecha)) return false;
        
        let fechaObj = new Date(fecha);
        return !isNaN(fechaObj.getTime());
    }
    
    function validarCiudad(ciudad) {
        let regex = /^[a-zA-ZáéíóúñÑ\s]{2,50}$/;
        return regex.test(ciudad);
    }
    
    function validarDireccion(direccion) {
        let regex = /^[a-zA-Z0-9\s\-\.\#]{5,100}$/;
        return regex.test(direccion);
    }
    
    function calcularEdad(fechaNacimiento) {
        if (!fechaNacimiento || fechaNacimiento.trim() === "") {
            return "";
        }
        
        if (!validarFecha(fechaNacimiento)) {
            return "";
        }
        
        let hoy = new Date();
        let nacimiento = new Date(fechaNacimiento);
        
        let edad = hoy.getFullYear() - nacimiento.getFullYear();
        let mes = hoy.getMonth() - nacimiento.getMonth();
        
        if (mes < 0 || (mes === 0 && hoy.getDate() < nacimiento.getDate())) {
            edad--;
        }
        
        if (edad < 0 || edad > 120) {
            return "";
        }
        
        return edad;
    }

    const fechaNacimientoInput = document.querySelector('#fecha_nacimiento');
    const edadInput = document.querySelector('#edad');
    
    if (fechaNacimientoInput && edadInput) {
        function actualizarEdad() {
            let edadCalculada = calcularEdad(fechaNacimientoInput.value);
            if (edadCalculada !== "") {
                edadInput.value = edadCalculada;
            } else {
                edadInput.value = "";
            }
        }
        
        fechaNacimientoInput.addEventListener('blur', actualizarEdad);
    }

    function usuarioExiste(usuario) {
        const usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];
        return usuarios.some(u => u.usuario.toLowerCase() === usuario.toLowerCase());
    }

    function guardarEnLocalStorage(datosUsuario) {
        const usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];
        
        const nuevoUsuario = {
            usuario: datosUsuario.usuario,
            contraseña: datosUsuario.contraseña,
            nombres: datosUsuario.nombres,
            apellido_paterno: datosUsuario.apellido_paterno,
            apellido_materno: datosUsuario.apellido_materno,
            fecha_nacimiento: datosUsuario.fecha_nacimiento,
            edad: datosUsuario.edad,
            ciudad: datosUsuario.ciudad,
            direccion: datosUsuario.direccion,
            rol: "normal"
        };
        
        usuarios.push(nuevoUsuario);
        localStorage.setItem("usuarios", JSON.stringify(usuarios));
        return true;
    }

    function guardarSession(datosUsuario) {
        let rol = "normal";
        
        if (datosUsuario.usuario === "admin") {
            rol = "administrador";
        }
        
        const session = {
            logueado: true,
            usuario: datosUsuario.usuario,
            contraseña: datosUsuario.contraseña,
            nombres: datosUsuario.nombres,
            apellido_paterno: datosUsuario.apellido_paterno,
            apellido_materno: datosUsuario.apellido_materno,
            fecha_nacimiento: datosUsuario.fecha_nacimiento,
            edad: datosUsuario.edad,
            ciudad: datosUsuario.ciudad,
            direccion: datosUsuario.direccion,
            rol: rol
        };
        
        localStorage.setItem('userSession', JSON.stringify(session));
        return session;
    }

    function validarFormularioCompleto() {
        let esValido = true;
        
        let usuario = formulario.elements.usuario;
        let contraseña = formulario.elements.contraseña;
        let contraseña2 = formulario.elements.contraseña2;
        let nombres = formulario.elements.nombres;
        let apellido_paterno = formulario.elements.apellido_paterno;
        let apellido_materno = formulario.elements.apellido_materno;
        let fecha_nacimiento = formulario.elements.fecha_nacimiento;
        let edad = formulario.elements.edad;
        let ciudad = formulario.elements.ciudad;
        let direccion = formulario.elements.direccion;
        
        limpiarCampo();
        
        if (usuario) usuario.style.border = "";
        if (contraseña) contraseña.style.border = "";
        if (contraseña2) contraseña2.style.border = "";
        if (nombres) nombres.style.border = "";
        if (apellido_paterno) apellido_paterno.style.border = "";
        if (apellido_materno) apellido_materno.style.border = "";
        if (fecha_nacimiento) fecha_nacimiento.style.border = "";
        if (edad) edad.style.border = "";
        if (ciudad) ciudad.style.border = "";
        if (direccion) direccion.style.border = "";
        
        if (!usuario.value.trim()) {
            mostrarMensajeRegex(usuario, "usuario es obligatorio");
            esValido = false;
        } else if (!validarUsuario(usuario.value.trim())) {
            mostrarMensajeRegex(usuario, "usuario debe tener 3-20 caracteres (letras, números, _)");
            esValido = false;
        } else if (usuarioExiste(usuario.value.trim())) {
            mostrarMensajeRegex(usuario, "el usuario ya existe, elige otro nombre");
            esValido = false;
        }
        
        if (!contraseña.value.trim()) {
            mostrarMensajeRegex(contraseña, "contraseña es obligatoria");
            esValido = false;
        } else {
            let resultadoContraseña = validarContraseña(contraseña.value.trim());
            if (!resultadoContraseña.valida) {
                for (let i = 0; i < resultadoContraseña.errores.length; i++) {
                    mostrarMensajeRegex(contraseña, resultadoContraseña.errores[i]);
                }
                esValido = false;
            }
        }
        
        if (!contraseña2.value.trim()) {
            mostrarMensajeRegex(contraseña2, "confirmar contraseña es obligatoria");
            esValido = false;
        } else if (contraseña.value.trim() !== contraseña2.value.trim()) {
            mostrarMensajeRegex(contraseña2, "las contraseñas no coinciden");
            esValido = false;
        }
        
        if (!nombres.value.trim()) {
            mostrarMensajeRegex(nombres, "nombre es obligatorio");
            esValido = false;
        } else if (!validarNombres(nombres.value.trim())) {
            mostrarMensajeRegex(nombres, "nombre solo debe contener letras (mínimo 2 caracteres)");
            esValido = false;
        }
        
        if (!apellido_paterno.value.trim()) {
            mostrarMensajeRegex(apellido_paterno, "apellido paterno es obligatorio");
            esValido = false;
        } else if (!validarNombres(apellido_paterno.value.trim())) {
            mostrarMensajeRegex(apellido_paterno, "apellido paterno solo debe contener letras (mínimo 2 caracteres)");
            esValido = false;
        }
        
        if (apellido_materno.value.trim() && !validarNombres(apellido_materno.value.trim())) {
            mostrarMensajeRegex(apellido_materno, "apellido materno solo debe contener letras");
            esValido = false;
        }
        
        if (!fecha_nacimiento.value.trim()) {
            mostrarMensajeRegex(fecha_nacimiento, "fecha de nacimiento es obligatoria");
            esValido = false;
        } else if (!validarFecha(fecha_nacimiento.value.trim())) {
            mostrarMensajeRegex(fecha_nacimiento, "fecha inválida (formato YYYY-MM-DD)");
            esValido = false;
        }
        
        if (!edad.value.trim()) {
            mostrarMensajeRegex(edad, "edad es obligatoria");
            esValido = false;
        } else if (!validarEdad(edad.value.trim())) {
            mostrarMensajeRegex(edad, "edad debe ser un número entre 1 y 120");
            esValido = false;
        }
        
        if (!ciudad.value.trim()) {
            mostrarMensajeRegex(ciudad, "ciudad es obligatoria");
            esValido = false;
        } else if (!validarCiudad(ciudad.value.trim())) {
            mostrarMensajeRegex(ciudad, "ciudad solo debe contener letras (mínimo 2 caracteres)");
            esValido = false;
        }
        
        if (!direccion.value.trim()) {
            mostrarMensajeRegex(direccion, "dirección es obligatoria");
            esValido = false;
        } else if (!validarDireccion(direccion.value.trim())) {
            mostrarMensajeRegex(direccion, "dirección inválida (mínimo 5 caracteres)");
            esValido = false;
        }
        
        return esValido;
    }
    
    function crearSession() {
        const session = {
            usuario: formulario.elements.usuario.value.trim(),
            contraseña: formulario.elements.contraseña.value.trim(),
            nombres: formulario.elements.nombres.value.trim(),
            apellido_paterno: formulario.elements.apellido_paterno.value.trim(),
            apellido_materno: formulario.elements.apellido_materno.value.trim(),
            fecha_nacimiento: formulario.elements.fecha_nacimiento.value.trim(),
            edad: formulario.elements.edad.value.trim(),
            ciudad: formulario.elements.ciudad.value.trim(),
            direccion: formulario.elements.direccion.value.trim()
        };
        
        return session;
    }
    
    function limpiarCampo() {
        mensajeCuerpo.innerHTML = "";
    }
    
    function mostrarMensajeRegex(input, mensajePersonalizado) {
        let mensajes = document.createElement('li');
        mensajes.innerText = "Campo " + input.id + ": " + mensajePersonalizado;
        mensajeCuerpo.appendChild(mensajes);
        input.style.border = "2px solid red";
        
        input.addEventListener('focus', function() {
            this.style.border = "";
        });
    }

    formulario.addEventListener('submit', function(e) {
        e.preventDefault();
        
        if (validarFormularioCompleto()) {
            const datosUsuario = crearSession();
            guardarEnLocalStorage(datosUsuario);
            guardarSession(datosUsuario);
            
            let mensajeExito = document.createElement('li');
            mensajeExito.style.color = 'green';
            mensajeExito.style.fontWeight = 'bold';
            mensajeExito.innerText = 'Registro exitoso! Sesión creada correctamente.';
            mensajeCuerpo.appendChild(mensajeExito);
            
            const inputs = formulario.querySelectorAll('input, select, textarea');
            inputs.forEach(input => {
                input.style.border = "";
            });
            
            window.location.href = "./login";
        }
    });
    
    btnRegistrar.addEventListener('click', function(e) {
        formulario.dispatchEvent(new Event('submit'));
    });
})();