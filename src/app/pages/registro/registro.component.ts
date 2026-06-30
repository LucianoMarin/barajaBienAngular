import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Usuario } from '../../models/usuario.model';

@Component({
  selector: 'app-registro',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './registro.component.html',
  styleUrls: ['./registro.component.css']
})
export class RegistroComponent {

  usuario = '';
  clave = '';
  clave2 = '';
  nombres = '';
  apellidoPaterno = '';
  apellidoMaterno = '';
  fechaNacimiento = '';
  ciudad = '';
  direccion = '';

  mensaje = signal('');
  mensajeTipo = signal<'success' | 'error'>('success');
  edad = signal(0);

  calcularEdad() {
    if (this.fechaNacimiento) {
      const hoy = new Date();
      const nacimiento = new Date(this.fechaNacimiento);
      let edad = hoy.getFullYear() - nacimiento.getFullYear();
      const mes = hoy.getMonth() - nacimiento.getMonth();
      
      if (mes < 0 || (mes === 0 && hoy.getDate() < nacimiento.getDate())) {
        edad--;
      }
      
      this.edad.set(edad);
    }
  }

  obtenerUsuarios(): Usuario[] {
    const usuarios = localStorage.getItem('usuarios');
    return usuarios ? JSON.parse(usuarios) : [];
  }

  guardarUsuarios(usuarios: Usuario[]) {
    localStorage.setItem('usuarios', JSON.stringify(usuarios));
  }

  registrar() {

    if (this.clave !== this.clave2) {
      this.mensaje.set('Las claves no coinciden');
      this.mensajeTipo.set('error');
      return;
    }

    if (!this.usuario || !this.clave || !this.nombres || 
        !this.apellidoPaterno || !this.ciudad || !this.direccion) {
      this.mensaje.set('Todos los campos son obligatorios');
      this.mensajeTipo.set('error');
      return;
    }

    if (this.edad() < 18) {
      this.mensaje.set('Debes ser mayor de 18 años para registrarte');
      this.mensajeTipo.set('error');
      return;
    }

    const usuarios = this.obtenerUsuarios();
    
    const usuarioExistente = usuarios.find((u: Usuario) => u.usuario === this.usuario);
    
    if (usuarioExistente) {
      this.mensaje.set('El usuario ya existe');
      this.mensajeTipo.set('error');
      return;
    }

    const nuevoUsuario: Usuario = {
      id: usuarios.length + 1,
      usuario: this.usuario,
      clave: this.clave,
      nombres: this.nombres,
      apellidoPaterno: this.apellidoPaterno,
      apellidoMaterno: this.apellidoMaterno,
      fechaNacimiento: this.fechaNacimiento,
      edad: this.edad(),
      ciudad: this.ciudad,
      direccion: this.direccion,
      rol: 'usuario'
    };

    usuarios.push(nuevoUsuario);
    this.guardarUsuarios(usuarios);
    
    this.mensaje.set('Registro exitoso');
    this.mensajeTipo.set('success');
    
    this.limpiarFormulario();
  }

  limpiarFormulario() {
    this.usuario = '';
    this.clave = '';
    this.clave2 = '';
    this.nombres = '';
    this.apellidoPaterno = '';
    this.apellidoMaterno = '';
    this.fechaNacimiento = '';
    this.ciudad = '';
    this.direccion = '';
    this.edad.set(0);
  }
}