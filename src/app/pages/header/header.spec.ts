import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { HeaderComponent } from './header.component';
import { Usuario } from '../../models/usuario.model';

describe('HeaderComponent', () => {
  let component: HeaderComponent;
  let fixture: ComponentFixture<HeaderComponent>;
  let navigateCalled: boolean = false;
  let navigateParams: any[] = [];

  // Mock manual del Router
  const mockRouter = {
    navigate: (params: any[]) => {
      navigateCalled = true;
      navigateParams = params;
    }
  };

  // Datos de prueba - CORREGIDOS con las propiedades del modelo
  const mockUsuarioAdmin: Usuario = {
    id: 1,
    usuario: 'admin_test',        
    clave: '123456',              
    nombres: 'Admin',             
    apellidoPaterno: 'Test',      
    apellidoMaterno: 'Admin',    
    fechaNacimiento: '1990-01-01',
    edad: 30,                    
    ciudad: 'Santiago',          
    direccion: 'Calle Falsa 123',
    rol: 'admin'                
  };

  const mockUsuarioNormal: Usuario = {
    id: 2,
    usuario: 'user_test',       
    clave: '123456',            
    nombres: 'User',           
    apellidoPaterno: 'Test',      
    apellidoMaterno: 'User',     
    fechaNacimiento: '1995-05-15',
    edad: 25,                
    ciudad: 'Valparaíso',         
    direccion: 'Calle Real 456', 
    rol: 'user'                  
  };

  // Guardar referencia al localStorage original
  let originalLocalStorage: any;

  beforeEach(async () => {
    // Guardar localStorage original
    originalLocalStorage = window.localStorage;
    
    // Resetear variables
    navigateCalled = false;
    navigateParams = [];
    localStorage.clear();

    await TestBed.configureTestingModule({
      imports: [HeaderComponent, CommonModule, RouterModule],
      providers: [
        { provide: Router, useValue: mockRouter }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(HeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    // Restaurar localStorage original
    Object.defineProperty(window, 'localStorage', {
      value: originalLocalStorage,
      writable: true
    });
  });

  // ========== PRUEBAS DE CREACIÓN ==========
  it('should create', () => {
    expect(component).toBeTruthy();
  });

  // ========== PRUEBAS DE INICIALIZACIÓN ==========
  describe('Inicialización', () => {
    it('should initialize with null user', () => {
      expect(component.usuarioActual()).toBeNull();
    });

    it('should load user from localStorage on init', () => {
      localStorage.setItem('usuarioActual', JSON.stringify(mockUsuarioAdmin));
      
      // Crear nuevo componente para cargar el usuario
      const newComponent = new HeaderComponent(mockRouter as any, {} as any);
      
      expect(newComponent.usuarioActual()).toEqual(mockUsuarioAdmin);
    });

    it('should handle invalid JSON in localStorage', () => {
      localStorage.setItem('usuarioActual', 'invalid-json');
      
      // Crear nuevo componente
      const newComponent = new HeaderComponent(mockRouter as any, {} as any);
      
      expect(newComponent.usuarioActual()).toBeNull();
    });
  });

  // ========== PRUEBAS DE CARGA DE USUARIO ==========
  describe('cargarUsuarioActual', () => {
    it('should load user from localStorage when exists', () => {
      localStorage.setItem('usuarioActual', JSON.stringify(mockUsuarioAdmin));
      
      component.cargarUsuarioActual();
      
      expect(component.usuarioActual()).toEqual(mockUsuarioAdmin);
    });

    it('should set null when no user in localStorage', () => {
      component.cargarUsuarioActual();
      
      expect(component.usuarioActual()).toBeNull();
    });

    it('should handle JSON parse error', () => {
      localStorage.setItem('usuarioActual', 'invalid-json');
      
      component.cargarUsuarioActual();
      
      expect(component.usuarioActual()).toBeNull();
    });
  });

  // ========== PRUEBAS DE ESTADO DE LOGUEO ==========
  describe('estaLogueado', () => {
    it('should return true when user is logged in', () => {
      component.usuarioActual.set(mockUsuarioAdmin);
      
      expect(component.estaLogueado()).toBe(true);
    });

    it('should return false when user is not logged in', () => {
      component.usuarioActual.set(null);
      
      expect(component.estaLogueado()).toBe(false);
    });
  });

  // ========== PRUEBAS DE ROL DE ADMIN ==========
  describe('esAdmin', () => {
    it('should return true when user is admin', () => {
      component.usuarioActual.set(mockUsuarioAdmin);
      
      expect(component.esAdmin()).toBe(true);
    });

    it('should return false when user is not admin', () => {
      component.usuarioActual.set(mockUsuarioNormal);
      
      expect(component.esAdmin()).toBe(false);
    });

    it('should return false when no user is logged in', () => {
      component.usuarioActual.set(null);
      
      expect(component.esAdmin()).toBe(false);
    });
  });

  // ========== PRUEBAS DE CIERRE DE SESIÓN ==========
  describe('cerrarSesion', () => {
    it('should remove user from localStorage', () => {
      localStorage.setItem('usuarioActual', JSON.stringify(mockUsuarioAdmin));
      component.usuarioActual.set(mockUsuarioAdmin);
      
      component.cerrarSesion();
      
      expect(localStorage.getItem('usuarioActual')).toBeNull();
    });

    it('should set usuarioActual to null', () => {
      component.usuarioActual.set(mockUsuarioAdmin);
      
      component.cerrarSesion();
      
      expect(component.usuarioActual()).toBeNull();
    });

    it('should navigate to login', () => {
      component.cerrarSesion();
      
      expect(navigateCalled).toBe(true);
      expect(navigateParams).toEqual(['/login']);
    });
  });

  // ========== PRUEBAS DE RENDERIZADO DEL BANNER ==========
  describe('Renderizado del banner', () => {
    it('should render the banner container', () => {
      const banner = fixture.debugElement.query(By.css('.banner'));
      expect(banner).toBeTruthy();
    });

    it('should render the image with correct src', () => {
      const img = fixture.debugElement.query(By.css('#tam_banner'));
      expect(img).toBeTruthy();
      expect(img.nativeElement.getAttribute('src')).toBe('assets/images/banner/principal.png');
    });

    it('should render the image with correct alt text', () => {
      const img = fixture.debugElement.query(By.css('#tam_banner'));
      expect(img.nativeElement.getAttribute('alt')).toContain('Banner principal');
      expect(img.nativeElement.getAttribute('alt')).toContain('gatito');
    });

    it('should render the text "BARAJA"', () => {
      const texto = fixture.debugElement.query(By.css('.letrabanner'));
      expect(texto).toBeTruthy();
      expect(texto.nativeElement.textContent).toContain('BARAJA');
    });

    it('should render the text "BIEN"', () => {
      const texto = fixture.debugElement.query(By.css('#letrabanner2'));
      expect(texto).toBeTruthy();
      expect(texto.nativeElement.textContent).toContain('BIEN');
    });

    it('should have all banner elements', () => {
      const dibujo = fixture.debugElement.query(By.css('#dibujo'));
      const contenedor = fixture.debugElement.query(By.css('#contenedor_banner'));
      expect(dibujo).toBeTruthy();
      expect(contenedor).toBeTruthy();
    });
  });

  // ========== PRUEBAS DE RENDERIZADO DEL MENÚ ==========
  describe('Renderizado del menú', () => {
    it('should render the menu container', () => {
      const menu = fixture.debugElement.query(By.css('.menu'));
      expect(menu).toBeTruthy();
    });

    it('should render the navigation', () => {
      const nav = fixture.debugElement.query(By.css('nav'));
      expect(nav).toBeTruthy();
    });

    it('should render the unordered list', () => {
      const ul = fixture.debugElement.query(By.css('ul'));
      expect(ul).toBeTruthy();
    });

    it('should render the "Inicio" link', () => {
      const link = fixture.debugElement.query(By.css('a[routerLink="/"]'));
      expect(link).toBeTruthy();
      expect(link.nativeElement.textContent).toContain('Inicio');
    });

    it('should render the "Productos" link', () => {
      const link = fixture.debugElement.query(By.css('a[routerLink="/producto"]'));
      expect(link).toBeTruthy();
      expect(link.nativeElement.textContent).toContain('Productos');
    });

    it('should render the "Eventos" link', () => {
      const link = fixture.debugElement.query(By.css('a[routerLink="/evento"]'));
      expect(link).toBeTruthy();
      expect(link.nativeElement.textContent).toContain('Eventos');
    });

    it('should render subcategories under Productos', () => {
      const subItems = fixture.debugElement.queryAll(By.css('.subopciones'));
      expect(subItems.length).toBe(4);
      expect(subItems[0].nativeElement.textContent).toContain('Mitos y Leyendas');
      expect(subItems[1].nativeElement.textContent).toContain('Pokemon');
      expect(subItems[2].nativeElement.textContent).toContain('Magic');
      expect(subItems[3].nativeElement.textContent).toContain('Yugi Oh');
    });
  });

  // ========== PRUEBAS DE VISIBILIDAD SEGÚN ESTADO ==========
  describe('Visibilidad según estado de autenticación', () => {
    it('should show "Registrar" and "Login" when not logged in', () => {
      component.usuarioActual.set(null);
      fixture.detectChanges();
      
      const registrar = fixture.debugElement.query(By.css('a[routerLink="/registro"]'));
      const login = fixture.debugElement.query(By.css('a[routerLink="/login"]'));
      
      expect(registrar).toBeTruthy();
      expect(login).toBeTruthy();
    });

    it('should NOT show "Registrar" and "Login" when logged in', () => {
      component.usuarioActual.set(mockUsuarioNormal);
      fixture.detectChanges();
      
      const registrar = fixture.debugElement.query(By.css('a[routerLink="/registro"]'));
      const login = fixture.debugElement.query(By.css('a[routerLink="/login"]'));
      
      expect(registrar).toBeNull();
      expect(login).toBeNull();
    });

    it('should show "Mi Perfil" when logged in', () => {
      component.usuarioActual.set(mockUsuarioNormal);
      fixture.detectChanges();
      
      const perfil = fixture.debugElement.query(By.css('a[routerLink="/perfil"]'));
      expect(perfil).toBeTruthy();
      expect(perfil.nativeElement.textContent).toContain('Mi Perfil');
    });

    it('should NOT show "Mi Perfil" when not logged in', () => {
      component.usuarioActual.set(null);
      fixture.detectChanges();
      
      const perfil = fixture.debugElement.query(By.css('a[routerLink="/perfil"]'));
      expect(perfil).toBeNull();
    });

    it('should show "Crear Producto" when user is admin', () => {
      component.usuarioActual.set(mockUsuarioAdmin);
      fixture.detectChanges();
      
      const crear = fixture.debugElement.query(By.css('a[routerLink="/crear-producto"]'));
      expect(crear).toBeTruthy();
      expect(crear.nativeElement.textContent).toContain('Crear Producto');
    });

    it('should NOT show "Crear Producto" when user is not admin', () => {
      component.usuarioActual.set(mockUsuarioNormal);
      fixture.detectChanges();
      
      const crear = fixture.debugElement.query(By.css('a[routerLink="/crear-producto"]'));
      expect(crear).toBeNull();
    });

    it('should show "Gestionar Usuarios" when user is admin', () => {
      component.usuarioActual.set(mockUsuarioAdmin);
      fixture.detectChanges();
      
      const gestionar = fixture.debugElement.query(By.css('a[routerLink="/perfil/gestionar-usuarios"]'));
      expect(gestionar).toBeTruthy();
      expect(gestionar.nativeElement.textContent).toContain('Gestionar Usuarios');
    });

    it('should NOT show "Gestionar Usuarios" when user is not admin', () => {
      component.usuarioActual.set(mockUsuarioNormal);
      fixture.detectChanges();
      
      const gestionar = fixture.debugElement.query(By.css('a[routerLink="/perfil/gestionar-usuarios"]'));
      expect(gestionar).toBeNull();
    });

    it('should show "Cerrar Sesion" when logged in', () => {
      component.usuarioActual.set(mockUsuarioNormal);
      fixture.detectChanges();
      
      const cerrar = fixture.debugElement.query(By.css('[style*="cursor:pointer"]'));
      expect(cerrar).toBeTruthy();
      expect(cerrar.nativeElement.textContent).toContain('Cerrar Sesion');
    });

    it('should NOT show "Cerrar Sesion" when not logged in', () => {
      component.usuarioActual.set(null);
      fixture.detectChanges();
      
      const cerrar = fixture.debugElement.query(By.css('[style*="cursor:pointer"]'));
      expect(cerrar).toBeNull();
    });
  });

  // ========== PRUEBAS DE CLASES CSS ==========
  describe('Clases CSS', () => {
    it('should have class "banner"', () => {
      const element = fixture.debugElement.query(By.css('.banner'));
      expect(element.classes['banner']).toBe(true);
    });

    it('should have class "separador"', () => {
      const element = fixture.debugElement.query(By.css('.separador'));
      expect(element.classes['separador']).toBe(true);
    });

    it('should have class "menu"', () => {
      const element = fixture.debugElement.query(By.css('.menu'));
      expect(element.classes['menu']).toBe(true);
    });

    it('should have class "opcionPadre" on Productos', () => {
      const items = fixture.debugElement.queryAll(By.css('.opcionPadre'));
      expect(items.length).toBeGreaterThan(0);
      expect(items[0].classes['opcionPadre']).toBe(true);
    });

    it('should have class "subopciones" on subcategories', () => {
      const items = fixture.debugElement.queryAll(By.css('.subopciones'));
      expect(items.length).toBe(4);
      expect(items[0].classes['subopciones']).toBe(true);
    });
  });

  // ========== PRUEBAS DE IDs ==========
  describe('IDs en el DOM', () => {
    it('should have id "dibujo"', () => {
      const element = fixture.debugElement.query(By.css('#dibujo'));
      expect(element.nativeElement.id).toBe('dibujo');
    });

    it('should have id "contenedor_banner"', () => {
      const element = fixture.debugElement.query(By.css('#contenedor_banner'));
      expect(element.nativeElement.id).toBe('contenedor_banner');
    });

    it('should have id "tam_banner" on image', () => {
      const element = fixture.debugElement.query(By.css('#tam_banner'));
      expect(element.nativeElement.id).toBe('tam_banner');
    });

    it('should have id "letrabanner2"', () => {
      const element = fixture.debugElement.query(By.css('#letrabanner2'));
      expect(element.nativeElement.id).toBe('letrabanner2');
    });
  });

  // ========== PRUEBAS DE EVENTOS ==========
  describe('Eventos', () => {
    it('should call cerrarSesion when clicking on Cerrar Sesion', () => {
      component.usuarioActual.set(mockUsuarioNormal);
      fixture.detectChanges();
      
      let called = false;
      const originalMethod = component.cerrarSesion;
      
      // Sobrescribir método
      component.cerrarSesion = () => {
        called = true;
      };
      
      const cerrarLink = fixture.debugElement.query(By.css('[style*="cursor:pointer"]'));
      cerrarLink.triggerEventHandler('click', null);
      
      expect(called).toBe(true);
      
      // Restaurar método
      component.cerrarSesion = originalMethod;
    });
  });

  // ========== PRUEBAS DE INTEGRACIÓN ==========
  describe('Integración', () => {
    it('should show admin options when admin logs in', () => {
      // Simular admin logueado
      localStorage.setItem('usuarioActual', JSON.stringify(mockUsuarioAdmin));
      
      // Recargar componente
      fixture = TestBed.createComponent(HeaderComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
      
      // Verificar elementos admin
      const crear = fixture.debugElement.query(By.css('a[routerLink="/crear-producto"]'));
      const gestionar = fixture.debugElement.query(By.css('a[routerLink="/perfil/gestionar-usuarios"]'));
      const perfil = fixture.debugElement.query(By.css('a[routerLink="/perfil"]'));
      
      expect(crear).toBeTruthy();
      expect(gestionar).toBeTruthy();
      expect(perfil).toBeTruthy();
      
      // Verificar que NO muestra login/registro
      const login = fixture.debugElement.query(By.css('a[routerLink="/login"]'));
      const registro = fixture.debugElement.query(By.css('a[routerLink="/registro"]'));
      
      expect(login).toBeNull();
      expect(registro).toBeNull();
    });

    it('should show user options when normal user logs in', () => {
      localStorage.setItem('usuarioActual', JSON.stringify(mockUsuarioNormal));
      
      fixture = TestBed.createComponent(HeaderComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
      
      // Verificar elementos de usuario normal
      const perfil = fixture.debugElement.query(By.css('a[routerLink="/perfil"]'));
      const crear = fixture.debugElement.query(By.css('a[routerLink="/crear-producto"]'));
      const gestionar = fixture.debugElement.query(By.css('a[routerLink="/perfil/gestionar-usuarios"]'));
      
      expect(perfil).toBeTruthy();
      expect(crear).toBeNull();
      expect(gestionar).toBeNull();
      
      // Verificar cerrar sesión
      const cerrar = fixture.debugElement.query(By.css('[style*="cursor:pointer"]'));
      expect(cerrar).toBeTruthy();
    });

    it('should show login/registro when no user is logged in', () => {
      localStorage.removeItem('usuarioActual');
      
      fixture = TestBed.createComponent(HeaderComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
      
      const login = fixture.debugElement.query(By.css('a[routerLink="/login"]'));
      const registro = fixture.debugElement.query(By.css('a[routerLink="/registro"]'));
      const perfil = fixture.debugElement.query(By.css('a[routerLink="/perfil"]'));
      
      expect(login).toBeTruthy();
      expect(registro).toBeTruthy();
      expect(perfil).toBeNull();
    });

    it('should have correct styles for links', () => {
      const links = fixture.debugElement.queryAll(By.css('a'));
      links.forEach(link => {
        const style = link.nativeElement.getAttribute('style');
        if (style) {
          expect(style).toContain('color: white');
          expect(style).toContain('text-decoration: none');
        }
      });
    });
  });

  // ========== PRUEBAS DE ESTRUCTURA DEL MENÚ ==========
  describe('Estructura del menú', () => {
    it('should have correct menu structure with nested items', () => {
      const ul = fixture.debugElement.query(By.css('ul'));
      const items = ul.queryAll(By.css('li'));
      
      // Verificar que hay elementos li
      expect(items.length).toBeGreaterThan(0);
      
      // Verificar que Productos tiene subitems
      const productosLi = items[1]; // El segundo li debería ser Productos
      const subUl = productosLi.query(By.css('ul'));
      expect(subUl).toBeTruthy();
      
      const subItems = subUl.queryAll(By.css('li'));
      expect(subItems.length).toBe(4);
    });
  });
});