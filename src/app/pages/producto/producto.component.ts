/**
 * Componente para mostrar la lista de productos.
 * 
 * @component
 * @name ProductoComponent
 * @description Muestra un listado de todos los productos almacenados
 *              en localStorage. Carga los datos al inicializar el componente.
 * 
 * @selector app-producto
 * @standalone true
 * @imports {CommonModule}
 * @template './producto.component.html'
 * @style './producto.component.css'
 * 
 * @usageNotes
 * ### Funcionalidad
 * - Carga automática de productos desde localStorage
 * - Permite obtener la lista de productos mediante un método
 * - Los productos se almacenan en un signal para reactividad
 * 
 * @example
 * ```
 * // Uso en el template
 * <app-producto></app-producto>
 * 
 * // Acceso a los productos desde el componente
 * const productos = this.productos();
 * ```
 * 
 * @author [Nombre del desarrollador]
 * @since 1.0.0
 */
import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Producto } from '../../models/producto.model';

@Component({
  selector: 'app-producto',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './producto.component.html',
  styleUrl: './producto.component.css'
})
export class ProductoComponent {

  /**
   * Lista de productos disponibles.
   * 
   * @description Signal que contiene el array de productos cargados.
   * @type {Signal<Producto[]>}
   * @default []
   * @since 1.0.0
   */
  productos = signal<Producto[]>([]);

  /**
   * Constructor del componente.
   * 
   * @description Inicializa el componente y carga los productos.
   * @since 1.0.0
   */
  constructor() {
    this.cargarProductos();
  }

  /**
   * Carga la lista de productos desde localStorage.
   * 
   * @description
   * - Si existen productos, los carga en el signal
   * - Si no existen productos, establece un array vacío
   * 
   * @returns {void}
   * @since 1.0.0
   */
  cargarProductos() {
    const data = localStorage.getItem('productos');
    if (data) {
      this.productos.set(JSON.parse(data));
    } else {
      this.productos.set([]);
    }
  }

  /**
   * Obtiene la lista de productos cargados.
   * 
   * @returns {Producto[]} Lista actual de productos
   * 
   * @example
   * ```
   * const productos = this.obtenerProductos();
   * console.log(`Total: ${productos.length} productos`);
   * ```
   * 
   * @since 1.0.0
   */
  obtenerProductos(): Producto[] {
    return this.productos();
  }
}