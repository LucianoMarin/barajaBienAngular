import { Routes } from '@angular/router';
import { InicioComponent } from './pages/inicio/inicio.component';
import { EventoComponent } from './pages/evento/evento.component';
import { ProductoComponent } from './pages/producto/producto.component';
import { RegistroComponent } from './pages/registro/registro.component';
import { LoginComponent } from './pages/login/login.component';
import { PerfilComponent } from './pages/perfil/perfil.component';
import { CrearProductoComponent } from './pages/crear-producto/crear-producto.component';

export const routes: Routes = [
  { path: '', component: InicioComponent },
  { path: 'evento', component: EventoComponent },
  { path: 'producto', component: ProductoComponent },
  { path: 'registro', component: RegistroComponent },
  { path: 'login', component: LoginComponent },
  { path: 'perfil', component: PerfilComponent },
  { path: 'crear-producto', component: CrearProductoComponent }
];