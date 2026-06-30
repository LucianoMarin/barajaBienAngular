import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { LoginComponent } from './login.component';
import { Usuario } from '../../models/usuario.model';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let navigateCalled: boolean = false;
  let navigateParams: any[] = [];
  let reloadCalled: boolean = false;

  // Mock manual del Router
  const mockRouter = {
    navigate: (params: any[]) => {
      navigateCalled = true;
      navigateParams = params;
      return Promise.resolve(true);
    }
  };

  // Mock de window.location.reload
  const originalReload = window.location.reload;
  const mockReload = () => {
    reloadCalled = true;
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
    reloadCalled = false;
    localStorage.clear();

    // Mock de window.location.reload
    Object.defineProperty(window, 'location', {
      value: { reload: mockReload },
      writable: true
    });

    await TestBed.configureTestingModule({
      imports: [LoginComponent, FormsModule, RouterModule],
      providers: [
        { provide: Router, useValue: mockRouter }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    // Restaurar window.location.reload
    Object.defineProperty(window, 'location', {
      value: { reload: originalReload },
      writable: true
    });
  });

  // ========== PRUEBAS DE CREACIÓN ==========
  it('should create', () => {
    expect(component).toBeTruthy();
  });

  // ========== PRUEBAS DE INICIALIZACIÓN ==========
  describe('Inicialización', () => {
    it('should initialize with empty fields', () => {
      expect(component.usuario).toBe('');
      expect(component.clave).toBe('');
      expect(component.mensaje()).toBe('');
    });
  });

  // ========== PRUEBAS DE OBTENER USUARIOS ==========
  describe('obtenerUsuarios', () => {
    it('should return empty array when no users in localStorage', () => {
      const usuarios = component.obtenerUsuarios();
      expect(usuarios).toEqual([]);
    });

    it('should return users from localStorage', () => {
      const usuariosMock = [mockUsuarioAdmin];
      localStorage.setItem('usuarios', JSON.stringify(usuariosMock));
      
      const usuarios = component.obtenerUsuarios();
      expect(usuarios).toEqual(usuariosMock);
    });

    it('should handle invalid JSON in localStorage', () => {
      localStorage.setItem('usuarios', 'invalid-json');
      
      const usuarios = component.obtenerUsuarios();
      expect(usuarios).toEqual([]);
    });
  });

  // ========== PRUEBAS DE INGRESAR ==========
  describe('ingresar', () => {
    beforeEach(() => {
      // Configurar usuarios en localStorage
      const usuarios = [mockUsuarioAdmin, mockUsuarioNormal];
      localStorage.setItem('usuarios', JSON.stringify(usuarios));
    });

    it('should show error when usuario is empty', () => {
      component.usuario = '';
      component.clave = '123456';
      
      component.ingresar();
      
      expect(component.mensaje()).toBe('Todos los campos son obligatorios');
      expect(component.mensajeTipo()).toBe('error');
      expect(navigateCalled).toBe(false);
    });

    it('should show error when clave is empty', () => {
      component.usuario = 'admin_test';
      component.clave = '';
      
      component.ingresar();
      
      expect(component.mensaje()).toBe('Todos los campos son obligatorios');
      expect(component.mensajeTipo()).toBe('error');
      expect(navigateCalled).toBe(false);
    });

    it('should show error when both fields are empty', () => {
      component.usuario = '';
      component.clave = '';
      
      component.ingresar();
      
      expect(component.mensaje()).toBe('Todos los campos son obligatorios');
      expect(component.mensajeTipo()).toBe('error');
      expect(navigateCalled).toBe(false);
    });

    it('should show error when credentials are incorrect', () => {
      component.usuario = 'admin_test';
      component.clave = 'wrong_password';
      
      component.ingresar();
      
      expect(component.mensaje()).toBe('Usuario o clave incorrectos');
      expect(component.mensajeTipo()).toBe('error');
      expect(navigateCalled).toBe(false);
    });

    it('should show error when user does not exist', () => {
      component.usuario = 'nonexistent_user';
      component.clave = '123456';
      
      component.ingresar();
      
      expect(component.mensaje()).toBe('Usuario o clave incorrectos');
      expect(component.mensajeTipo()).toBe('error');
      expect(navigateCalled).toBe(false);
    });

    it('should login successfully with admin credentials', () => {
      component.usuario = 'admin_test';
      component.clave = '123456';
      
      component.ingresar();
      
      expect(component.mensaje()).toBe('Bienvenido Admin');
      expect(component.mensajeTipo()).toBe('success');
      expect(navigateCalled).toBe(true);
      expect(navigateParams).toEqual(['/']);
    });

    it('should login successfully with normal user credentials', () => {
      component.usuario = 'user_test';
      component.clave = '123456';
      
      component.ingresar();
      
      expect(component.mensaje()).toBe('Bienvenido User');
      expect(component.mensajeTipo()).toBe('success');
      expect(navigateCalled).toBe(true);
      expect(navigateParams).toEqual(['/']);
    });

    it('should save user to localStorage on successful login', () => {
      component.usuario = 'admin_test';
      component.clave = '123456';
      
      component.ingresar();
      
      const usuarioActual = localStorage.getItem('usuarioActual');
      expect(usuarioActual).toBeTruthy();
      const parsed = JSON.parse(usuarioActual || '');
      expect(parsed.usuario).toBe('admin_test');
      expect(parsed.rol).toBe('admin');
    });

    it('should call window.location.reload after successful login', () => {
      component.usuario = 'admin_test';
      component.clave = '123456';
      
      component.ingresar();
      
      expect(reloadCalled).toBe(true);
    });

    it('should not save user to localStorage on failed login', () => {
      component.usuario = 'admin_test';
      component.clave = 'wrong_password';
      
      component.ingresar();
      
      const usuarioActual = localStorage.getItem('usuarioActual');
      expect(usuarioActual).toBeNull();
    });

    it('should handle case-sensitive credentials', () => {
      component.usuario = 'ADMIN_TEST';
      component.clave = '123456';
      
      component.ingresar();
      
      expect(component.mensaje()).toBe('Usuario o clave incorrectos');
      expect(component.mensajeTipo()).toBe('error');
      expect(navigateCalled).toBe(false);
    });

    it('should handle empty usuarios array in localStorage', () => {
      localStorage.setItem('usuarios', JSON.stringify([]));
      
      component.usuario = 'admin_test';
      component.clave = '123456';
      
      component.ingresar();
      
      expect(component.mensaje()).toBe('Usuario o clave incorrectos');
      expect(component.mensajeTipo()).toBe('error');
      expect(navigateCalled).toBe(false);
    });
  });

  // ========== PRUEBAS DE RENDERIZADO ==========
  describe('Renderizado del DOM', () => {
    it('should render the login form', () => {
      const form = fixture.debugElement.query(By.css('form'));
      expect(form).toBeTruthy();
    });

    it('should render the title "Login"', () => {
      const title = fixture.debugElement.query(By.css('.card-header h2'));
      expect(title).toBeTruthy();
      expect(title.nativeElement.textContent).toContain('Login');
    });

    it('should render the usuario input field', () => {
      const input = fixture.debugElement.query(By.css('#usuario'));
      expect(input).toBeTruthy();
      expect(input.nativeElement.getAttribute('type')).toBe('text');
      expect(input.nativeElement.getAttribute('placeholder')).toContain('Ingresa tu usuario');
    });

    it('should render the clave input field', () => {
      const input = fixture.debugElement.query(By.css('#clave'));
      expect(input).toBeTruthy();
      expect(input.nativeElement.getAttribute('type')).toBe('password');
      expect(input.nativeElement.getAttribute('placeholder')).toContain('Ingresa tu contraseña');
    });

    it('should render the "Recuperar Contraseña" link', () => {
      const label = fixture.debugElement.query(By.css('label[for="recuperar"]'));
      expect(label).toBeTruthy();
      expect(label.nativeElement.textContent).toContain('Recuperar Contraseña');
      
      const link = label.query(By.css('a[routerLink="/recuperar"]'));
      expect(link).toBeTruthy();
      expect(link.nativeElement.textContent).toContain('Aqui');
    });

    it('should render the "Entrar" button', () => {
      const button = fixture.debugElement.query(By.css('button[type="submit"]'));
      expect(button).toBeTruthy();
      expect(button.nativeElement.textContent).toContain('Entrar');
    });

    it('should render the "Registrate aqui" link', () => {
      const link = fixture.debugElement.query(By.css('a[routerLink="/registro"]'));
      expect(link).toBeTruthy();
      expect(link.nativeElement.textContent).toContain('Registrate aqui');
    });

    it('should render the "¿No tienes cuenta?" text', () => {
      const text = fixture.debugElement.query(By.css('.text-center p'));
      expect(text).toBeTruthy();
      expect(text.nativeElement.textContent).toContain('¿No tienes cuenta?');
    });

    it('should disable submit button when form is invalid', () => {
      const button = fixture.debugElement.query(By.css('button[type="submit"]'));
      expect(button.nativeElement.disabled).toBe(true);
      
      // Llenar el formulario
      component.usuario = 'admin_test';
      component.clave = '123456';
      fixture.detectChanges();
      
      expect(button.nativeElement.disabled).toBe(false);
    });

    it('should display success message when login is successful', () => {
      const usuarios = [mockUsuarioAdmin];
      localStorage.setItem('usuarios', JSON.stringify(usuarios));
      
      component.usuario = 'admin_test';
      component.clave = '123456';
      
      component.ingresar();
      fixture.detectChanges();
      
      const messageEl = fixture.debugElement.query(By.css('.alert-success'));
      expect(messageEl).toBeTruthy();
      expect(messageEl.nativeElement.textContent).toContain('Bienvenido Admin');
    });

    it('should display error message when login fails', () => {
      component.usuario = 'admin_test';
      component.clave = 'wrong';
      
      component.ingresar();
      fixture.detectChanges();
      
      const messageEl = fixture.debugElement.query(By.css('.alert-danger'));
      expect(messageEl).toBeTruthy();
      expect(messageEl.nativeElement.textContent).toContain('Usuario o clave incorrectos');
    });

    it('should display error message when fields are empty', () => {
      component.usuario = '';
      component.clave = '';
      
      component.ingresar();
      fixture.detectChanges();
      
      const messageEl = fixture.debugElement.query(By.css('.alert-danger'));
      expect(messageEl).toBeTruthy();
      expect(messageEl.nativeElement.textContent).toContain('Todos los campos son obligatorios');
    });
  });

  // ========== PRUEBAS DE EVENTOS ==========
  describe('Eventos del DOM', () => {
    it('should call ingresar when form is submitted', () => {
      let called = false;
      const originalMethod = component.ingresar;
      
      component.ingresar = () => {
        called = true;
      };
      
      const form = fixture.debugElement.query(By.css('form'));
      form.triggerEventHandler('ngSubmit', null);
      
      expect(called).toBe(true);
      
      component.ingresar = originalMethod;
    });

    it('should update usuario when input changes', () => {
      const input = fixture.debugElement.query(By.css('#usuario'));
      input.nativeElement.value = 'admin_test';
      input.nativeElement.dispatchEvent(new Event('input'));
      fixture.detectChanges();
      
      expect(component.usuario).toBe('admin_test');
    });

    it('should update clave when input changes', () => {
      const input = fixture.debugElement.query(By.css('#clave'));
      input.nativeElement.value = '123456';
      input.nativeElement.dispatchEvent(new Event('input'));
      fixture.detectChanges();
      
      expect(component.clave).toBe('123456');
    });
  });

  // ========== PRUEBAS DE INTEGRACIÓN ==========
  describe('Integración', () => {
    it('should complete full login flow successfully', () => {
      const usuarios = [mockUsuarioAdmin];
      localStorage.setItem('usuarios', JSON.stringify(usuarios));
      
      // Simular entrada de datos
      component.usuario = 'admin_test';
      component.clave = '123456';
      fixture.detectChanges();
      
      // Ejecutar login
      component.ingresar();
      fixture.detectChanges();
      
      // Verificar mensaje de éxito
      expect(component.mensaje()).toBe('Bienvenido Admin');
      expect(component.mensajeTipo()).toBe('success');
      
      // Verificar navegación
      expect(navigateCalled).toBe(true);
      expect(navigateParams).toEqual(['/']);
      
      // Verificar localStorage
      const usuarioActual = localStorage.getItem('usuarioActual');
      expect(usuarioActual).toBeTruthy();
      const parsed = JSON.parse(usuarioActual || '');
      expect(parsed.usuario).toBe('admin_test');
    });

    it('should handle multiple users in localStorage', () => {
      const usuarios = [mockUsuarioAdmin, mockUsuarioNormal];
      localStorage.setItem('usuarios', JSON.stringify(usuarios));
      
      // Login con usuario normal
      component.usuario = 'user_test';
      component.clave = '123456';
      
      component.ingresar();
      
      expect(component.mensaje()).toBe('Bienvenido User');
      expect(component.mensajeTipo()).toBe('success');
      
      const usuarioActual = localStorage.getItem('usuarioActual');
      const parsed = JSON.parse(usuarioActual || '');
      expect(parsed.usuario).toBe('user_test');
      expect(parsed.rol).toBe('user');
    });

    it('should not login with incorrect password for existing user', () => {
      const usuarios = [mockUsuarioAdmin];
      localStorage.setItem('usuarios', JSON.stringify(usuarios));
      
      component.usuario = 'admin_test';
      component.clave = 'wrong_password';
      
      component.ingresar();
      
      expect(component.mensaje()).toBe('Usuario o clave incorrectos');
      expect(component.mensajeTipo()).toBe('error');
      expect(navigateCalled).toBe(false);
      expect(localStorage.getItem('usuarioActual')).toBeNull();
    });
  });

  // ========== PRUEBAS DE CLASES CSS ==========
  describe('Clases CSS', () => {
    it('should have container class', () => {
      const container = fixture.debugElement.query(By.css('.container'));
      expect(container.classes['container']).toBe(true);
    });

    it('should have card class', () => {
      const card = fixture.debugElement.query(By.css('.card'));
      expect(card.classes['card']).toBe(true);
    });

    it('should have card-header class', () => {
      const header = fixture.debugElement.query(By.css('.card-header'));
      expect(header.classes['card-header']).toBe(true);
    });

    it('should have card-body class', () => {
      const body = fixture.debugElement.query(By.css('.card-body'));
      expect(body.classes['card-body']).toBe(true);
    });

    it('should have form-control class on inputs', () => {
      const inputs = fixture.debugElement.queryAll(By.css('.form-control'));
      inputs.forEach(input => {
        expect(input.classes['form-control']).toBe(true);
      });
    });

    it('should have btn and btn-primary classes on submit button', () => {
      const button = fixture.debugElement.query(By.css('button[type="submit"]'));
      expect(button.classes['btn']).toBe(true);
      expect(button.classes['btn-primary']).toBe(true);
    });
  });
});