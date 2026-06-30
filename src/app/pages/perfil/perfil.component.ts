/**
 * Componente de perfil de usuario.
 * 
 * @component
 * @name PerfilComponent
 * @description Muestra la información del usuario logueado y permite
 *              cambiar la contraseña. Verifica que el usuario esté
 *              autenticado antes de mostrar los datos.
 * 
 * @selector app-perfil
 * @standalone true
 * @imports {CommonModule, FormsModule, RouterModule}
 * @template './perfil.component.html'
 * @style './perfil.component.css'
 * 
 * @usageNotes
 * ### Funcionalidades
 * 1. **Visualización de datos**: Muestra todos los campos del usuario
 * 2. **Cambio de contraseña**: Formulario para actualizar la clave
 * 3. **Cierre de sesión**: Botón para cerrar la sesión actual
 * 
 * ### Seguridad
 * - Redirige al login si no hay usuario autenticado
 * - Los administradores ven opción para gestionar usuarios
 * 
 * @example
 * ```
 * // Uso en el template
 * <app-perfil></app-perfil>
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
  selector: 'app-perfil',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.css']
})
export class PerfilComponent {

  /**
   * Usuario actualmente logueado.
   * 
   * @type {Signal<Usuario | null>}
   * @default null
   * @since 1.0.0
   */
  usuarioActual = signal<Usuario | null>(null);

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
   * Controla la visibilidad del formulario de cambio de contraseña.
   * 
   * @type {Signal<boolean>}
   * @default false
   * @since 1.0.0
   */
  mostrarFormularioCambio = signal(false);

  /**
   * Contraseña actual del usuario.
   * 
   * @type {string}
   * @default ''
   * @since 1.0.0
   */
  antiguaClave = '';

  /**
   * Nueva contraseña a establecer.
   * 
   * @type {string}
   * @default ''
   * @since 1.0.0
   */
  nuevaClave = '';

  /**
   * Confirmación de la nueva contraseña.
   * 
   * @type {string}
   * @default ''
   * @since 1.0.0
   */
  confirmarClave = '';

  /**
   * Constructor del componente.
   * 
   * @param {Router} router - Servicio de navegación de Angular
   * @description Inicializa el componente y carga el usuario actual.
   * @since 1.0.0
   */
  constructor(private router: Router) {
    this.cargarUsuarioActual();
  }

  /**
   * Carga el usuario actual desde localStorage.
   * 
   * @description
   * - Si existe usuario, lo carga y muestra mensaje de bienvenida
   * - Si no existe usuario, redirige al login
   * 
   * @returns {void}
   * @since 1.0.0
   */
  cargarUsuarioActual() {
    const datos = localStorage.getItem('usuarioActual');
    if (datos) {
      this.usuarioActual.set(JSON.parse(datos));
      const usuario = this.usuarioActual();
      if (usuario) {
        this.mensaje.set('Bienvenido ' + usuario.nombres);
        this.mensajeTipo.set('success');
      }
    } else {
      this.router.navigate(['/login']);
    }
  }

  /**
   * Verifica si el usuario actual es administrador.
   * 
   * @returns {boolean} `true` si es administrador, `false` si no
   * @since 1.0.0
   */
  esAdmin(): boolean {
    const usuario = this.usuarioActual();
    return usuario !== null && usuario.rol === 'admin';
  }

  /**
   * Obtiene la lista de usuarios desde localStorage.
   * 
   * @returns {Usuario[]} Lista de usuarios registrados
   * @since 1.0.0
   */
  obtenerUsuarios(): Usuario[] {
    const usuarios = localStorage.getItem('usuarios');
    return usuarios ? JSON.parse(usuarios) : [];
  }

  /**
   * Guarda la lista de usuarios en localStorage.
   * 
   * @param {Usuario[]} usuarios - Lista de usuarios a guardar
   * @returns {void}
   * @since 1.0.0
   */
  guardarUsuarios(usuarios: Usuario[]) {
    localStorage.setItem('usuarios', JSON.stringify(usuarios));
  }

  /**
   * Muestra u oculta el formulario de cambio de contraseña.
   * 
   * @description Al activar, limpia todos los campos del formulario
   *              y resetea el mensaje.
   * 
   * @returns {void}
   * @since 1.0.0
   */
  toggleFormularioCambio() {
    this.mostrarFormularioCambio.set(!this.mostrarFormularioCambio());
    this.mensaje.set('');
    this.antiguaClave = '';
    this.nuevaClave = '';
    this.confirmarClave = '';
  }

  /**
   * Modifica la contraseña del usuario actual.
   * 
   * @description
   * ### Validaciones
   * 1. Todos los campos deben estar completos
   * 2. Nueva contraseña y confirmación deben coincidir
   * 3. Nueva contraseña debe tener al menos 6 caracteres
   * 4. La contraseña actual debe ser correcta
   * 5. El usuario debe existir en la lista de usuarios
   * 
   * ### Proceso de cambio
   * 1. Verifica todas las validaciones
   * 2. Actualiza la clave en la lista de usuarios
   * 3. Guarda la lista actualizada en localStorage
   * 4. Actualiza el usuario actual en sesión
   * 5. Muestra mensaje de éxito
   * 6. Limpia y oculta el formulario
   * 
   * @returns {void}
   * @since 1.0.0
   */
  modificarPassword() {
    if (!this.antiguaClave || !this.nuevaClave || !this.confirmarClave) {
      this.mensaje.set('Todos los campos son obligatorios');
      this.mensajeTipo.set('error');
      return;
    }

    if (this.nuevaClave !== this.confirmarClave) {
      this.mensaje.set('Las nuevas contraseñas no coinciden');
      this.mensajeTipo.set('error');
      return;
    }

    if (this.nuevaClave.length < 6) {
      this.mensaje.set('La nueva contraseña debe tener al menos 6 caracteres');
      this.mensajeTipo.set('error');
      return;
    }

    const usuarios = this.obtenerUsuarios();
    const usuario = this.usuarioActual();
    
    if (!usuario) {
      this.mensaje.set('Usuario no encontrado');
      this.mensajeTipo.set('error');
      return;
    }
    
    const usuarioIndex = usuarios.findIndex((u: Usuario) => 
      u.usuario === usuario.usuario
    );

    if (usuarioIndex === -1) {
      this.mensaje.set('Usuario no encontrado');
      this.mensajeTipo.set('error');
      return;
    }

    if (usuarios[usuarioIndex].clave !== this.antiguaClave) {
      this.mensaje.set('La contraseña actual es incorrecta');
      this.mensajeTipo.set('error');
      return;
    }

    usuarios[usuarioIndex].clave = this.nuevaClave;
    this.guardarUsuarios(usuarios);

    const usuarioActual = this.usuarioActual();
    if (usuarioActual) {
      usuarioActual.clave = this.nuevaClave;
      localStorage.setItem('usuarioActual', JSON.stringify(usuarioActual));
      this.usuarioActual.set(usuarioActual);
    }

    this.mensaje.set('Contraseña modificada exitosamente');
    this.mensajeTipo.set('success');

    this.antiguaClave = '';
    this.nuevaClave = '';
    this.confirmarClave = '';
    this.mostrarFormularioCambio.set(false);
  }

  /**
   * Cierra la sesión del usuario actual.
   * 
   * @description
   * - Elimina el usuario de localStorage
   * - Redirige al login
   * - Recarga la página para actualizar el header
   * 
   * @returns {void}
   * @since 1.0.0
   */
  cerrarSesion() {
    localStorage.removeItem('usuarioActual');
    this.router.navigate(['/login']).then(() => {
      window.location.reload();
    });
  }
}