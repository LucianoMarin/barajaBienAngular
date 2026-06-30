/**
 * Componente para el inicio de sesión de usuarios.
 * 
 * @component
 * @name LoginComponent
 * @description Permite a los usuarios autenticarse en el sistema.
 *              Valida credenciales contra localStorage y gestiona
 *              la sesión del usuario.
 * 
 * @selector app-login
 * @standalone true
 * @imports {CommonModule, FormsModule, RouterModule}
 * @template './login.component.html'
 * @style './login.component.css'
 * 
 * @usageNotes
 * ### Validaciones
 * - Ambos campos (usuario y clave) son obligatorios
 * - Las credenciales se verifican contra la lista de usuarios en localStorage
 * - Se muestra mensaje de error para credenciales incorrectas
 * 
 * ### Flujo de autenticación
 * 1. Usuario ingresa credenciales
 * 2. Se buscan usuarios en localStorage
 * 3. Si las credenciales son correctas, se guarda sesión
 * 4. Se redirige al inicio con recarga de página
 * 
 * @example
 * ```
 * // Uso en el template
 * <app-login></app-login>
 * ```
 * 
 * @author [Nombre del desarrollador]
 * @since 1.0.0
 */
import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { Usuario } from '../../models/usuario.model';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

  /**
   * Nombre de usuario ingresado en el formulario.
   * 
   * @type {string}
   * @default ''
   * @since 1.0.0
   */
  usuario = '';

  /**
   * Contraseña ingresada en el formulario.
   * 
   * @type {string}
   * @default ''
   * @since 1.0.0
   */
  clave = '';

  /**
   * Mensaje de notificación para el usuario.
   * 
   * @type {Signal<string>}
   * @default ''
   * @since 1.0.0
   */
  mensaje = signal('');

  /**
   * Tipo de mensaje de notificación.
   * 
   * @type {Signal<'success' | 'error'>}
   * @default 'success'
   * @since 1.0.0
   */
  mensajeTipo = signal<'success' | 'error'>('success');

  /**
   * Constructor del componente.
   * 
   * @param {Router} router - Servicio de navegación de Angular
   * @since 1.0.0
   */
  constructor(private router: Router) {}

  /**
   * Obtiene la lista de usuarios desde localStorage.
   * 
   * @description
   * - Retorna un array vacío si no hay usuarios
   * - Maneja errores de JSON parse silenciosamente
   * 
   * @returns {Usuario[]} Lista de usuarios registrados
   * 
   * @example
   * ```
   * const usuarios = this.obtenerUsuarios();
   * ```
   * 
   * @since 1.0.0
   */
  obtenerUsuarios(): Usuario[] {
    const usuarios = localStorage.getItem('usuarios');
    return usuarios ? JSON.parse(usuarios) : [];
  }

  /**
   * Procesa el intento de inicio de sesión.
   * 
   * @description
   * ### Validaciones
   * 1. Verifica que ambos campos estén completos
   * 2. Busca el usuario en la lista de usuarios registrados
   * 3. Compara usuario y clave para autenticación
   * 
   * ### Flujo de éxito
   * 1. Guarda el usuario en localStorage (sesión)
   * 2. Muestra mensaje de bienvenida
   * 3. Redirige al inicio
   * 4. Recarga la página para actualizar el header
   * 
   * ### Flujo de error
   * 1. Muestra mensaje de credenciales incorrectas
   * 2. No realiza ninguna redirección
   * 
   * @returns {void}
   * 
   * @example
   * ```
   * // Llamada desde el template
   * <form (ngSubmit)="ingresar()">
   * ```
   * 
   * @since 1.0.0
   */
  ingresar() {
    if (!this.usuario || !this.clave) {
      this.mensaje.set('Todos los campos son obligatorios');
      this.mensajeTipo.set('error');
      return;
    }

    const usuarios = this.obtenerUsuarios();
    
    const usuarioEncontrado = usuarios.find((u: Usuario) => 
      u.usuario === this.usuario && u.clave === this.clave
    );

    if (usuarioEncontrado) {
      this.mensaje.set('Bienvenido ' + usuarioEncontrado.nombres);
      this.mensajeTipo.set('success');
      
      localStorage.setItem('usuarioActual', JSON.stringify(usuarioEncontrado));
      
      this.router.navigate(['/']).then(() => {
        window.location.reload();
      });
      
    } else {
      this.mensaje.set('Usuario o clave incorrectos');
      this.mensajeTipo.set('error');
    }
  }
}