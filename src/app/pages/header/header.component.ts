/**
 * Componente de cabecera principal de la aplicación.
 * 
 * @component
 * @name HeaderComponent
 * @description Muestra el banner principal y el menú de navegación.
 *              Gestiona el estado de autenticación del usuario y
 *              actualiza los elementos del menú según el rol.
 * 
 * @selector app-header
 * @standalone true
 * @imports {CommonModule, RouterModule}
 * @template './header.component.html'
 * @style './header.component.css'
 * 
 * @usageNotes
 * ### Navegación
 * - Muestra diferentes opciones según el estado de autenticación
 * - Los administradores ven opciones adicionales de gestión
 * - Los usuarios no autenticados ven opciones de login/registro
 * 
 * @example
 * ```
 * // Uso en el template principal
 * <app-header></app-header>
 * ```
 * 
 * @author [Nombre del desarrollador]
 * @since 1.0.0
 */
import { Component, signal, effect, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { Usuario } from '../../models/usuario.model';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {

  /**
   * Usuario actualmente logueado.
   * 
   * @description Signal que contiene el usuario actual o null si no hay sesión.
   * @type {Signal<Usuario | null>}
   * @default null
   * @since 1.0.0
   */
  usuarioActual = signal<Usuario | null>(null);

  /**
   * Constructor del componente.
   * 
   * @param {Router} router - Servicio de navegación de Angular
   * @param {ChangeDetectorRef} cdr - Servicio para detectar cambios en el DOM
   * @description Inicializa el componente, carga el usuario y configura
   *              el efecto para actualizar la vista cuando cambia el usuario.
   * @since 1.0.0
   */
  constructor(private router: Router, private cdr: ChangeDetectorRef) {
    this.cargarUsuarioActual();

    effect(() => {
      const usuario = this.usuarioActual();
      this.cdr.detectChanges();
    });
  }

  /**
   * Carga el usuario actual desde localStorage.
   * 
   * @description
   * Verifica la existencia de window y localStorage para compatibilidad SSR.
   * Si existe usuario en localStorage, lo carga; si no, establece null.
   * 
   * @returns {void}
   * 
   * @example
   * ```
   * // Llamada automática en el constructor
   * this.cargarUsuarioActual();
   * ```
   * 
   * @since 1.0.0
   */
  cargarUsuarioActual() {
    if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
      const datos = localStorage.getItem('usuarioActual');
      if (datos) {
        this.usuarioActual.set(JSON.parse(datos));
      } else {
        this.usuarioActual.set(null);
      }
    }
  }

  /**
   * Verifica si el usuario actual es administrador.
   * 
   * @returns {boolean} `true` si el usuario es administrador, `false` en caso contrario
   * 
   * @example
   * ```
   * if (this.esAdmin()) {
   *   // Mostrar opciones de administrador
   * }
   * ```
   * 
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
   * 
   * @example
   * ```
   * if (this.estaLogueado()) {
   *   // Mostrar opciones de usuario autenticado
   * }
   * ```
   * 
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
   * - Actualiza la vista
   * - Redirige al login
   * 
   * @returns {void}
   * 
   * @example
   * ```
   * // Llamada desde el template
   * <button (click)="cerrarSesion()">Cerrar Sesión</button>
   * ```
   * 
   * @since 1.0.0
   */
  cerrarSesion() {
    if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
      localStorage.removeItem('usuarioActual');
      this.usuarioActual.set(null);
      this.cdr.detectChanges();
      this.router.navigate(['/login']);
    }
  }
}