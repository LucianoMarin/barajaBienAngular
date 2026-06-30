/**
 * Componente del menú de navegación.
 * 
 * @component
 * @name MenuComponent
 * @description Menú de navegación principal que se adapta según el estado
 *              de autenticación y el rol del usuario.
 * 
 * @selector app-menu
 * @standalone true
 * @imports {CommonModule, RouterModule}
 * @template './menu.component.html'
 * @style './menu.component.css'
 * 
 * @usageNotes
 * ### Opciones del menú según estado
 * - **No autenticado**: Inicio, Productos, Eventos, Login, Registrar
 * - **Usuario normal**: Inicio, Productos, Eventos, Mi Perfil, Cerrar Sesión
 * - **Administrador**: Inicio, Productos, Eventos, Mi Perfil, Crear Producto,
 *   Gestionar Usuarios, Cerrar Sesión
 * 
 * @example
 * ```
 * // Uso en el template
 * <app-menu></app-menu>
 * ```
 * 
 * @author [Nombre del desarrollador]
 * @since 1.0.0
 */
import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { Usuario } from '../../models/usuario.model';

@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent {

  /**
   * Usuario actualmente logueado.
   * 
   * @type {Signal<Usuario | null>}
   * @default null
   * @since 1.0.0
   */
  usuarioActual = signal<Usuario | null>(null);

  /**
   * Constructor del componente.
   * 
   * @param {Router} router - Servicio de navegación de Angular
   * @description Inicializa el componente y carga el usuario desde localStorage.
   * @since 1.0.0
   */
  constructor(private router: Router) {
    this.cargarUsuarioActual();
  }

  /**
   * Carga el usuario actual desde localStorage.
   * 
   * @returns {void}
   * @since 1.0.0
   */
  cargarUsuarioActual() {
    const datos = localStorage.getItem('usuarioActual');
    if (datos) {
      this.usuarioActual.set(JSON.parse(datos));
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
   * Verifica si hay un usuario logueado.
   * 
   * @returns {boolean} `true` si hay usuario logueado, `false` si no
   * @since 1.0.0
   */
  estaLogueado(): boolean {
    return this.usuarioActual() !== null;
  }

  /**
   * Cierra la sesión del usuario actual.
   * 
   * @description
   * - Elimina el usuario de localStorage
   * - Establece usuarioActual a null
   * - Redirige al login
   * 
   * @returns {void}
   * @since 1.0.0
   */
  cerrarSesion() {
    localStorage.removeItem('usuarioActual');
    this.usuarioActual.set(null);
    this.router.navigate(['/login']);
  }
}