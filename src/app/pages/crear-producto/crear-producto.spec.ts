import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CrearProductoComponent } from './crear-producto.component';
import { Producto } from '../../models/producto.model';

describe('CrearProductoComponent', () => {
  let component: CrearProductoComponent;
  let fixture: ComponentFixture<CrearProductoComponent>;
  let navigateCalled: boolean = false;
  let navigateParams: any[] = [];

  // Mock manual del Router
  const mockRouter = {
    navigate: (params: any[]) => {
      navigateCalled = true;
      navigateParams = params;
    }
  };

  // Datos de prueba
  const mockProducto: Producto = {
    id: 1,
    nombre: 'Producto Test',
    categoria: 'MYL',
    precio: 100,
    imagen: 'assets/images/productos/test.webp',
    descripcion: 'Descripción de prueba'
  };

  beforeEach(async () => {
    // Resetear variables
    navigateCalled = false;
    navigateParams = [];

    await TestBed.configureTestingModule({
      imports: [CrearProductoComponent, FormsModule],
      providers: [
        { provide: Router, useValue: mockRouter }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(CrearProductoComponent);
    component = fixture.componentInstance;
    
    // Limpiar localStorage antes de cada prueba
    localStorage.clear();
    
    fixture.detectChanges();
  });

  // ========== PRUEBAS DE CREACIÓN ==========
  it('should create', () => {
    expect(component).toBeTruthy();
  });

  // ========== PRUEBAS DE INICIALIZACIÓN ==========
  describe('Inicialización', () => {
    it('should initialize with empty form fields', () => {
      expect(component.nombre).toBe('');
      expect(component.categoria).toBe('');
      expect(component.precio).toBe(0);
      expect(component.imagen).toBe('');
      expect(component.descripcion).toBe('');
      expect(component.mensaje()).toBe('');
    });
  });

  // ========== PRUEBAS DE VERIFICACIÓN DE ADMIN ==========
  describe('verificarAdmin', () => {
    it('should not navigate when user is admin', () => {
      const adminUser = { rol: 'admin' };
      localStorage.setItem('usuarioActual', JSON.stringify(adminUser));
      
      component.verificarAdmin();
      
      expect(navigateCalled).toBe(false);
    });

    it('should navigate to perfil when user is not admin', () => {
      const normalUser = { rol: 'user' };
      localStorage.setItem('usuarioActual', JSON.stringify(normalUser));
      
      component.verificarAdmin();
      
      expect(navigateCalled).toBe(true);
      expect(navigateParams).toEqual(['/perfil']);
    });

    it('should navigate to login when no user is logged in', () => {
      localStorage.removeItem('usuarioActual');
      
      component.verificarAdmin();
      
      expect(navigateCalled).toBe(true);
      expect(navigateParams).toEqual(['/login']);
    });

    it('should handle invalid JSON in localStorage', () => {
      localStorage.setItem('usuarioActual', 'invalid-json');
      
      expect(() => component.verificarAdmin()).not.toThrow();
    });
  });

  // ========== PRUEBAS DE OBTENER PRODUCTOS ==========
  describe('obtenerProductos', () => {
    it('should return empty array when no products in localStorage', () => {
      const productos = component.obtenerProductos();
      expect(productos).toEqual([]);
    });

    it('should return products from localStorage', () => {
      const productosMock = [mockProducto];
      localStorage.setItem('productos', JSON.stringify(productosMock));
      
      const productos = component.obtenerProductos();
      expect(productos).toEqual(productosMock);
    });

    it('should handle invalid JSON in localStorage', () => {
      localStorage.setItem('productos', 'invalid-json');
      
      const productos = component.obtenerProductos();
      expect(productos).toEqual([]);
    });
  });

  // ========== PRUEBAS DE GUARDAR PRODUCTOS ==========
  describe('guardarProductos', () => {
    it('should save products to localStorage', () => {
      const productosMock = [mockProducto];
      
      component.guardarProductos(productosMock);
      
      const stored = localStorage.getItem('productos');
      expect(stored).toBe(JSON.stringify(productosMock));
    });

    it('should overwrite existing products in localStorage', () => {
      const productosMock1 = [mockProducto];
      const productosMock2 = [{ 
        ...mockProducto, 
        id: 2, 
        nombre: 'Otro producto' 
      }];
      
      component.guardarProductos(productosMock1);
      component.guardarProductos(productosMock2);
      
      const stored = localStorage.getItem('productos');
      expect(stored).toBe(JSON.stringify(productosMock2));
    });
  });

  // ========== PRUEBAS DE CREAR PRODUCTO ==========
  describe('crearProducto', () => {
    beforeEach(() => {
      // Configurar datos válidos para las pruebas
      component.nombre = mockProducto.nombre;
      component.categoria = mockProducto.categoria;
      component.precio = mockProducto.precio;
      component.imagen = mockProducto.imagen;
      component.descripcion = mockProducto.descripcion;
    });

    it('should create a new product with correct id', () => {
      // Crear primer producto
      component.crearProducto();
      
      let productos = component.obtenerProductos();
      expect(productos.length).toBe(1);
      expect(productos[0].id).toBe(1);
      expect(productos[0].nombre).toBe(component.nombre);
      expect(productos[0].categoria).toBe(component.categoria);
      expect(productos[0].precio).toBe(component.precio);
      expect(productos[0].imagen).toBe(component.imagen);
      expect(productos[0].descripcion).toBe(component.descripcion);

      // Crear segundo producto
      component.nombre = 'Producto 2';
      component.crearProducto();
      
      productos = component.obtenerProductos();
      expect(productos.length).toBe(2);
      expect(productos[1].id).toBe(2);
    });

    it('should show success message after creating product', () => {
      component.crearProducto();
      
      expect(component.mensaje()).toBe('Producto creado exitosamente');
      expect(component.mensajeTipo()).toBe('success');
    });

    it('should clear form after creating product', () => {
      component.crearProducto();
      
      expect(component.nombre).toBe('');
      expect(component.categoria).toBe('');
      expect(component.precio).toBe(0);
      expect(component.imagen).toBe('');
      expect(component.descripcion).toBe('');
    });

    it('should show error when nombre is empty', () => {
      component.nombre = '';
      
      component.crearProducto();
      
      expect(component.mensaje()).toBe('Todos los campos son obligatorios');
      expect(component.mensajeTipo()).toBe('error');
      expect(component.obtenerProductos().length).toBe(0);
    });

    it('should show error when categoria is empty', () => {
      component.categoria = '';
      
      component.crearProducto();
      
      expect(component.mensaje()).toBe('Todos los campos son obligatorios');
      expect(component.mensajeTipo()).toBe('error');
    });

    it('should show error when precio is 0 or negative', () => {
      component.precio = 0;
      
      component.crearProducto();
      
      expect(component.mensaje()).toBe('Todos los campos son obligatorios');
      expect(component.mensajeTipo()).toBe('error');
      
      component.precio = -10;
      component.crearProducto();
      
      expect(component.mensaje()).toBe('Todos los campos son obligatorios');
      expect(component.mensajeTipo()).toBe('error');
    });

    it('should show error when imagen is empty', () => {
      component.imagen = '';
      
      component.crearProducto();
      
      expect(component.mensaje()).toBe('Todos los campos son obligatorios');
      expect(component.mensajeTipo()).toBe('error');
    });

    it('should show error when descripcion is empty', () => {
      component.descripcion = '';
      
      component.crearProducto();
      
      expect(component.mensaje()).toBe('Todos los campos son obligatorios');
      expect(component.mensajeTipo()).toBe('error');
    });

    it('should preserve existing products when creating new one', () => {
      // Crear producto existente
      const productosExistentes = [mockProducto];
      component.guardarProductos(productosExistentes);
      
      // Crear nuevo producto
      component.crearProducto();
      
      const productos = component.obtenerProductos();
      expect(productos.length).toBe(2);
      expect(productos[0]).toEqual(mockProducto);
      expect(productos[1].nombre).toBe(component.nombre);
    });
  });

  // ========== PRUEBAS DE LIMPIAR FORMULARIO ==========
  describe('limpiarFormulario', () => {
    beforeEach(() => {
      // Llenar el formulario con datos
      component.nombre = 'Producto Test';
      component.categoria = 'MYL';
      component.precio = 100;
      component.imagen = 'test.jpg';
      component.descripcion = 'Descripción';
      component.mensaje.set('Mensaje de prueba');
    });

    it('should clear all form fields', () => {
      component.limpiarFormulario();
      
      expect(component.nombre).toBe('');
      expect(component.categoria).toBe('');
      expect(component.precio).toBe(0);
      expect(component.imagen).toBe('');
      expect(component.descripcion).toBe('');
    });

    it('should clear the message', () => {
      component.limpiarFormulario();
      
      expect(component.mensaje()).toBe('');
    });
  });

  // ========== PRUEBAS DE RENDERIZADO ==========
  describe('Renderizado del DOM', () => {
    it('should render the form with all fields', () => {
      const form = fixture.debugElement.query(By.css('form'));
      expect(form).toBeTruthy();
      
      const inputs = fixture.debugElement.queryAll(By.css('input'));
      expect(inputs.length).toBe(3); // nombre, precio, imagen
      
      const select = fixture.debugElement.query(By.css('select'));
      expect(select).toBeTruthy();
      
      const textarea = fixture.debugElement.query(By.css('textarea'));
      expect(textarea).toBeTruthy();
    });

    it('should display success message when product is created', () => {
      component.nombre = mockProducto.nombre;
      component.categoria = mockProducto.categoria;
      component.precio = mockProducto.precio;
      component.imagen = mockProducto.imagen;
      component.descripcion = mockProducto.descripcion;
      
      component.crearProducto();
      fixture.detectChanges();
      
      const messageEl = fixture.debugElement.query(By.css('.alert-success'));
      expect(messageEl).toBeTruthy();
      expect(messageEl.nativeElement.textContent).toContain('Producto creado exitosamente');
    });

    it('should display error message when form is invalid', () => {
      component.nombre = '';
      component.crearProducto();
      fixture.detectChanges();
      
      const messageEl = fixture.debugElement.query(By.css('.alert-danger'));
      expect(messageEl).toBeTruthy();
      expect(messageEl.nativeElement.textContent).toContain('Todos los campos son obligatorios');
    });

    it('should disable submit button when form is invalid', () => {
      const submitButton = fixture.debugElement.query(By.css('button[type="submit"]'));
      expect(submitButton.nativeElement.disabled).toBe(true);
      
      // Llenar el formulario
      component.nombre = mockProducto.nombre;
      component.categoria = mockProducto.categoria;
      component.precio = mockProducto.precio;
      component.imagen = mockProducto.imagen;
      component.descripcion = mockProducto.descripcion;
      fixture.detectChanges();
      
      expect(submitButton.nativeElement.disabled).toBe(false);
    });

    it('should have correct button texts', () => {
      const buttons = fixture.debugElement.queryAll(By.css('button'));
      expect(buttons[0].nativeElement.textContent).toContain('Crear Producto');
      expect(buttons[1].nativeElement.textContent).toContain('Limpiar');
      expect(buttons[2].nativeElement.textContent).toContain('Volver al Perfil');
    });

    it('should render category options', () => {
      const select = fixture.debugElement.query(By.css('select'));
      const options = select.queryAll(By.css('option'));
      
      expect(options.length).toBe(5);
      expect(options[0].nativeElement.textContent).toContain('Selecciona una categoría');
      expect(options[1].nativeElement.textContent).toContain('MYL');
      expect(options[2].nativeElement.textContent).toContain('Pokemon');
      expect(options[3].nativeElement.textContent).toContain('Magic');
      expect(options[4].nativeElement.textContent).toContain('Yugioh');
    });
  });

  // ========== PRUEBAS DE EVENTOS ==========
  describe('Eventos del DOM', () => {
    it('should call crearProducto when form is submitted', () => {
      let called = false;
      const originalMethod = component.crearProducto;
      
      // Sobrescribir el método
      component.crearProducto = () => {
        called = true;
      };
      
      const form = fixture.debugElement.query(By.css('form'));
      form.triggerEventHandler('ngSubmit', null);
      
      expect(called).toBe(true);
      
      // Restaurar método original
      component.crearProducto = originalMethod;
    });

    it('should call limpiarFormulario when limpiar button is clicked', () => {
      let called = false;
      const originalMethod = component.limpiarFormulario;
      
      // Sobrescribir el método
      component.limpiarFormulario = () => {
        called = true;
      };
      
      const limpiarButton = fixture.debugElement.queryAll(By.css('button'))[1];
      limpiarButton.triggerEventHandler('click', null);
      
      expect(called).toBe(true);
      
      // Restaurar método original
      component.limpiarFormulario = originalMethod;
    });

    it('should navigate to perfil when volver button is clicked', () => {
      // Resetear variables
      navigateCalled = false;
      navigateParams = [];
      
      const volverButton = fixture.debugElement.queryAll(By.css('button'))[2];
      volverButton.triggerEventHandler('click', null);
      
      expect(navigateCalled).toBe(true);
      expect(navigateParams).toEqual(['/perfil']);
    });

    it('should update nombre when input changes', () => {
      const input = fixture.debugElement.query(By.css('#nombre'));
      input.nativeElement.value = 'Nuevo Producto';
      input.nativeElement.dispatchEvent(new Event('input'));
      fixture.detectChanges();
      
      expect(component.nombre).toBe('Nuevo Producto');
    });

    it('should update precio when input changes', () => {
      const input = fixture.debugElement.query(By.css('#precio'));
      input.nativeElement.value = '150';
      input.nativeElement.dispatchEvent(new Event('input'));
      fixture.detectChanges();
      
      expect(component.precio).toBe(150);
    });
  });

  // ========== PRUEBAS DE INTEGRACIÓN ==========
  describe('Integración', () => {
    it('should complete full flow: create product -> show success -> clear form', () => {
      // Configurar datos
      component.nombre = 'Producto Integración';
      component.categoria = 'Pokemon';
      component.precio = 200;
      component.imagen = 'assets/images/test.webp';
      component.descripcion = 'Test de integración';
      
      // Crear producto
      component.crearProducto();
      fixture.detectChanges();
      
      // Verificar mensaje de éxito
      expect(component.mensaje()).toBe('Producto creado exitosamente');
      expect(component.mensajeTipo()).toBe('success');
      
      // Verificar que se guardó en localStorage
      const productos = component.obtenerProductos();
      expect(productos.length).toBe(1);
      expect(productos[0].nombre).toBe('Producto Integración');
      
      // Verificar que el formulario se limpió
      expect(component.nombre).toBe('');
      expect(component.precio).toBe(0);
    });

    it('should handle multiple product creations', () => {
      const productos = [
        { nombre: 'Producto 1', categoria: 'MYL', precio: 100 },
        { nombre: 'Producto 2', categoria: 'Pokemon', precio: 200 },
        { nombre: 'Producto 3', categoria: 'Magic', precio: 300 }
      ];
      
      productos.forEach((p, index) => {
        component.nombre = p.nombre;
        component.categoria = p.categoria;
        component.precio = p.precio;
        component.imagen = 'test.webp';
        component.descripcion = 'Descripción';
        component.crearProducto();
        
        const stored = component.obtenerProductos();
        expect(stored.length).toBe(index + 1);
        expect(stored[index].id).toBe(index + 1);
        expect(stored[index].nombre).toBe(p.nombre);
      });
    });
  });
});