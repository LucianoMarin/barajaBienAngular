/**
 * Componente para la creación de nuevos productos en el sistema.
 * 
 * @component
 * @name CrearProductoComponent
 * @description Permite a los administradores crear productos que se almacenan
 *              en localStorage. Incluye validaciones de campos obligatorios,
 *              precio positivo y verificación de rol de administrador.
 * 
 * @selector app-crear-producto
 * @standalone true
 * @imports {CommonModule, FormsModule}
 * @template './crear-producto.component.html'
 * @style './crear-producto.component.css'
 * 
 * @usageNotes
 * ### Validaciones del formulario
 * - Todos los campos son obligatorios
 * - El precio debe ser mayor a 0
 * - El nombre y descripción no pueden estar vacíos
 * - La categoría debe ser seleccionada
 * 
 * ### Roles de usuario
 * - Solo usuarios con rol 'admin' pueden acceder
 * - Los usuarios no administradores son redirigidos al perfil
 * - Los usuarios no logueados son redirigidos al login
 * 
 * @example
 * ```
 * // Uso en el template
 * <app-crear-producto></app-crear-producto>
 * ```
 * 
 * @author [Nombre del desarrollador]
 * @since 1.0.0
 */
import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Producto } from '../../models/producto.model';

@Component({
  selector: 'app-crear-producto',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './crear-producto.component.html',
  styleUrls: ['./crear-producto.component.css']
})
export class CrearProductoComponent {

  /**
   * Nombre del producto que se está creando.
   * 
   * @description Se vincula al input del template mediante [(ngModel)].
   * @type {string}
   * @default ''
   * @since 1.0.0
   */
  nombre = '';

  /**
   * Categoría del producto seleccionada del dropdown.
   * 
   * @description Opciones disponibles: 'MYL', 'Pokemon', 'Magic', 'Yugioh'
   * @type {string}
   * @default ''
   * @since 1.0.0
   */
  categoria = '';

  /**
   * Precio del producto en pesos chilenos.
   * 
   * @description Debe ser un número positivo mayor a 0.
   * @type {number}
   * @default 0
   * @minimum 1
   * @since 1.0.0
   */
  precio = 0;

  /**
   * URL de la imagen del producto.
   * 
   * @description Ruta relativa dentro de la carpeta assets del proyecto.
   * @type {string}
   * @default ''
   * @example 'assets/images/productos/prod1.webp'
   * @since 1.0.0
   */
  imagen = '';

  /**
   * Descripción detallada del producto.
   * 
   * @type {string}
   * @default ''
   * @since 1.0.0
   */
  descripcion = '';

  /**
   * Mensaje de notificación para el usuario.
   * 
   * @description Utiliza un signal de Angular para reactividad.
   * @type {Signal<string>}
   * @default ''
   * @since 1.0.0
   */
  mensaje = signal('');

  /**
   * Tipo de mensaje de notificación.
   * 
   * @description Define el estilo visual de la alerta mostrada al usuario.
   * @type {Signal<'success' | 'error'>}
   * @default 'success'
   * @since 1.0.0
   */
  mensajeTipo = signal<'success' | 'error'>('success');

  /**
   * Constructor del componente.
   * 
   * @param {Router} router - Servicio de navegación de Angular
   * @description Inicializa el componente y verifica permisos de administrador.
   * @since 1.0.0
   */
  constructor(private router: Router) {
    this.verificarAdmin();
  }

  /**
   * Verifica si el usuario actual tiene permisos de administrador.
   * 
   * @description
   * Lee el usuario actual desde localStorage y verifica su rol.
   * - Si es admin: permite el acceso
   * - Si no es admin: redirige al perfil
   * - Si no está logueado: redirige al login
   * 
   * @returns {void}
   * 
   * @example
   * ```
   * // Llamada automática en el constructor
   * this.verificarAdmin();
   * ```
   * 
   * @since 1.0.0
   */
  verificarAdmin() {
    const datos = localStorage.getItem('usuarioActual');
    if (datos) {
      const usuario = JSON.parse(datos);
      if (usuario.rol !== 'admin') {
        this.router.navigate(['/perfil']);
      }
    } else {
      this.router.navigate(['/login']);
    }
  }

  /**
   * Obtiene la lista de productos desde localStorage.
   * 
   * @description
   * - Retorna un array vacío si no hay productos almacenados
   * - Maneja errores de JSON parse silenciosamente
   * 
   * @returns {Producto[]} Lista de productos almacenados
   * 
   * @example
   * ```
   * const productos = this.obtenerProductos();
   * console.log(`Total productos: ${productos.length}`);
   * ```
   * 
   * @since 1.0.0
   * @see {@link guardarProductos}
   */
  obtenerProductos(): Producto[] {
    const data = localStorage.getItem('productos');
    return data ? JSON.parse(data) : [];
  }

  /**
   * Guarda la lista de productos en localStorage.
   * 
   * @param {Producto[]} productos - Lista de productos a guardar
   * @returns {void}
   * 
   * @example
   * ```
   * const productos = this.obtenerProductos();
   * productos.push(nuevoProducto);
   * this.guardarProductos(productos);
   * ```
   * 
   * @since 1.0.0
   * @see {@link obtenerProductos}
   */
  guardarProductos(productos: Producto[]) {
    localStorage.setItem('productos', JSON.stringify(productos));
  }

  /**
   * Crea un nuevo producto y lo almacena en el sistema.
   * 
   * @description
   * ### Validaciones realizadas
   * 1. Todos los campos deben estar completos
   * 2. El precio debe ser mayor a 0
   * 3. El nombre, categoría, imagen y descripción no pueden estar vacíos
   * 
   * ### Proceso de creación
   * 1. Valida los datos del formulario
   * 2. Genera un ID automático basado en la cantidad de productos existentes
   * 3. Crea el objeto Producto con los datos del formulario
   * 4. Guarda el producto en localStorage
   * 5. Muestra mensaje de éxito al usuario
   * 6. Limpia el formulario para un nuevo ingreso
   * 
   * @returns {void}
   * 
   * @example
   * ```
   * // Configurar datos y crear producto
   * this.nombre = 'Dominion';
   * this.categoria = 'MYL';
   * this.precio = 34990;
   * this.crearProducto();
   * ```
   * 
   * @since 1.0.0
   * @see {@link limpiarFormulario}
   * @see {@link obtenerProductos}
   * @see {@link guardarProductos}
   */
  crearProducto() {
    if (!this.nombre || !this.categoria || this.precio <= 0 || !this.imagen || !this.descripcion) {
      this.mensaje.set('Todos los campos son obligatorios');
      this.mensajeTipo.set('error');
      return;
    }

    const productos = this.obtenerProductos();

    const nuevoProducto: Producto = {
      id: productos.length + 1,
      nombre: this.nombre,
      categoria: this.categoria,
      precio: this.precio,
      imagen: this.imagen,
      descripcion: this.descripcion
    };

    productos.push(nuevoProducto);
    this.guardarProductos(productos);

    this.mensaje.set('Producto creado exitosamente');
    this.mensajeTipo.set('success');

    this.limpiarFormulario();
  }

  /**
   * Limpia todos los campos del formulario.
   * 
   * @description
   * Reinicia todas las propiedades del componente a sus valores iniciales:
   * - nombre: ''
   * - categoria: ''
   * - precio: 0
   * - imagen: ''
   * - descripcion: ''
   * - mensaje: ''
   * 
   * @returns {void}
   * 
   * @example
   * ```
   * // Llamada desde el template
   * <button (click)="limpiarFormulario()">Limpiar</button>
   * ```
   * 
   * @since 1.0.0
   */
  limpiarFormulario() {
    this.nombre = '';
    this.categoria = '';
    this.precio = 0;
    this.imagen = '';
    this.descripcion = '';
    this.mensaje.set('');
  }
}