import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { PerfilComponent } from './perfil.component';
import { Usuario } from '../../models/usuario.model';

describe('PerfilComponent', () => {
  let component: PerfilComponent;
  let fixture: ComponentFixture<PerfilComponent>;
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
      imports: [PerfilComponent, FormsModule, RouterModule],
      providers: [
        { provide: Router, useValue: mockRouter }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(PerfilComponent);
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
    it('should initialize with null user', () => {
      expect(component.usuarioActual()).toBeNull();
    });

    it('should initialize with empty form fields', () => {
      expect(component.antiguaClave).toBe('');
      expect(component.nuevaClave).toBe('');
      expect(component.confirmarClave).toBe('');
      expect(component.mostrarFormularioCambio()).toBe(false);
    });

    it('should load user from localStorage on init', () => {
      localStorage.setItem('usuarioActual', JSON.stringify(mockUsuarioAdmin));
      
      // Crear nuevo componente para cargar el usuario
      const newComponent = new PerfilComponent(mockRouter as any);
      
      expect(newComponent.usuarioActual()).toEqual(mockUsuarioAdmin);
    });

    it('should navigate to login when no user in localStorage', () => {
      // Crear nuevo componente sin usuario en localStorage
      const newComponent = new PerfilComponent(mockRouter as any);
      
      expect(navigateCalled).toBe(true);
      expect(navigateParams).toEqual(['/login']);
    });

    it('should handle invalid JSON in localStorage', () => {
      localStorage.setItem('usuarioActual', 'invalid-json');
      
      const newComponent = new PerfilComponent(mockRouter as any);
      
      expect(newComponent.usuarioActual()).toBeNull();
      expect(navigateCalled).toBe(true);
      expect(navigateParams).toEqual(['/login']);
    });

    it('should show welcome message when user loads', () => {
      localStorage.setItem('usuarioActual', JSON.stringify(mockUsuarioAdmin));
      
      const newComponent = new PerfilComponent(mockRouter as any);
      
      expect(newComponent.mensaje()).toBe('Bienvenido Admin');
      expect(newComponent.mensajeTipo()).toBe('success');
    });
  });

  // ========== PRUEBAS DE CARGA DE USUARIO ==========
  describe('cargarUsuarioActual', () => {
    it('should load user from localStorage when exists', () => {
      localStorage.setItem('usuarioActual', JSON.stringify(mockUsuarioAdmin));
      
      component.cargarUsuarioActual();
      
      expect(component.usuarioActual()).toEqual(mockUsuarioAdmin);
    });

    it('should navigate to login when no user in localStorage', () => {
      component.cargarUsuarioActual();
      
      expect(navigateCalled).toBe(true);
      expect(navigateParams).toEqual(['/login']);
    });

    it('should show welcome message when user loads', () => {
      localStorage.setItem('usuarioActual', JSON.stringify(mockUsuarioAdmin));
      
      component.cargarUsuarioActual();
      
      expect(component.mensaje()).toBe('Bienvenido Admin');
      expect(component.mensajeTipo()).toBe('success');
    });

    it('should handle JSON parse error', () => {
      localStorage.setItem('usuarioActual', 'invalid-json');
      
      component.cargarUsuarioActual();
      
      expect(component.usuarioActual()).toBeNull();
      expect(navigateCalled).toBe(true);
      expect(navigateParams).toEqual(['/login']);
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

  // ========== PRUEBAS DE GUARDAR USUARIOS ==========
  describe('guardarUsuarios', () => {
    it('should save users to localStorage', () => {
      const usuariosMock = [mockUsuarioAdmin];
      
      component.guardarUsuarios(usuariosMock);
      
      const stored = localStorage.getItem('usuarios');
      expect(stored).toBe(JSON.stringify(usuariosMock));
    });

    it('should overwrite existing users in localStorage', () => {
      const usuariosMock1 = [mockUsuarioAdmin];
      const usuariosMock2 = [mockUsuarioNormal];
      
      component.guardarUsuarios(usuariosMock1);
      component.guardarUsuarios(usuariosMock2);
      
      const stored = localStorage.getItem('usuarios');
      expect(stored).toBe(JSON.stringify(usuariosMock2));
    });
  });

  // ========== PRUEBAS DE TOGGLE FORMULARIO ==========
  describe('toggleFormularioCambio', () => {
    it('should toggle form visibility', () => {
      expect(component.mostrarFormularioCambio()).toBe(false);
      
      component.toggleFormularioCambio();
      expect(component.mostrarFormularioCambio()).toBe(true);
      
      component.toggleFormularioCambio();
      expect(component.mostrarFormularioCambio()).toBe(false);
    });

    it('should clear form fields when toggling', () => {
      component.antiguaClave = 'old';
      component.nuevaClave = 'new';
      component.confirmarClave = 'confirm';
      component.mensaje.set('Mensaje de prueba');
      
      component.toggleFormularioCambio();
      
      expect(component.antiguaClave).toBe('');
      expect(component.nuevaClave).toBe('');
      expect(component.confirmarClave).toBe('');
      expect(component.mensaje()).toBe('');
    });
  });

  // ========== PRUEBAS DE MODIFICAR PASSWORD ==========
  describe('modificarPassword', () => {
    beforeEach(() => {
      // Configurar usuario logueado
      component.usuarioActual.set(mockUsuarioNormal);
      localStorage.setItem('usuarioActual', JSON.stringify(mockUsuarioNormal));
      localStorage.setItem('usuarios', JSON.stringify([mockUsuarioAdmin, mockUsuarioNormal]));
    });

    it('should show error when any field is empty', () => {
      component.antiguaClave = '';
      component.nuevaClave = '';
      component.confirmarClave = '';
      
      component.modificarPassword();
      
      expect(component.mensaje()).toBe('Todos los campos son obligatorios');
      expect(component.mensajeTipo()).toBe('error');
    });

    it('should show error when new passwords do not match', () => {
      component.antiguaClave = '123456';
      component.nuevaClave = 'new123';
      component.confirmarClave = 'new456';
      
      component.modificarPassword();
      
      expect(component.mensaje()).toBe('Las nuevas contraseñas no coinciden');
      expect(component.mensajeTipo()).toBe('error');
    });

    it('should show error when new password is too short', () => {
      component.antiguaClave = '123456';
      component.nuevaClave = '123';
      component.confirmarClave = '123';
      
      component.modificarPassword();
      
      expect(component.mensaje()).toBe('La nueva contraseña debe tener al menos 6 caracteres');
      expect(component.mensajeTipo()).toBe('error');
    });

    it('should show error when current password is incorrect', () => {
      component.antiguaClave = 'wrong_password';
      component.nuevaClave = 'new123456';
      component.confirmarClave = 'new123456';
      
      component.modificarPassword();
      
      expect(component.mensaje()).toBe('La contraseña actual es incorrecta');
      expect(component.mensajeTipo()).toBe('error');
    });

    it('should show error when user is not found', () => {
      component.usuarioActual.set(null);
      component.antiguaClave = '123456';
      component.nuevaClave = 'new123456';
      component.confirmarClave = 'new123456';
      
      component.modificarPassword();
      
      expect(component.mensaje()).toBe('Usuario no encontrado');
      expect(component.mensajeTipo()).toBe('error');
    });

    it('should update password successfully', () => {
      component.antiguaClave = '123456';
      component.nuevaClave = 'new123456';
      component.confirmarClave = 'new123456';
      
      component.modificarPassword();
      
      expect(component.mensaje()).toBe('Contraseña modificada exitosamente');
      expect(component.mensajeTipo()).toBe('success');
      
      // Verificar que se actualizó en localStorage
      const usuarios = component.obtenerUsuarios();
      const usuarioActualizado = usuarios.find((u: Usuario) => u.usuario === 'user_test');
      expect(usuarioActualizado?.clave).toBe('new123456');
      
      // Verificar que se limpió el formulario
      expect(component.antiguaClave).toBe('');
      expect(component.nuevaClave).toBe('');
      expect(component.confirmarClave).toBe('');
      expect(component.mostrarFormularioCambio()).toBe(false);
    });

    it('should update usuarioActual in localStorage after password change', () => {
      component.antiguaClave = '123456';
      component.nuevaClave = 'new123456';
      component.confirmarClave = 'new123456';
      
      component.modificarPassword();
      
      const usuarioActual = localStorage.getItem('usuarioActual');
      expect(usuarioActual).toBeTruthy();
      const parsed = JSON.parse(usuarioActual || '');
      expect(parsed.clave).toBe('new123456');
    });

    it('should work for admin user', () => {
      component.usuarioActual.set(mockUsuarioAdmin);
      localStorage.setItem('usuarioActual', JSON.stringify(mockUsuarioAdmin));
      
      component.antiguaClave = '123456';
      component.nuevaClave = 'admin_new123';
      component.confirmarClave = 'admin_new123';
      
      component.modificarPassword();
      
      expect(component.mensaje()).toBe('Contraseña modificada exitosamente');
      expect(component.mensajeTipo()).toBe('success');
      
      const usuarios = component.obtenerUsuarios();
      const adminActualizado = usuarios.find((u: Usuario) => u.usuario === 'admin_test');
      expect(adminActualizado?.clave).toBe('admin_new123');
    });
  });

  // ========== PRUEBAS DE CIERRE DE SESIÓN ==========
  describe('cerrarSesion', () => {
    it('should remove user from localStorage', () => {
      localStorage.setItem('usuarioActual', JSON.stringify(mockUsuarioAdmin));
      
      component.cerrarSesion();
      
      expect(localStorage.getItem('usuarioActual')).toBeNull();
    });

    it('should navigate to login', () => {
      component.cerrarSesion();
      
      expect(navigateCalled).toBe(true);
      expect(navigateParams).toEqual(['/login']);
    });

    it('should reload page after navigation', () => {
      component.cerrarSesion();
      
      expect(reloadCalled).toBe(true);
    });
  });

  // ========== PRUEBAS DE RENDERIZADO ==========
  describe('Renderizado del DOM', () => {
    beforeEach(() => {
      component.usuarioActual.set(mockUsuarioNormal);
      fixture.detectChanges();
    });

    it('should render the profile container', () => {
      const container = fixture.debugElement.query(By.css('.container'));
      expect(container).toBeTruthy();
    });

    it('should render the "Mi Perfil" title', () => {
      const title = fixture.debugElement.query(By.css('.card-header h1'));
      expect(title).toBeTruthy();
      expect(title.nativeElement.textContent).toContain('Mi Perfil');
    });

    it('should render the user role badge', () => {
      const badge = fixture.debugElement.query(By.css('.badge'));
      expect(badge).toBeTruthy();
      expect(badge.nativeElement.textContent).toContain('Rol: USER');
    });

    it('should render the welcome message', () => {
      const welcome = fixture.debugElement.query(By.css('h3'));
      expect(welcome).toBeTruthy();
      expect(welcome.nativeElement.textContent).toContain('Bienvenido: User Test');
    });

    it('should render all user fields', () => {
      const labels = fixture.debugElement.queryAll(By.css('.form-label'));
      expect(labels.length).toBe(9); // 9 campos de usuario
    });

    it('should render "Usuario" field', () => {
      const label = fixture.debugElement.query(By.css('label:contains("Usuario")'));
      const value = fixture.debugElement.queryAll(By.css('.form-control.bg-light'))[0];
      expect(value.nativeElement.textContent).toContain('user_test');
    });

    it('should render "Nombres" field', () => {
      const value = fixture.debugElement.queryAll(By.css('.form-control.bg-light'))[1];
      expect(value.nativeElement.textContent).toContain('User');
    });

    it('should render "Apellido Paterno" field', () => {
      const value = fixture.debugElement.queryAll(By.css('.form-control.bg-light'))[2];
      expect(value.nativeElement.textContent).toContain('Test');
    });

    it('should render "Apellido Materno" field', () => {
      const value = fixture.debugElement.queryAll(By.css('.form-control.bg-light'))[3];
      expect(value.nativeElement.textContent).toContain('User');
    });

    it('should render "Rol" field', () => {
      const value = fixture.debugElement.queryAll(By.css('.form-control.bg-light'))[4];
      expect(value.nativeElement.textContent).toContain('USER');
    });

    it('should render "Cerrar Sesión" button', () => {
      const button = fixture.debugElement.query(By.css('.btn-danger'));
      expect(button).toBeTruthy();
      expect(button.nativeElement.textContent).toContain('Cerrar Sesión');
    });

    it('should render "Modificar Contraseña" button', () => {
      const button = fixture.debugElement.query(By.css('.btn-warning'));
      expect(button).toBeTruthy();
      expect(button.nativeElement.textContent).toContain('Modificar Contraseña');
    });

    it('should NOT render "Gestionar Usuarios" when not admin', () => {
      const gestionar = fixture.debugElement.query(By.css('.btn-info'));
      expect(gestionar).toBeNull();
    });

    it('should render "Gestionar Usuarios" when admin', () => {
      component.usuarioActual.set(mockUsuarioAdmin);
      fixture.detectChanges();
      
      const gestionar = fixture.debugElement.query(By.css('.btn-info'));
      expect(gestionar).toBeTruthy();
      expect(gestionar.nativeElement.textContent).toContain('Gestionar Usuarios');
    });
  });

  // ========== PRUEBAS DE FORMULARIO DE CAMBIO ==========
  describe('Formulario de cambio de contraseña', () => {
    beforeEach(() => {
      component.usuarioActual.set(mockUsuarioNormal);
      fixture.detectChanges();
    });

    it('should show change password form when toggled', () => {
      const toggleBtn = fixture.debugElement.query(By.css('.btn-warning'));
      toggleBtn.triggerEventHandler('click', null);
      fixture.detectChanges();
      
      const form = fixture.debugElement.query(By.css('.card.border-warning'));
      expect(form).toBeTruthy();
    });

    it('should render all password fields', () => {
      component.mostrarFormularioCambio.set(true);
      fixture.detectChanges();
      
      const inputs = fixture.debugElement.queryAll(By.css('input[type="password"]'));
      expect(inputs.length).toBe(3); // antigua, nueva, confirmar
    });

    it('should render "Antigua Contraseña" field', () => {
      component.mostrarFormularioCambio.set(true);
      fixture.detectChanges();
      
      const label = fixture.debugElement.queryAll(By.css('.form-label'))[9];
      expect(label.nativeElement.textContent).toContain('Antigua Contraseña');
    });

    it('should render "Nueva Contraseña" field', () => {
      component.mostrarFormularioCambio.set(true);
      fixture.detectChanges();
      
      const label = fixture.debugElement.queryAll(By.css('.form-label'))[10];
      expect(label.nativeElement.textContent).toContain('Nueva Contraseña');
    });

    it('should render "Confirmar Nueva Contraseña" field', () => {
      component.mostrarFormularioCambio.set(true);
      fixture.detectChanges();
      
      const label = fixture.debugElement.queryAll(By.css('.form-label'))[11];
      expect(label.nativeElement.textContent).toContain('Confirmar Nueva Contraseña');
    });

    it('should render "Guardar Cambios" button', () => {
      component.mostrarFormularioCambio.set(true);
      fixture.detectChanges();
      
      const button = fixture.debugElement.query(By.css('.btn-success'));
      expect(button).toBeTruthy();
      expect(button.nativeElement.textContent).toContain('Guardar Cambios');
    });

    it('should render "Cancelar" button', () => {
      component.mostrarFormularioCambio.set(true);
      fixture.detectChanges();
      
      const button = fixture.debugElement.query(By.css('.btn-secondary'));
      expect(button).toBeTruthy();
      expect(button.nativeElement.textContent).toContain('Cancelar');
    });

    it('should disable submit button when form is invalid', () => {
      component.mostrarFormularioCambio.set(true);
      fixture.detectChanges();
      
      const button = fixture.debugElement.query(By.css('.btn-success'));
      expect(button.nativeElement.disabled).toBe(true);
    });

    it('should enable submit button when form is valid', () => {
      component.mostrarFormularioCambio.set(true);
      component.antiguaClave = '123456';
      component.nuevaClave = 'new123';
      component.confirmarClave = 'new123';
      fixture.detectChanges();
      
      const button = fixture.debugElement.query(By.css('.btn-success'));
      expect(button.nativeElement.disabled).toBe(false);
    });
  });

  // ========== PRUEBAS DE EVENTOS ==========
  describe('Eventos del DOM', () => {
    beforeEach(() => {
      component.usuarioActual.set(mockUsuarioNormal);
      fixture.detectChanges();
    });

    it('should call cerrarSesion when clicking "Cerrar Sesión"', () => {
      let called = false;
      const originalMethod = component.cerrarSesion;
      
      component.cerrarSesion = () => {
        called = true;
      };
      
      const button = fixture.debugElement.query(By.css('.btn-danger'));
      button.triggerEventHandler('click', null);
      
      expect(called).toBe(true);
      
      component.cerrarSesion = originalMethod;
    });

    it('should call toggleFormularioCambio when clicking "Modificar Contraseña"', () => {
      let called = false;
      const originalMethod = component.toggleFormularioCambio;
      
      component.toggleFormularioCambio = () => {
        called = true;
      };
      
      const button = fixture.debugElement.query(By.css('.btn-warning'));
      button.triggerEventHandler('click', null);
      
      expect(called).toBe(true);
      
      component.toggleFormularioCambio = originalMethod;
    });

    it('should call toggleFormularioCambio when clicking "Cancelar"', () => {
      component.mostrarFormularioCambio.set(true);
      fixture.detectChanges();
      
      let called = false;
      const originalMethod = component.toggleFormularioCambio;
      
      component.toggleFormularioCambio = () => {
        called = true;
      };
      
      const button = fixture.debugElement.query(By.css('.btn-secondary'));
      button.triggerEventHandler('click', null);
      
      expect(called).toBe(true);
      
      component.toggleFormularioCambio = originalMethod;
    });

    it('should call modificarPassword when form is submitted', () => {
      component.mostrarFormularioCambio.set(true);
      fixture.detectChanges();
      
      let called = false;
      const originalMethod = component.modificarPassword;
      
      component.modificarPassword = () => {
        called = true;
      };
      
      const form = fixture.debugElement.query(By.css('form'));
      form.triggerEventHandler('ngSubmit', null);
      
      expect(called).toBe(true);
      
      component.modificarPassword = originalMethod;
    });
  });

  // ========== PRUEBAS DE MENSAJES ==========
  describe('Mensajes', () => {
    it('should display success message', () => {
      component.mensaje.set('Éxito');
      component.mensajeTipo.set('success');
      fixture.detectChanges();
      
      const alert = fixture.debugElement.query(By.css('.alert-success'));
      expect(alert).toBeTruthy();
      expect(alert.nativeElement.textContent).toContain('Éxito');
    });

    it('should display error message', () => {
      component.mensaje.set('Error');
      component.mensajeTipo.set('error');
      fixture.detectChanges();
      
      const alert = fixture.debugElement.query(By.css('.alert-danger'));
      expect(alert).toBeTruthy();
      expect(alert.nativeElement.textContent).toContain('Error');
    });

    it('should not display message when empty', () => {
      component.mensaje.set('');
      fixture.detectChanges();
      
      const alert = fixture.debugElement.query(By.css('.alert'));
      expect(alert).toBeNull();
    });
  });

  // ========== PRUEBAS DE INTEGRACIÓN ==========
  describe('Integración', () => {
    it('should complete full flow: load user, show profile, change password', () => {
      // Preparar datos
      localStorage.setItem('usuarioActual', JSON.stringify(mockUsuarioNormal));
      localStorage.setItem('usuarios', JSON.stringify([mockUsuarioAdmin, mockUsuarioNormal]));
      
      // Crear componente
      const newComponent = new PerfilComponent(mockRouter as any);
      
      // Verificar que se cargó el usuario
      expect(newComponent.usuarioActual()).toEqual(mockUsuarioNormal);
      expect(newComponent.mensaje()).toBe('Bienvenido User');
      
      // Cambiar contraseña
      newComponent.antiguaClave = '123456';
      newComponent.nuevaClave = 'new123456';
      newComponent.confirmarClave = 'new123456';
      newComponent.modificarPassword();
      
      // Verificar éxito
      expect(newComponent.mensaje()).toBe('Contraseña modificada exitosamente');
      expect(newComponent.mensajeTipo()).toBe('success');
      
      // Verificar que se actualizó
      const usuarios = newComponent.obtenerUsuarios();
      const usuarioActualizado = usuarios.find((u: Usuario) => u.usuario === 'user_test');
      expect(usuarioActualizado?.clave).toBe('new123456');
    });

    it('should show error when trying to change password with wrong current password', () => {
      localStorage.setItem('usuarioActual', JSON.stringify(mockUsuarioNormal));
      localStorage.setItem('usuarios', JSON.stringify([mockUsuarioAdmin, mockUsuarioNormal]));
      
      const newComponent = new PerfilComponent(mockRouter as any);
      
      newComponent.antiguaClave = 'wrong_password';
      newComponent.nuevaClave = 'new123456';
      newComponent.confirmarClave = 'new123456';
      newComponent.modificarPassword();
      
      expect(newComponent.mensaje()).toBe('La contraseña actual es incorrecta');
      expect(newComponent.mensajeTipo()).toBe('error');
    });
  });
});