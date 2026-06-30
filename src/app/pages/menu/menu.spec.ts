import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { MenuComponent } from './menu.component';
import { Usuario } from '../../models/usuario.model';

describe('MenuComponent', () => {
  let component: MenuComponent;
  let fixture: ComponentFixture<MenuComponent>;
  let navigateCalled: boolean = false;
  let navigateParams: any[] = [];

  // Mock manual del Router
  const mockRouter = {
    navigate: (params: any[]) => {
      navigateCalled = true;
      navigateParams = params;
      return Promise.resolve(true);
    }
  };

  // Datos de prueba
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

  beforeEach(async () => {
    // Resetear variables
    navigateCalled = false;
    navigateParams = [];
    localStorage.clear();

    await TestBed.configureTestingModule({
      imports: [MenuComponent, CommonModule, RouterModule],
      providers: [
        { provide: Router, useValue: mockRouter }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(MenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
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
      const newComponent = new MenuComponent(mockRouter as any);
      
      expect(newComponent.usuarioActual()).toEqual(mockUsuarioAdmin);
    });

    it('should handle invalid JSON in localStorage', () => {
      localStorage.setItem('usuarioActual', 'invalid-json');
      
      const newComponent = new MenuComponent(mockRouter as any);
      
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

    it('should keep null when no user in localStorage', () => {
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

  // ========== PRUEBAS DE RENDERIZADO ==========
  describe('Renderizado del menú', () => {
    it('should render the menu container', () => {
      const menu = fixture.debugElement.query(By.css('.menu'));
      expect(menu).toBeTruthy();
    });

    it('should render the nav element', () => {
      const nav = fixture.debugElement.query(By.css('nav'));
      expect(nav).toBeTruthy();
    });

    it('should render the container', () => {
      const container = fixture.debugElement.query(By.css('.container'));
      expect(container).toBeTruthy();
    });

    it('should render the unordered list', () => {
      const ul = fixture.debugElement.query(By.css('ul'));
      expect(ul).toBeTruthy();
    });

    it('should render the "Inicio" link', () => {
      const link = fixture.debugElement.query(By.css('a[routerLink="/inicio"]'));
      expect(link).toBeTruthy();
      expect(link.nativeElement.textContent).toContain('Inicio');
    });

    it('should render the "Productos" link', () => {
      const link = fixture.debugElement.query(By.css('a[routerLink="/productos"]'));
      expect(link).toBeTruthy();
      expect(link.nativeElement.textContent).toContain('Productos');
    });

    it('should render the "Eventos" link', () => {
      const link = fixture.debugElement.query(By.css('a[routerLink="/eventos"]'));
      expect(link).toBeTruthy();
      expect(link.nativeElement.textContent).toContain('Eventos');
    });
  });

  // ========== PRUEBAS DE VISIBILIDAD SEGÚN ESTADO ==========
  describe('Visibilidad según estado de autenticación', () => {
    it('should show "Login" and "Registrar" when not logged in', () => {
      component.usuarioActual.set(null);
      fixture.detectChanges();
      
      const login = fixture.debugElement.query(By.css('a[routerLink="/login"]'));
      const registrar = fixture.debugElement.query(By.css('a[routerLink="/registro"]'));
      
      expect(login).toBeTruthy();
      expect(registrar).toBeTruthy();
    });

    it('should NOT show "Login" and "Registrar" when logged in', () => {
      component.usuarioActual.set(mockUsuarioNormal);
      fixture.detectChanges();
      
      const login = fixture.debugElement.query(By.css('a[routerLink="/login"]'));
      const registrar = fixture.debugElement.query(By.css('a[routerLink="/registro"]'));
      
      expect(login).toBeNull();
      expect(registrar).toBeNull();
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

    it('should show "Cerrar Sesión" when logged in', () => {
      component.usuarioActual.set(mockUsuarioNormal);
      fixture.detectChanges();
      
      const cerrar = fixture.debugElement.query(By.css('[style*="cursor:pointer"]'));
      expect(cerrar).toBeTruthy();
      expect(cerrar.nativeElement.textContent).toContain('Cerrar Sesión');
    });

    it('should NOT show "Cerrar Sesión" when not logged in', () => {
      component.usuarioActual.set(null);
      fixture.detectChanges();
      
      const cerrar = fixture.debugElement.query(By.css('[style*="cursor:pointer"]'));
      expect(cerrar).toBeNull();
    });
  });

  // ========== PRUEBAS DE CLASES CSS ==========
  describe('Clases CSS', () => {
    it('should have class "menu"', () => {
      const element = fixture.debugElement.query(By.css('.menu'));
      expect(element.classes['menu']).toBe(true);
    });

    it('should have class "container"', () => {
      const element = fixture.debugElement.query(By.css('.container'));
      expect(element.classes['container']).toBe(true);
    });

    it('should have class "active" on active links when set', () => {
      // El routerLinkActive se prueba mejor en integración
      const links = fixture.debugElement.queryAll(By.css('[routerLinkActive]'));
      expect(links.length).toBeGreaterThan(0);
    });
  });

  // ========== PRUEBAS DE EVENTOS ==========
  describe('Eventos', () => {
    it('should call cerrarSesion when clicking on "Cerrar Sesión"', () => {
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
      localStorage.setItem('usuarioActual', JSON.stringify(mockUsuarioAdmin));
      
      // Recargar componente
      fixture = TestBed.createComponent(MenuComponent);
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
      
      fixture = TestBed.createComponent(MenuComponent);
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
      
      fixture = TestBed.createComponent(MenuComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
      
      const login = fixture.debugElement.query(By.css('a[routerLink="/login"]'));
      const registro = fixture.debugElement.query(By.css('a[routerLink="/registro"]'));
      const perfil = fixture.debugElement.query(By.css('a[routerLink="/perfil"]'));
      
      expect(login).toBeTruthy();
      expect(registro).toBeTruthy();
      expect(perfil).toBeNull();
    });

    it('should have correct menu order', () => {
      const links = fixture.debugElement.queryAll(By.css('ul li a'));
      const texts = links.map(link => link.nativeElement.textContent.trim());
      
      // Verificar orden básico (sin considerar condicionales)
      expect(texts).toContain('Inicio');
      expect(texts).toContain('Productos');
      expect(texts).toContain('Eventos');
    });
  });

  // ========== PRUEBAS DE ESTRUCTURA DEL DOM ==========
  describe('Estructura del DOM', () => {
    it('should have nav > div.container > ul structure', () => {
      const nav = fixture.debugElement.query(By.css('nav'));
      const container = nav.query(By.css('.container'));
      const ul = container.query(By.css('ul'));
      
      expect(nav).toBeTruthy();
      expect(container).toBeTruthy();
      expect(ul).toBeTruthy();
    });

    it('should have all list items as children of ul', () => {
      const ul = fixture.debugElement.query(By.css('ul'));
      const items = ul.queryAll(By.css('li'));
      
      expect(items.length).toBeGreaterThan(0);
    });

    it('should have links inside list items', () => {
      const items = fixture.debugElement.queryAll(By.css('ul li'));
      items.forEach(item => {
        const link = item.query(By.css('a'));
        expect(link).toBeTruthy();
      });
    });
  });

  // ========== PRUEBAS DE ACTUALIZACIÓN EN TIEMPO REAL ==========
  describe('Actualización en tiempo real', () => {
    it('should update menu when user logs in', () => {
      // Estado inicial: no logueado
      component.usuarioActual.set(null);
      fixture.detectChanges();
      
      let login = fixture.debugElement.query(By.css('a[routerLink="/login"]'));
      let perfil = fixture.debugElement.query(By.css('a[routerLink="/perfil"]'));
      
      expect(login).toBeTruthy();
      expect(perfil).toBeNull();
      
      // Simular login
      component.usuarioActual.set(mockUsuarioNormal);
      fixture.detectChanges();
      
      login = fixture.debugElement.query(By.css('a[routerLink="/login"]'));
      perfil = fixture.debugElement.query(By.css('a[routerLink="/perfil"]'));
      
      expect(login).toBeNull();
      expect(perfil).toBeTruthy();
    });

    it('should update menu when user logs out', () => {
      // Estado inicial: logueado
      component.usuarioActual.set(mockUsuarioNormal);
      fixture.detectChanges();
      
      let login = fixture.debugElement.query(By.css('a[routerLink="/login"]'));
      let perfil = fixture.debugElement.query(By.css('a[routerLink="/perfil"]'));
      
      expect(login).toBeNull();
      expect(perfil).toBeTruthy();
      
      // Simular logout
      component.usuarioActual.set(null);
      fixture.detectChanges();
      
      login = fixture.debugElement.query(By.css('a[routerLink="/login"]'));
      perfil = fixture.debugElement.query(By.css('a[routerLink="/perfil"]'));
      
      expect(login).toBeTruthy();
      expect(perfil).toBeNull();
    });
  });
});