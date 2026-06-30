/**
 * Componente para mostrar información de eventos.
 * 
 * @component
 * @name EventoComponent
 * @description Componente estático que muestra información sobre eventos
 *              de juegos de mesa, incluyendo detalles de fecha, ubicación
 *              y descripción del evento.
 * 
 * @selector app-evento
 * @standalone true
 * @imports []
 * @template './evento.component.html'
 * @style './evento.component.css'
 * 
 * @usageNotes
 * Este componente no contiene lógica de negocio, solo presenta
 * información estática sobre eventos. Es ideal para mostrar
 * contenido promocional o informativo.
 * 
 * @example
 * ```
 * // Uso en el template
 * <app-evento></app-evento>
 * ```
 * 
 * @author [Nombre del desarrollador]
 * @since 1.0.0
 */
import { Component } from '@angular/core';

@Component({
  selector: 'app-evento',
  standalone: true,
  imports: [],
  templateUrl: './evento.component.html',
  styleUrl: './evento.component.css',
})
export class EventoComponent {}