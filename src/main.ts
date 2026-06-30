import { bootstrapApplication } from '@angular/platform-browser';
import { App } from './app/app';
import { provideRouter } from '@angular/router';
import { routes } from './app/app.routes';

function inicializarAdmin() {
  const usuarios = localStorage.getItem('usuarios');
  if (!usuarios) {
    const admin = {
      usuario: 'admin',
      clave: 'admin123',
      nombres: 'Administrador',
      apellidoPaterno: 'Sistema',
      apellidoMaterno: '',
      fechaNacimiento: '1990-01-01',
      edad: 35,
      ciudad: 'Santiago',
      direccion: 'Casa Central',
      rol: 'admin'
    };
    localStorage.setItem('usuarios', JSON.stringify([admin]));
    console.log('Admin inicial creado');
  } else {
    const usuariosArray = JSON.parse(usuarios);
    const adminExiste = usuariosArray.some((u: any) => u.rol === 'admin');
    if (!adminExiste) {
      const admin = {
        usuario: 'admin',
        clave: 'admin123',
        nombres: 'Administrador',
        apellidoPaterno: 'Sistema',
        apellidoMaterno: '',
        fechaNacimiento: '1990-01-01',
        edad: 35,
        ciudad: 'Santiago',
        direccion: 'Casa Central',
        rol: 'admin'
      };
      usuariosArray.push(admin);
      localStorage.setItem('usuarios', JSON.stringify(usuariosArray));
      console.log('Admin agregado a usuarios existentes');
    }
  }
}

inicializarAdmin();

bootstrapApplication(App, {
  providers: [
    provideRouter(routes)
  ]
}).catch(err => console.error(err));