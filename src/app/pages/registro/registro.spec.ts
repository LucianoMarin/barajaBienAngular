import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { RegistroComponent } from './registro.component';
import { Usuario } from '../../models/usuario.model';

describe('RegistroComponent', () => {
  let component: RegistroComponent;
  let fixture: ComponentFixture<RegistroComponent>;

  // Datos de prueba
  const mockUsuario: Usuario = {
    id: 1,
    usuario: 'test_user',
    clave: '123456',
    nombres: 'Test',
    apellidoPaterno: 'User',
    apellidoMaterno: 'Test',
    fechaNacimiento: '2000-01-01',
    edad: 25,
    ciudad: 'Santiago',
    direccion: 'Calle Falsa 123',
    rol: 'usuario'
  };

  beforeEach(async () => {
    // Resetear localStorage
    localStorage.clear();

    await TestBed.configureTestingModule({
      imports: [RegistroComponent, FormsModule],
    }).compileComponents();

    fixture = TestBed.createComponent(RegistroComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
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
      expect(component.clave2).toBe('');
      expect(component.nombres).toBe('');
      expect(component.apellidoPaterno).toBe('');
      expect(component.apellidoMaterno).toBe('');
      expect(component.fechaNacimiento).toBe('');
      expect(component.ciudad).toBe('');
      expect(component.direccion).toBe('');
      expect(component.edad()).toBe(0);
      expect(component.mensaje()).toBe('');
    });
  });

  // ========== PRUEBAS DE CÁLCULO DE EDAD ==========
  describe('calcularEdad', () => {
    it('should calculate age correctly', () => {
      const fechaNacimiento = '2000-01-01';
      component.fechaNacimiento = fechaNacimiento;
      
      component.calcularEdad();
      
      const hoy = new Date();
      const nacimiento = new Date(fechaNacimiento);
      let edadEsperada = hoy.getFullYear() - nacimiento.getFullYear();
      const mes = hoy.getMonth() - nacimiento.getMonth();
      if (mes < 0 || (mes === 0 && hoy.getDate() < nacimiento.getDate())) {
        edadEsperada--;
      }
      
      expect(component.edad()).toBe(edadEsperada);
    });

    it('should not calculate age when fechaNacimiento is empty', () => {
      component.fechaNacimiento = '';
      
      component.calcularEdad();
      
      expect(component.edad()).toBe(0);
    });

    it('should handle different dates correctly', () => {
      // Fecha de nacimiento reciente (menor de edad)
      const hoy = new Date();
      const fechaNacimiento = `${hoy.getFullYear() - 10}-${String(hoy.getMonth() + 1).padStart(2, '0')}-${String(hoy.getDate()).padStart(2, '0')}`;
      component.fechaNacimiento = fechaNacimiento;
      
      component.calcularEdad();
      
      expect(component.edad()).toBe(10);
    });
  });

  // ========== PRUEBAS DE OBTENER USUARIOS ==========
  describe('obtenerUsuarios', () => {
    it('should return empty array when no users in localStorage', () => {
      const usuarios = component.obtenerUsuarios();
      expect(usuarios).toEqual([]);
    });

    it('should return users from localStorage', () => {
      const usuariosMock = [mockUsuario];
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
      const usuariosMock = [mockUsuario];
      
      component.guardarUsuarios(usuariosMock);
      
      const stored = localStorage.getItem('usuarios');
      expect(stored).toBe(JSON.stringify(usuariosMock));
    });

    it('should overwrite existing users in localStorage', () => {
      const usuariosMock1 = [mockUsuario];
      const usuariosMock2 = [{ ...mockUsuario, id: 2, usuario: 'user2' }];
      
      component.guardarUsuarios(usuariosMock1);
      component.guardarUsuarios(usuariosMock2);
      
      const stored = localStorage.getItem('usuarios');
      expect(stored).toBe(JSON.stringify(usuariosMock2));
    });
  });

  // ========== PRUEBAS DE REGISTRAR ==========
  describe('registrar', () => {
    beforeEach(() => {
      // Configurar datos válidos
      component.usuario = 'test_user';
      component.clave = '123456';
      component.clave2 = '123456';
      component.nombres = 'Test';
      component.apellidoPaterno = 'User';
      component.apellidoMaterno = 'Test';
      component.fechaNacimiento = '2000-01-01';
      component.ciudad = 'Santiago';
      component.direccion = 'Calle Falsa 123';
      component.calcularEdad();
    });

    it('should show error when passwords do not match', () => {
      component.clave = '123456';
      component.clave2 = '654321';
      
      component.registrar();
      
      expect(component.mensaje()).toBe('Las claves no coinciden');
      expect(component.mensajeTipo()).toBe('error');
      expect(component.obtenerUsuarios().length).toBe(0);
    });

    it('should show error when required fields are empty', () => {
      component.usuario = '';
      
      component.registrar();
      
      expect(component.mensaje()).toBe('Todos los campos son obligatorios');
      expect(component.mensajeTipo()).toBe('error');
    });

    it('should show error when usuario is empty', () => {
      component.usuario = '';
      
      component.registrar();
      
      expect(component.mensaje()).toBe('Todos los campos son obligatorios');
      expect(component.mensajeTipo()).toBe('error');
    });

    it('should show error when nombres is empty', () => {
      component.nombres = '';
      
      component.registrar();
      
      expect(component.mensaje()).toBe('Todos los campos son obligatorios');
      expect(component.mensajeTipo()).toBe('error');
    });

    it('should show error when apellidoPaterno is empty', () => {
      component.apellidoPaterno = '';
      
      component.registrar();
      
      expect(component.mensaje()).toBe('Todos los campos son obligatorios');
      expect(component.mensajeTipo()).toBe('error');
    });

    it('should show error when ciudad is empty', () => {
      component.ciudad = '';
      
      component.registrar();
      
      expect(component.mensaje()).toBe('Todos los campos son obligatorios');
      expect(component.mensajeTipo()).toBe('error');
    });

    it('should show error when direccion is empty', () => {
      component.direccion = '';
      
      component.registrar();
      
      expect(component.mensaje()).toBe('Todos los campos son obligatorios');
      expect(component.mensajeTipo()).toBe('error');
    });

    it('should show error when user is under 18', () => {
      component.edad.set(17);
      
      component.registrar();
      
      expect(component.mensaje()).toBe('Debes ser mayor de 18 años para registrarte');
      expect(component.mensajeTipo()).toBe('error');
    });

    it('should show error when user already exists', () => {
      // Crear usuario existente
      const usuarios = [mockUsuario];
      localStorage.setItem('usuarios', JSON.stringify(usuarios));
      
      component.usuario = 'test_user';
      
      component.registrar();
      
      expect(component.mensaje()).toBe('El usuario ya existe');
      expect(component.mensajeTipo()).toBe('error');
    });

    it('should register successfully', () => {
      component.registrar();
      
      expect(component.mensaje()).toBe('Registro exitoso');
      expect(component.mensajeTipo()).toBe('success');
      
      const usuarios = component.obtenerUsuarios();
      expect(usuarios.length).toBe(1);
      expect(usuarios[0].usuario).toBe('test_user');
      expect(usuarios[0].nombres).toBe('Test');
      expect(usuarios[0].rol).toBe('usuario');
    });

    it('should set correct id for new user', () => {
      // Crear usuario existente
      const usuarios = [mockUsuario];
      localStorage.setItem('usuarios', JSON.stringify(usuarios));
      
      component.usuario = 'new_user';
      component.registrar();
      
      const usuariosActualizados = component.obtenerUsuarios();
      expect(usuariosActualizados.length).toBe(2);
      expect(usuariosActualizados[1].id).toBe(2);
    });

    it('should set rol as "usuario" by default', () => {
      component.registrar();
      
      const usuarios = component.obtenerUsuarios();
      expect(usuarios[0].rol).toBe('usuario');
    });

    it('should clear form after successful registration', () => {
      component.registrar();
      
      expect(component.usuario).toBe('');
      expect(component.clave).toBe('');
      expect(component.clave2).toBe('');
      expect(component.nombres).toBe('');
      expect(component.apellidoPaterno).toBe('');
      expect(component.apellidoMaterno).toBe('');
      expect(component.fechaNacimiento).toBe('');
      expect(component.ciudad).toBe('');
      expect(component.direccion).toBe('');
      expect(component.edad()).toBe(0);
    });

    it('should handle apellidoMaterno as optional', () => {
      component.apellidoMaterno = '';
      component.registrar();
      
      expect(component.mensaje()).toBe('Registro exitoso');
      expect(component.mensajeTipo()).toBe('success');
      
      const usuarios = component.obtenerUsuarios();
      expect(usuarios[0].apellidoMaterno).toBe('');
    });
  });

  // ========== PRUEBAS DE LIMPIAR FORMULARIO ==========
  describe('limpiarFormulario', () => {
    beforeEach(() => {
      // Llenar el formulario con datos
      component.usuario = 'test_user';
      component.clave = '123456';
      component.clave2 = '123456';
      component.nombres = 'Test';
      component.apellidoPaterno = 'User';
      component.apellidoMaterno = 'Test';
      component.fechaNacimiento = '2000-01-01';
      component.ciudad = 'Santiago';
      component.direccion = 'Calle Falsa 123';
      component.edad.set(25);
      component.mensaje.set('Mensaje de prueba');
    });

    it('should clear all form fields', () => {
      component.limpiarFormulario();
      
      expect(component.usuario).toBe('');
      expect(component.clave).toBe('');
      expect(component.clave2).toBe('');
      expect(component.nombres).toBe('');
      expect(component.apellidoPaterno).toBe('');
      expect(component.apellidoMaterno).toBe('');
      expect(component.fechaNacimiento).toBe('');
      expect(component.ciudad).toBe('');
      expect(component.direccion).toBe('');
      expect(component.edad()).toBe(0);
    });

    it('should be called after successful registration (verify by checking form is empty)', () => {
      // Llenar el formulario
      component.usuario = 'test_user';
      component.clave = '123456';
      component.clave2 = '123456';
      component.nombres = 'Test';
      component.apellidoPaterno = 'User';
      component.apellidoMaterno = 'Test';
      component.fechaNacimiento = '2000-01-01';
      component.ciudad = 'Santiago';
      component.direccion = 'Calle Falsa 123';
      component.calcularEdad();
      
      component.registrar();
      
      // Verificar que el formulario se limpió
      expect(component.usuario).toBe('');
      expect(component.clave).toBe('');
      expect(component.clave2).toBe('');
      expect(component.nombres).toBe('');
      expect(component.apellidoPaterno).toBe('');
      expect(component.apellidoMaterno).toBe('');
      expect(component.fechaNacimiento).toBe('');
      expect(component.ciudad).toBe('');
      expect(component.direccion).toBe('');
      expect(component.edad()).toBe(0);
    });
  });

  // ========== PRUEBAS DE RENDERIZADO ==========
  describe('Renderizado del DOM', () => {
    it('should render the registration form', () => {
      const form = fixture.debugElement.query(By.css('form'));
      expect(form).toBeTruthy();
    });

    it('should render the title "Registrar"', () => {
      const title = fixture.debugElement.query(By.css('.card-header h2'));
      expect(title).toBeTruthy();
      expect(title.nativeElement.textContent).toContain('Registrar');
    });

    it('should render all input fields', () => {
      const inputs = fixture.debugElement.queryAll(By.css('input'));
      expect(inputs.length).toBe(10); // 10 campos en el formulario
    });

    it('should render "Usuario" field', () => {
      const input = fixture.debugElement.query(By.css('#usuario'));
      expect(input).toBeTruthy();
      expect(input.nativeElement.getAttribute('type')).toBe('text');
      expect(input.nativeElement.getAttribute('placeholder')).toContain('Ingresa tu usuario');
    });

    it('should render "Contraseña" field', () => {
      const input = fixture.debugElement.query(By.css('#clave'));
      expect(input).toBeTruthy();
      expect(input.nativeElement.getAttribute('type')).toBe('password');
      expect(input.nativeElement.getAttribute('placeholder')).toContain('Ingresa tu contraseña');
    });

    it('should render "Confirmar Contraseña" field', () => {
      const input = fixture.debugElement.query(By.css('#clave2'));
      expect(input).toBeTruthy();
      expect(input.nativeElement.getAttribute('type')).toBe('password');
      expect(input.nativeElement.getAttribute('placeholder')).toContain('Confirma tu contraseña');
    });

    it('should render "Nombres" field', () => {
      const input = fixture.debugElement.query(By.css('#nombres'));
      expect(input).toBeTruthy();
      expect(input.nativeElement.getAttribute('type')).toBe('text');
      expect(input.nativeElement.getAttribute('placeholder')).toContain('Ingresa tus nombres');
    });

    it('should render "Apellido Paterno" field', () => {
      const input = fixture.debugElement.query(By.css('#apellido_paterno'));
      expect(input).toBeTruthy();
      expect(input.nativeElement.getAttribute('placeholder')).toContain('Ingresa tu apellido paterno');
    });

    it('should render "Apellido Materno" field', () => {
      const input = fixture.debugElement.query(By.css('#apellido_materno'));
      expect(input).toBeTruthy();
      expect(input.nativeElement.getAttribute('placeholder')).toContain('Ingresa tu apellido materno');
    });

    it('should render "Fecha de Nacimiento" field', () => {
      const input = fixture.debugElement.query(By.css('#fecha_nacimiento'));
      expect(input).toBeTruthy();
      expect(input.nativeElement.getAttribute('type')).toBe('date');
    });

    it('should render "Edad" field as readonly', () => {
      const input = fixture.debugElement.query(By.css('#edad'));
      expect(input).toBeTruthy();
      expect(input.nativeElement.getAttribute('readonly')).not.toBeNull();
      expect(input.classes['bg-light']).toBe(true);
    });

    it('should render "Ciudad" field', () => {
      const input = fixture.debugElement.query(By.css('#ciudad'));
      expect(input).toBeTruthy();
      expect(input.nativeElement.getAttribute('placeholder')).toContain('Ingresa tu ciudad');
    });

    it('should render "Dirección" field', () => {
      const input = fixture.debugElement.query(By.css('#direccion'));
      expect(input).toBeTruthy();
      expect(input.nativeElement.getAttribute('placeholder')).toContain('Ingresa tu dirección');
    });

    it('should render "Registrar" button', () => {
      const button = fixture.debugElement.query(By.css('button[type="submit"]'));
      expect(button).toBeTruthy();
      expect(button.nativeElement.textContent).toContain('Registrar');
    });

    it('should render "Limpiar" button', () => {
      const button = fixture.debugElement.queryAll(By.css('button'))[1];
      expect(button).toBeTruthy();
      expect(button.nativeElement.textContent).toContain('Limpiar');
    });

    it('should disable submit button when form is invalid', () => {
      const button = fixture.debugElement.query(By.css('button[type="submit"]'));
      expect(button.nativeElement.disabled).toBe(true);
    });

    it('should enable submit button when form is valid', () => {
      // Llenar el formulario
      component.usuario = 'test_user';
      component.clave = '123456';
      component.clave2 = '123456';
      component.nombres = 'Test';
      component.apellidoPaterno = 'User';
      component.apellidoMaterno = 'Test';
      component.fechaNacimiento = '2000-01-01';
      component.ciudad = 'Santiago';
      component.direccion = 'Calle Falsa 123';
      fixture.detectChanges();
      
      const button = fixture.debugElement.query(By.css('button[type="submit"]'));
      expect(button.nativeElement.disabled).toBe(false);
    });
  });

  // ========== PRUEBAS DE MENSAJES ==========
  describe('Mensajes', () => {
    it('should display success message', () => {
      component.mensaje.set('Registro exitoso');
      component.mensajeTipo.set('success');
      fixture.detectChanges();
      
      const alert = fixture.debugElement.query(By.css('.alert-success'));
      expect(alert).toBeTruthy();
      expect(alert.nativeElement.textContent).toContain('Registro exitoso');
    });

    it('should display error message', () => {
      component.mensaje.set('Error en el registro');
      component.mensajeTipo.set('error');
      fixture.detectChanges();
      
      const alert = fixture.debugElement.query(By.css('.alert-danger'));
      expect(alert).toBeTruthy();
      expect(alert.nativeElement.textContent).toContain('Error en el registro');
    });

    it('should not display message when empty', () => {
      component.mensaje.set('');
      fixture.detectChanges();
      
      const alert = fixture.debugElement.query(By.css('.alert'));
      expect(alert).toBeNull();
    });
  });

  // ========== PRUEBAS DE EVENTOS ==========
  describe('Eventos del DOM', () => {
    it('should call registrar when form is submitted', () => {
      let called = false;
      const originalMethod = component.registrar;
      
      component.registrar = () => {
        called = true;
      };
      
      const form = fixture.debugElement.query(By.css('form'));
      form.triggerEventHandler('ngSubmit', null);
      
      expect(called).toBe(true);
      
      // Restaurar método
      component.registrar = originalMethod;
    });

    it('should call limpiarFormulario when "Limpiar" button is clicked', () => {
      let called = false;
      const originalMethod = component.limpiarFormulario;
      
      component.limpiarFormulario = () => {
        called = true;
      };
      
      const button = fixture.debugElement.queryAll(By.css('button'))[1];
      button.triggerEventHandler('click', null);
      
      expect(called).toBe(true);
      
      // Restaurar método
      component.limpiarFormulario = originalMethod;
    });

    it('should call calcularEdad when fechaNacimiento changes', () => {
      let called = false;
      const originalMethod = component.calcularEdad;
      
      component.calcularEdad = () => {
        called = true;
      };
      
      const input = fixture.debugElement.query(By.css('#fecha_nacimiento'));
      input.triggerEventHandler('change', null);
      
      expect(called).toBe(true);
      
      // Restaurar método
      component.calcularEdad = originalMethod;
    });

    it('should update usuario when input changes', () => {
      const input = fixture.debugElement.query(By.css('#usuario'));
      input.nativeElement.value = 'new_user';
      input.nativeElement.dispatchEvent(new Event('input'));
      fixture.detectChanges();
      
      expect(component.usuario).toBe('new_user');
    });

    it('should update clave when input changes', () => {
      const input = fixture.debugElement.query(By.css('#clave'));
      input.nativeElement.value = '123456';
      input.nativeElement.dispatchEvent(new Event('input'));
      fixture.detectChanges();
      
      expect(component.clave).toBe('123456');
    });

    it('should update nombres when input changes', () => {
      const input = fixture.debugElement.query(By.css('#nombres'));
      input.nativeElement.value = 'New Name';
      input.nativeElement.dispatchEvent(new Event('input'));
      fixture.detectChanges();
      
      expect(component.nombres).toBe('New Name');
    });
  });

  // ========== PRUEBAS DE INTEGRACIÓN ==========
  describe('Integración', () => {
    it('should complete full registration flow successfully', () => {
      // Llenar el formulario
      component.usuario = 'new_user';
      component.clave = '123456';
      component.clave2 = '123456';
      component.nombres = 'New';
      component.apellidoPaterno = 'User';
      component.apellidoMaterno = 'Test';
      component.fechaNacimiento = '2000-01-01';
      component.ciudad = 'Santiago';
      component.direccion = 'Calle Falsa 123';
      component.calcularEdad();
      fixture.detectChanges();
      
      // Registrar
      component.registrar();
      fixture.detectChanges();
      
      // Verificar mensaje de éxito
      expect(component.mensaje()).toBe('Registro exitoso');
      expect(component.mensajeTipo()).toBe('success');
      
      // Verificar que se guardó en localStorage
      const usuarios = component.obtenerUsuarios();
      expect(usuarios.length).toBe(1);
      expect(usuarios[0].usuario).toBe('new_user');
      expect(usuarios[0].nombres).toBe('New');
      expect(usuarios[0].rol).toBe('usuario');
      expect(usuarios[0].edad).toBeGreaterThan(18);
      
      // Verificar que el formulario se limpió
      expect(component.usuario).toBe('');
      expect(component.clave).toBe('');
      expect(component.clave2).toBe('');
    });

    it('should prevent registration of duplicate users', () => {
      // Registrar primer usuario
      component.usuario = 'duplicate_user';
      component.clave = '123456';
      component.clave2 = '123456';
      component.nombres = 'Test';
      component.apellidoPaterno = 'User';
      component.apellidoMaterno = 'Test';
      component.fechaNacimiento = '2000-01-01';
      component.ciudad = 'Santiago';
      component.direccion = 'Calle Falsa 123';
      component.calcularEdad();
      component.registrar();
      
      // Intentar registrar el mismo usuario
      component.registrar();
      
      expect(component.mensaje()).toBe('El usuario ya existe');
      expect(component.mensajeTipo()).toBe('error');
      
      const usuarios = component.obtenerUsuarios();
      expect(usuarios.length).toBe(1);
    });

    it('should reject registration of minor users', () => {
      component.usuario = 'minor_user';
      component.clave = '123456';
      component.clave2 = '123456';
      component.nombres = 'Minor';
      component.apellidoPaterno = 'User';
      component.apellidoMaterno = 'Test';
      component.fechaNacimiento = '2010-01-01';
      component.ciudad = 'Santiago';
      component.direccion = 'Calle Falsa 123';
      component.calcularEdad();
      
      component.registrar();
      
      expect(component.mensaje()).toBe('Debes ser mayor de 18 años para registrarte');
      expect(component.mensajeTipo()).toBe('error');
      expect(component.obtenerUsuarios().length).toBe(0);
    });

    it('should handle multiple registrations successfully', () => {
      const usuariosData = [
        { usuario: 'user1', nombres: 'User One' },
        { usuario: 'user2', nombres: 'User Two' },
        { usuario: 'user3', nombres: 'User Three' }
      ];
      
      usuariosData.forEach((data, index) => {
        component.usuario = data.usuario;
        component.clave = '123456';
        component.clave2 = '123456';
        component.nombres = data.nombres;
        component.apellidoPaterno = 'Test';
        component.apellidoMaterno = 'Test';
        component.fechaNacimiento = '2000-01-01';
        component.ciudad = 'Santiago';
        component.direccion = 'Calle Falsa 123';
        component.calcularEdad();
        component.registrar();
        
        const usuarios = component.obtenerUsuarios();
        expect(usuarios.length).toBe(index + 1);
        expect(usuarios[index].usuario).toBe(data.usuario);
        expect(usuarios[index].id).toBe(index + 1);
      });
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

    it('should have btn and btn-secondary classes on limpiar button', () => {
      const button = fixture.debugElement.queryAll(By.css('button'))[1];
      expect(button.classes['btn']).toBe(true);
      expect(button.classes['btn-secondary']).toBe(true);
    });
  });
});