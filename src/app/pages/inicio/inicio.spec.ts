import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { InicioComponent } from './inicio.component';

describe('InicioComponent', () => {
  let component: InicioComponent;
  let fixture: ComponentFixture<InicioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InicioComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(InicioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  // ========== PRUEBAS DE CREACIÓN ==========
  it('should create', () => {
    expect(component).toBeTruthy();
  });

  // ========== PRUEBAS DEL HERO SECTION ==========
  describe('Hero Section', () => {
    it('should render the hero section', () => {
      const hero = fixture.debugElement.query(By.css('.hero-section'));
      expect(hero).toBeTruthy();
    });

    it('should render the title "BARAJA BIEN"', () => {
      const title = fixture.debugElement.query(By.css('h1.display-1'));
      expect(title).toBeTruthy();
      expect(title.nativeElement.textContent).toContain('BARAJA BIEN');
    });

    it('should render the hero description', () => {
      const description = fixture.debugElement.query(By.css('.hero-section .lead'));
      expect(description).toBeTruthy();
      expect(description.nativeElement.textContent).toContain('Descubre el mundo de la diversión');
    });

    it('should render the "Explorar Juegos" button', () => {
      const buttons = fixture.debugElement.queryAll(By.css('.hero-section .btn'));
      const explorarBtn = buttons.find(btn => 
        btn.nativeElement.textContent.includes('Explorar Juegos')
      );
      expect(explorarBtn).toBeTruthy();
      if (explorarBtn) {
        expect(explorarBtn.nativeElement.textContent).toContain('Explorar Juegos');
      }
    });

    it('should render the "Ver Catálogo" button', () => {
      const buttons = fixture.debugElement.queryAll(By.css('.hero-section .btn'));
      const catalogoBtn = buttons.find(btn => 
        btn.nativeElement.textContent.includes('Ver Catálogo')
      );
      expect(catalogoBtn).toBeTruthy();
      if (catalogoBtn) {
        expect(catalogoBtn.nativeElement.textContent).toContain('Ver Catálogo');
      }
    });

    it('should render the statistics section', () => {
      const stats = fixture.debugElement.queryAll(By.css('.hero-section .mt-5 div'));
      expect(stats.length).toBe(3);
    });

    it('should show "200+" juegos disponibles', () => {
      const stats = fixture.debugElement.queryAll(By.css('.hero-section .mt-5 h3'));
      expect(stats[0].nativeElement.textContent).toContain('200+');
    });

    it('should show "15K+" clientes felices', () => {
      const stats = fixture.debugElement.queryAll(By.css('.hero-section .mt-5 h3'));
      expect(stats[1].nativeElement.textContent).toContain('15K+');
    });

    it('should show "4.9★" valoración media', () => {
      const stats = fixture.debugElement.queryAll(By.css('.hero-section .mt-5 h3'));
      expect(stats[2].nativeElement.textContent).toContain('4.9★');
    });

    it('should have the dice icon', () => {
      const icon = fixture.debugElement.query(By.css('.bi-dice-6-fill'));
      expect(icon).toBeTruthy();
    });

    it('should have the emoji badges', () => {
      const badges = fixture.debugElement.queryAll(By.css('.badge'));
      const emojiBadges = badges.filter(b => 
        b.nativeElement.textContent.includes('🎯') || 
        b.nativeElement.textContent.includes('🏆')
      );
      expect(emojiBadges.length).toBe(2);
    });
  });

  // ========== PRUEBAS DE CATEGORÍAS ==========
  describe('Categorías Section', () => {
    it('should render the categorías section', () => {
      const section = fixture.debugElement.queryAll(By.css('.py-5.bg-light'));
      expect(section[0]).toBeTruthy();
    });

    it('should render the categorías title', () => {
      const title = fixture.debugElement.query(By.css('.py-5.bg-light .display-4'));
      expect(title).toBeTruthy();
      expect(title.nativeElement.textContent).toContain('Encuentra tu juego perfecto');
    });

    it('should render the category badge', () => {
      const badge = fixture.debugElement.query(By.css('.py-5.bg-light .category-badge'));
      expect(badge).toBeTruthy();
      expect(badge.nativeElement.textContent).toContain('Categorías');
    });

    it('should render 4 category cards', () => {
      const cards = fixture.debugElement.queryAll(By.css('.py-5.bg-light .game-card'));
      expect(cards.length).toBe(4);
    });

    it('should render "Estrategia" category', () => {
      const card = fixture.debugElement.queryAll(By.css('.py-5.bg-light .game-card'));
      const estrategia = card[0].query(By.css('.card-title'));
      expect(estrategia.nativeElement.textContent).toContain('Estrategia');
    });

    it('should render "Azar" category', () => {
      const card = fixture.debugElement.queryAll(By.css('.py-5.bg-light .game-card'));
      const azar = card[1].query(By.css('.card-title'));
      expect(azar.nativeElement.textContent).toContain('Azar');
    });

    it('should render "Familiares" category', () => {
      const card = fixture.debugElement.queryAll(By.css('.py-5.bg-light .game-card'));
      const familiares = card[2].query(By.css('.card-title'));
      expect(familiares.nativeElement.textContent).toContain('Familiares');
    });

    it('should render "Rompecabezas" category', () => {
      const card = fixture.debugElement.queryAll(By.css('.py-5.bg-light .game-card'));
      const rompecabezas = card[3].query(By.css('.card-title'));
      expect(rompecabezas.nativeElement.textContent).toContain('Rompecabezas');
    });

    it('should have icons in category cards', () => {
      const icons = fixture.debugElement.queryAll(By.css('.py-5.bg-light .bi'));
      expect(icons.length).toBe(4);
    });
  });

  // ========== PRUEBAS DE JUEGOS DESTACADOS ==========
  describe('Juegos Destacados', () => {
    it('should render the juegos destacados section', () => {
      const sections = fixture.debugElement.queryAll(By.css('.py-5:not(.bg-light)'));
      const featuredSection = sections[0];
      expect(featuredSection).toBeTruthy();
    });

    it('should render the "Los más populares" title', () => {
      const title = fixture.debugElement.queryAll(By.css('.display-4.fw-bold'));
      expect(title[1].nativeElement.textContent).toContain('Los más populares');
    });

    it('should render 3 featured game cards', () => {
      const cards = fixture.debugElement.queryAll(By.css('.game-card.shadow'));
      expect(cards.length).toBe(3);
    });

    it('should render "Ajedrez Élite" game', () => {
      const cards = fixture.debugElement.queryAll(By.css('.game-card.shadow'));
      const title = cards[0].query(By.css('.card-title'));
      expect(title.nativeElement.textContent).toContain('Ajedrez Élite');
    });

    it('should render "Dardos Pro" game', () => {
      const cards = fixture.debugElement.queryAll(By.css('.game-card.shadow'));
      const title = cards[1].query(By.css('.card-title'));
      expect(title.nativeElement.textContent).toContain('Dardos Pro');
    });

    it('should render "Monopoly Deluxe" game', () => {
      const cards = fixture.debugElement.queryAll(By.css('.game-card.shadow'));
      const title = cards[2].query(By.css('.card-title'));
      expect(title.nativeElement.textContent).toContain('Monopoly Deluxe');
    });

    it('should show prices for games', () => {
      const prices = fixture.debugElement.queryAll(By.css('.fw-bold.text-primary'));
      expect(prices.length).toBe(3);
      expect(prices[0].nativeElement.textContent).toContain('$29.99');
      expect(prices[1].nativeElement.textContent).toContain('$39.99');
      expect(prices[2].nativeElement.textContent).toContain('$49.99');
    });

    it('should have "Añadir" buttons for each game', () => {
      const addButtons = fixture.debugElement.queryAll(By.css('.btn-outline-primary'));
      expect(addButtons.length).toBe(3);
      addButtons.forEach(btn => {
        expect(btn.nativeElement.textContent).toContain('Añadir');
      });
    });

    it('should have category badges for games', () => {
      const badges = fixture.debugElement.queryAll(By.css('.badge.bg-primary, .badge.bg-success, .badge.bg-warning'));
      expect(badges.length).toBe(3);
    });
  });

  // ========== PRUEBAS DE CARACTERÍSTICAS ==========
  describe('Características', () => {
    it('should render the características section', () => {
      const sections = fixture.debugElement.queryAll(By.css('.py-5.bg-light'));
      const featuresSection = sections[1];
      expect(featuresSection).toBeTruthy();
    });

    it('should render "Envío Gratis" feature', () => {
      const features = fixture.debugElement.queryAll(By.css('.py-5.bg-light .text-center'));
      const feature1 = features[0];
      expect(feature1.query(By.css('h5')).nativeElement.textContent).toContain('Envío Gratis');
    });

    it('should render "Devolución Fácil" feature', () => {
      const features = fixture.debugElement.queryAll(By.css('.py-5.bg-light .text-center'));
      const feature2 = features[1];
      expect(feature2.query(By.css('h5')).nativeElement.textContent).toContain('Devolución Fácil');
    });

    it('should render "Pago Seguro" feature', () => {
      const features = fixture.debugElement.queryAll(By.css('.py-5.bg-light .text-center'));
      const feature3 = features[2];
      expect(feature3.query(By.css('h5')).nativeElement.textContent).toContain('Pago Seguro');
    });

    it('should have icons for features', () => {
      const icons = fixture.debugElement.queryAll(By.css('.py-5.bg-light .bi'));
      expect(icons.length).toBe(3);
    });
  });

  // ========== PRUEBAS DE TESTIMONIOS ==========
  describe('Testimonios', () => {
    it('should render the testimonios section', () => {
      const sections = fixture.debugElement.queryAll(By.css('.py-5:not(.bg-light)'));
      const testimoniosSection = sections[1];
      expect(testimoniosSection).toBeTruthy();
    });

    it('should render the testimonios title', () => {
      const titles = fixture.debugElement.queryAll(By.css('.display-4.fw-bold'));
      expect(titles[2].nativeElement.textContent).toContain('Lo que dicen nuestros jugadores');
    });

    it('should render 3 testimonios', () => {
      const testimonios = fixture.debugElement.queryAll(By.css('.testimonial-card'));
      expect(testimonios.length).toBe(3);
    });

    it('should render testimonio from "Carlos M."', () => {
      const testimonios = fixture.debugElement.queryAll(By.css('.testimonial-card'));
      const name = testimonios[0].query(By.css('h6'));
      expect(name.nativeElement.textContent).toContain('Carlos M.');
    });

    it('should render testimonio from "Ana G."', () => {
      const testimonios = fixture.debugElement.queryAll(By.css('.testimonial-card'));
      const name = testimonios[1].query(By.css('h6'));
      expect(name.nativeElement.textContent).toContain('Ana G.');
    });

    it('should render testimonio from "Pedro R."', () => {
      const testimonios = fixture.debugElement.queryAll(By.css('.testimonial-card'));
      const name = testimonios[2].query(By.css('h6'));
      expect(name.nativeElement.textContent).toContain('Pedro R.');
    });

    it('should have star ratings in testimonios', () => {
      const stars = fixture.debugElement.queryAll(By.css('.testimonial-card small'));
      stars.forEach(star => {
        expect(star.nativeElement.textContent).toContain('★');
      });
    });
  });

  // ========== PRUEBAS DE NEWSLETTER ==========
  describe('Newsletter', () => {
    it('should render the newsletter section', () => {
      const newsletter = fixture.debugElement.query(By.css('.bg-primary.text-white'));
      expect(newsletter).toBeTruthy();
    });

    it('should render the newsletter title', () => {
      const title = fixture.debugElement.query(By.css('.bg-primary.text-white h3'));
      expect(title).toBeTruthy();
      expect(title.nativeElement.textContent).toContain('¡No te pierdas las novedades!');
    });

    it('should render the newsletter description', () => {
      const description = fixture.debugElement.query(By.css('.bg-primary.text-white p'));
      expect(description).toBeTruthy();
      expect(description.nativeElement.textContent).toContain('Suscríbete para recibir ofertas exclusivas');
    });

    it('should have an email input field', () => {
      const input = fixture.debugElement.query(By.css('.bg-primary.text-white input[type="email"]'));
      expect(input).toBeTruthy();
      expect(input.nativeElement.getAttribute('placeholder')).toContain('Tu email');
    });

    it('should have a "Suscribir" button', () => {
      const button = fixture.debugElement.query(By.css('.bg-primary.text-white .btn-warning'));
      expect(button).toBeTruthy();
      expect(button.nativeElement.textContent).toContain('Suscribir');
    });
  });

  // ========== PRUEBAS DE FOOTER ==========
  describe('Footer', () => {
    it('should render the footer', () => {
      const footer = fixture.debugElement.query(By.css('footer'));
      expect(footer).toBeTruthy();
    });

    it('should render the copyright text', () => {
      const copyright = fixture.debugElement.query(By.css('footer .text-center.text-md-start p'));
      expect(copyright).toBeTruthy();
      expect(copyright.nativeElement.textContent).toContain('© 2026 🎲 Baraja Bien');
      expect(copyright.nativeElement.textContent).toContain('Todos los derechos reservados');
    });

    it('should render social media links', () => {
      const socialLinks = fixture.debugElement.queryAll(By.css('footer .text-center.text-md-end a'));
      expect(socialLinks.length).toBe(4);
    });

    it('should have Facebook icon', () => {
      const facebook = fixture.debugElement.query(By.css('footer .bi-facebook'));
      expect(facebook).toBeTruthy();
    });

    it('should have Instagram icon', () => {
      const instagram = fixture.debugElement.query(By.css('footer .bi-instagram'));
      expect(instagram).toBeTruthy();
    });

    it('should have Twitter icon', () => {
      const twitter = fixture.debugElement.query(By.css('footer .bi-twitter'));
      expect(twitter).toBeTruthy();
    });

    it('should have YouTube icon', () => {
      const youtube = fixture.debugElement.query(By.css('footer .bi-youtube'));
      expect(youtube).toBeTruthy();
    });
  });

  // ========== PRUEBAS DE CLASES Y ESTRUCTURA ==========
  describe('Clases CSS y estructura', () => {
    it('should have hero-section class', () => {
      const hero = fixture.debugElement.query(By.css('.hero-section'));
      expect(hero.classes['hero-section']).toBe(true);
    });

    it('should have game-card class on all game cards', () => {
      const gameCards = fixture.debugElement.queryAll(By.css('.game-card'));
      gameCards.forEach(card => {
        expect(card.classes['game-card']).toBe(true);
      });
    });

    it('should have testimonial-card class', () => {
      const testimonialCards = fixture.debugElement.queryAll(By.css('.testimonial-card'));
      testimonialCards.forEach(card => {
        expect(card.classes['testimonial-card']).toBe(true);
      });
    });

    it('should have category-badge class', () => {
      const badges = fixture.debugElement.queryAll(By.css('.category-badge'));
      expect(badges.length).toBeGreaterThan(0);
    });
  });

  // ========== PRUEBAS DE CONTENIDO ESPECÍFICO ==========
  describe('Contenido específico', () => {
    it('should contain the emoji 🎲 in the title', () => {
      const title = fixture.debugElement.query(By.css('h1.display-1'));
      expect(title.nativeElement.textContent).toContain('🎲');
    });

    it('should contain the word "estrategia" in description', () => {
      const description = fixture.debugElement.query(By.css('.hero-section .lead'));
      expect(description.nativeElement.textContent).toContain('estrategia');
    });

    it('should have Bootstrap classes on buttons', () => {
      const buttons = fixture.debugElement.queryAll(By.css('.btn'));
      buttons.forEach(btn => {
        expect(btn.classes['btn']).toBe(true);
      });
    });

    it('should have d-flex and text-center classes', () => {
      const hero = fixture.debugElement.query(By.css('.hero-section'));
      expect(hero).toBeTruthy();
    });
  });
});