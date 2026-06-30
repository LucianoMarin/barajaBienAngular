import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { EventoComponent } from './evento.component';

describe('EventoComponent', () => {
  let component: EventoComponent;
  let fixture: ComponentFixture<EventoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EventoComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(EventoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  // ========== PRUEBAS DE CREACIÓN ==========
  it('should create', () => {
    expect(component).toBeTruthy();
  });

  // ========== PRUEBAS DE RENDERIZADO ==========
  describe('Renderizado del componente', () => {
    it('should render the main container with id "eventos"', () => {
      const container = fixture.debugElement.query(By.css('#eventos'));
      expect(container).toBeTruthy();
      expect(container.nativeElement).toBeTruthy();
    });

    it('should have class "fila4" on main container', () => {
      const container = fixture.debugElement.query(By.css('.fila4'));
      expect(container).toBeTruthy();
      expect(container.classes['fila4']).toBe(true);
    });

    it('should render the title section', () => {
      const titulo = fixture.debugElement.query(By.css('.titulo'));
      expect(titulo).toBeTruthy();
    });

    it('should render the title "Eventos"', () => {
      const tituloSpan = fixture.debugElement.query(By.css('.titulo span'));
      expect(tituloSpan).toBeTruthy();
      expect(tituloSpan.nativeElement.textContent).toContain('Eventos');
    });

    it('should render the title icon', () => {
      const icono = fixture.debugElement.query(By.css('.iconos_titulos'));
      expect(icono).toBeTruthy();
      expect(icono.nativeElement.getAttribute('src')).toBe('assets/images/iconos/castillo.png');
      expect(icono.nativeElement.getAttribute('alt')).toBe('');
    });
  });

  // ========== PRUEBAS DEL CONTENEDOR DE EVENTO ==========
  describe('Contenedor de evento', () => {
    it('should render the event container', () => {
      const contenedor = fixture.debugElement.query(By.css('.contenedor_evento'));
      expect(contenedor).toBeTruthy();
    });

    it('should render the event text section', () => {
      const eventoTexto = fixture.debugElement.query(By.css('.evento_texto'));
      expect(eventoTexto).toBeTruthy();
    });

    it('should render the event image section', () => {
      const eventoImagen = fixture.debugElement.query(By.css('.evento_imagen'));
      expect(eventoImagen).toBeTruthy();
    });
  });

  // ========== PRUEBAS DEL TEXTO DEL EVENTO ==========
  describe('Texto del evento', () => {
    it('should render the event title', () => {
      const eventoTitulo = fixture.debugElement.query(By.css('#evento_titulo'));
      expect(eventoTitulo).toBeTruthy();
    });

    it('should render the event title text correctly', () => {
      const tituloSpan = fixture.debugElement.query(By.css('#evento_titulo span'));
      expect(tituloSpan).toBeTruthy();
      expect(tituloSpan.nativeElement.textContent).toContain('DOMINION');
    });

    it('should render the event description container', () => {
      const eventoTexto = fixture.debugElement.query(By.css('#evento_texto'));
      expect(eventoTexto).toBeTruthy();
    });

    it('should render all paragraphs in event text', () => {
      const paragraphs = fixture.debugElement.queryAll(By.css('#evento_texto p'));
      expect(paragraphs.length).toBe(5); // 5 párrafos en el texto
    });

    it('should contain the game name "DOMINION" in bold', () => {
      const boldText = fixture.debugElement.query(By.css('#evento_texto b'));
      expect(boldText).toBeTruthy();
      expect(boldText.nativeElement.textContent).toContain('DOMINION');
    });

    it('should contain the location text', () => {
      const paragraphs = fixture.debugElement.queryAll(By.css('#evento_texto p'));
      const locationParagraph = paragraphs[2];
      expect(locationParagraph.nativeElement.textContent).toContain('Santiago Centro');
      expect(locationParagraph.nativeElement.textContent).toContain('#123 ficticio');
    });

    it('should contain the time text', () => {
      const paragraphs = fixture.debugElement.queryAll(By.css('#evento_texto p'));
      const timeParagraph = paragraphs[3];
      expect(timeParagraph.nativeElement.textContent).toContain('16:00 Hrs');
      expect(timeParagraph.nativeElement.textContent).toContain('18:00 Hrs');
    });

    it('should contain the invitation text', () => {
      const paragraphs = fixture.debugElement.queryAll(By.css('#evento_texto p'));
      const lastParagraph = paragraphs[4];
      expect(lastParagraph.nativeElement.textContent).toContain('Te esperamos');
      expect(lastParagraph.nativeElement.textContent).toContain('no faltes');
    });

    it('should contain "DEVIR" text', () => {
      const text = fixture.debugElement.query(By.css('#evento_texto')).nativeElement.textContent;
      expect(text).toContain('DEVIR');
    });

    it('should have a line break after the title', () => {
      const br = fixture.debugElement.query(By.css('#evento_texto br'));
      expect(br).toBeTruthy();
    });
  });

  // ========== PRUEBAS DE LA IMAGEN ==========
  describe('Imagen del evento', () => {
    it('should render the event image', () => {
      const imagen = fixture.debugElement.query(By.css('#evento_tamaño_foto'));
      expect(imagen).toBeTruthy();
    });

    it('should have correct image source', () => {
      const imagen = fixture.debugElement.query(By.css('#evento_tamaño_foto'));
      expect(imagen.nativeElement.getAttribute('src')).toBe('assets/images/eventos/eventos.jpg');
    });

    it('should have correct image alt text', () => {
      const imagen = fixture.debugElement.query(By.css('#evento_tamaño_foto'));
      expect(imagen.nativeElement.getAttribute('alt')).toBe('Personas jugando cartas, juego de mesa dominion');
    });

    it('should have correct image id', () => {
      const imagen = fixture.debugElement.query(By.css('#evento_tamaño_foto'));
      expect(imagen.nativeElement.id).toBe('evento_tamaño_foto');
    });
  });

  // ========== PRUEBAS DE CLASES CSS ==========
  describe('Clases CSS', () => {
    it('should have class "fila4" on main container', () => {
      const element = fixture.debugElement.query(By.css('.fila4'));
      expect(element.classes['fila4']).toBe(true);
    });

    it('should have class "titulo" on title container', () => {
      const element = fixture.debugElement.query(By.css('.titulo'));
      expect(element.classes['titulo']).toBe(true);
    });

    it('should have class "iconos_titulos" on icon', () => {
      const element = fixture.debugElement.query(By.css('.iconos_titulos'));
      expect(element.classes['iconos_titulos']).toBe(true);
    });

    it('should have class "contenedor_evento"', () => {
      const element = fixture.debugElement.query(By.css('.contenedor_evento'));
      expect(element.classes['contenedor_evento']).toBe(true);
    });

    it('should have class "evento_texto"', () => {
      const element = fixture.debugElement.query(By.css('.evento_texto'));
      expect(element.classes['evento_texto']).toBe(true);
    });

    it('should have class "evento_imagen"', () => {
      const element = fixture.debugElement.query(By.css('.evento_imagen'));
      expect(element.classes['evento_imagen']).toBe(true);
    });
  });

  // ========== PRUEBAS DE IDs ==========
  describe('IDs en el DOM', () => {
    it('should have main container with id "eventos"', () => {
      const element = fixture.debugElement.query(By.css('#eventos'));
      expect(element.nativeElement.id).toBe('eventos');
    });

    it('should have event title with id "evento_titulo"', () => {
      const element = fixture.debugElement.query(By.css('#evento_titulo'));
      expect(element.nativeElement.id).toBe('evento_titulo');
    });

    it('should have event text with id "evento_texto"', () => {
      const element = fixture.debugElement.query(By.css('#evento_texto'));
      expect(element.nativeElement.id).toBe('evento_texto');
    });

    it('should have image with id "evento_tamaño_foto"', () => {
      const element = fixture.debugElement.query(By.css('#evento_tamaño_foto'));
      expect(element.nativeElement.id).toBe('evento_tamaño_foto');
    });
  });

  // ========== PRUEBAS DE CONTENIDO ESPECÍFICO ==========
  describe('Contenido específico', () => {
    it('should contain "DOMINION" in the title', () => {
      const titulo = fixture.debugElement.query(By.css('#evento_titulo span'));
      expect(titulo.nativeElement.textContent).toContain('DOMINION');
    });

    it('should contain the word "terrateniente"', () => {
      const text = fixture.debugElement.query(By.css('#evento_texto')).nativeElement.textContent;
      expect(text).toContain('terrateniente');
    });

    it('should contain "cupos limitados"', () => {
      const text = fixture.debugElement.query(By.css('#evento_texto')).nativeElement.textContent;
      expect(text).toContain('cupos limitados');
    });

    it('should contain "entrada es liberada"', () => {
      const text = fixture.debugElement.query(By.css('#evento_texto')).nativeElement.textContent;
      expect(text).toContain('entrada es liberada');
    });

    it('should have exactly one image in the component', () => {
      const images = fixture.debugElement.queryAll(By.css('img'));
      expect(images.length).toBe(2); // Una para el ícono del título y otra para el evento
    });

    it('should have the title icon with correct alt attribute', () => {
      const icono = fixture.debugElement.query(By.css('.iconos_titulos'));
      expect(icono.nativeElement.hasAttribute('alt')).toBe(true);
    });

    it('should have the event image with correct alt attribute', () => {
      const imagen = fixture.debugElement.query(By.css('#evento_tamaño_foto'));
      expect(imagen.nativeElement.hasAttribute('alt')).toBe(true);
      expect(imagen.nativeElement.getAttribute('alt')).not.toBe('');
    });
  });

  // ========== PRUEBAS DE ESTRUCTURA ==========
  describe('Estructura del DOM', () => {
    it('should have a title section with span and image', () => {
      const titulo = fixture.debugElement.query(By.css('.titulo'));
      const span = titulo.query(By.css('span'));
      const img = titulo.query(By.css('img'));
      expect(span).toBeTruthy();
      expect(img).toBeTruthy();
    });

    it('should have event text section with title and description', () => {
      const eventoTexto = fixture.debugElement.query(By.css('.evento_texto'));
      const titulo = eventoTexto.query(By.css('#evento_titulo'));
      const descripcion = eventoTexto.query(By.css('#evento_texto'));
      expect(titulo).toBeTruthy();
      expect(descripcion).toBeTruthy();
    });

    it('should have event image section with an image', () => {
      const eventoImagen = fixture.debugElement.query(By.css('.evento_imagen'));
      const img = eventoImagen.query(By.css('img'));
      expect(img).toBeTruthy();
    });

    it('should have correct nesting structure', () => {
      const fila4 = fixture.debugElement.query(By.css('.fila4'));
      const titulo = fila4.query(By.css('.titulo'));
      const contenedorEvento = fila4.query(By.css('.contenedor_evento'));
      
      expect(titulo).toBeTruthy();
      expect(contenedorEvento).toBeTruthy();
      
      const eventoTexto = contenedorEvento.query(By.css('.evento_texto'));
      const eventoImagen = contenedorEvento.query(By.css('.evento_imagen'));
      
      expect(eventoTexto).toBeTruthy();
      expect(eventoImagen).toBeTruthy();
    });
  });
});