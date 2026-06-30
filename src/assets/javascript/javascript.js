(() => {
    const opcionpadre = document.querySelectorAll('.opcionPadre');
    const imagenCarrusel = document.querySelector('.img_carrusel');

    const formulario = document.querySelector('#formulario_registro');
    const btnEnviar = document.querySelector('#btn_registro');
    const fechaNacimiento = document.querySelector('input[name="fecha_nacimiento"]');
    const edadInput = document.querySelector('input[name="edad"]');

    const mensajeDiv = document.querySelector('.mensaje');

    function mostrarMensaje(texto, esError = false) {
        if (mensajeDiv) {
            mensajeDiv.textContent = texto;
            mensajeDiv.classList.remove('mensaje-exito', 'mensaje-error');
            if (esError) {
                mensajeDiv.classList.add('mensaje-error');
            } else {
                mensajeDiv.classList.add('mensaje-exito');
            }
        }
    }

    fechaNacimiento.addEventListener('change', (e) => {
        const fechaValue = e.target.value;

        if (fechaValue !== "") {
            const hoy = new Date();
            const nacimiento = new Date(fechaValue);
            let edad = hoy.getFullYear() - nacimiento.getFullYear();
            const mes = hoy.getMonth() - nacimiento.getMonth();

            if (mes < 0 || (mes === 0 && hoy.getDate() < nacimiento.getDate())) {
                edad--;
            }

            if (edad > 0 && edad < 120) {
                edadInput.value = edad;
            } else {
                edadInput.value = "";
                alert("Fecha de nacimiento no válida");
            }
        } else {
            edadInput.value = "";
        }
    });

    carrusel = () => {
        let i = 2;
        const imagen = document.createElement('img');

        setInterval(() => {
            i > 1 ? i = 0 : 1;
            i++;

            let url = imagen.src = "./assets/images/carrusel_nuevo/" + i + ".png";
            imagenCarrusel.setAttribute('src', url);

            console.log(i);
        }, 10000)
    }

    carrusel();

    function cerrarTodos() {
        opcionpadre.forEach(item => item.classList.remove("mostrar"));
    }

    function abrir(elemento) {
        elemento.classList.add("mostrar");
    }

    for (let i = 0; i < opcionpadre.length; i++) {
        opcionpadre[i].addEventListener('click', (event) => {
            event.stopPropagation();
            const estaActivo = opcionpadre[i].classList.contains("mostrar");

            cerrarTodos();

            if (!estaActivo) {
                abrir(opcionpadre[i]);
            }
        });
    }

    document.addEventListener('click', cerrarTodos);

    btnEnviar.addEventListener('click', (e) => {
        e.preventDefault();

        const {
            usuario, clave1, clave2, primer_nombre, segundo_nombre,
            apellido_paterno, apellido_materno, fecha_nacimiento, direccion
        } = formulario.elements;

        const usuarioValue = usuario.value.trim();
        const clave1Value = clave1.value.trim();
        const clave2Value = clave2.value.trim();
        const primer_nombreValue = primer_nombre.value.trim();
        const segundo_nombreValue = segundo_nombre.value.trim();
        const apellido_paternoValue = apellido_paterno.value.trim();
        const apellido_maternoValue = apellido_materno.value.trim();
        const fechaValue = fecha_nacimiento.value;
        const direccionValue = direccion.value.trim();

        let formularioValido = true;

        if (mensajeDiv) mensajeDiv.textContent = '';

        if (usuarioValue === "") {
            validarInput(usuario, true);
            formularioValido = false;
        } else {
            validarInput(usuario, false);
        }

        if (clave1Value === "" || clave2Value === "" || clave1Value !== clave2Value) {
            validarInput(clave1, true);
            validarInput(clave2, true);
            formularioValido = false;
        } else {
            validarInput(clave1, false);
            validarInput(clave2, false);
        }

        if (primer_nombreValue === "") {
            validarInput(primer_nombre, true);
            formularioValido = false;
        } else {
            validarInput(primer_nombre, false);
        }

        if (segundo_nombreValue === "") {
            validarInput(segundo_nombre, true);
        } else {
               validarInput(segundo_nombre, false);

        }

        if (apellido_paternoValue === "") {
            validarInput(apellido_paterno, true);

        } else {
            validarInput(apellido_paterno, false);
        }

        if (apellido_maternoValue === "") {
            validarInput(apellido_materno, true);
        } else {
            validarInput(apellido_materno, false);
        }

        if (fechaValue === "") {
            validarInput(fecha_nacimiento, true);
            formularioValido = false;
        } else {
            validarInput(fecha_nacimiento, false);
            calcularEdad(fechaValue);
        }

        if (direccionValue === "") {
            validarInput(direccion, true);
            formularioValido = false;
        } else {
            validarInput(direccion, false);
        }

        if (formularioValido) {
            mostrarMensaje("¡Todos los campos están correctos! Formulario listo para enviar.", false);
        } else {
            mostrarMensaje(" Hay campos incorrectos o vacíos. Revísalos antes de continuar.", true);
        }
    });

    const validarInput = (inputElement, tieneError) => {
        if (tieneError) {
            inputElement.classList.add("is-invalid");
            inputElement.classList.remove("is-valid");
        } else {
            inputElement.classList.add("is-valid");
            inputElement.classList.remove("is-invalid");
        }
    }

    const calcularEdad = (fechaNacimiento) => {
        const hoy = new Date();
        const nacimiento = new Date(fechaNacimiento);
        let edad = hoy.getFullYear() - nacimiento.getFullYear();
        const mes = hoy.getMonth() - nacimiento.getMonth();

        if (mes < 0 || (mes === 0 && hoy.getDate() < nacimiento.getDate())) {
            edad--;
        }

        const edadInput = document.querySelector('input[name="edad"]');
        if (edadInput && edad > 0 && edad < 120) {
            edadInput.value = edad;
        } else {
            edadInput.value = "";
        }
    }
})();