/**
 * Componente de la página de inicio.
 * 
 * @component
 * @name InicioComponent
 * @description Página principal de la aplicación que muestra el contenido
 *              promocional, categorías de juegos, productos destacados,
 *              testimonios y newsletter.
 * 
 * @selector app-inicio
 * @standalone true
 * @imports []
 * @template './inicio.component.html'
 * @style './inicio.component.css'
 * 
 * @usageNotes
 * Este componente es puramente visual y no contiene lógica de negocio.
 * Muestra contenido estático para presentar la tienda y sus productos.
 * 
 * @example
 * ```
 * // Uso en el template
 * <app-inicio></app-inicio>
 * ```
 * 
 * @author [Nombre del desarrollador]
 * @since 1.0.0
 */
import { Component } from '@angular/core';

@Component({
  selector: 'app-inicio',
  standalone: true,
  imports: [],
  templateUrl: './inicio.component.html',
  styleUrl: './inicio.component.css',
})
export class InicioComponent {}