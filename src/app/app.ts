import { Component, signal } from '@angular/core';
import { RouterOutlet, Router } from '@angular/router';
import { HeaderComponent } from './pages/header/header.component';
import { CarruselComponent } from './pages/carrusel/carrusel.component';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    HeaderComponent,
    CarruselComponent,
    NgIf,
  ],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('barajabien');

  constructor(public router: Router) {}

  showMenuAndCarrusel(): boolean {
    const hiddenRoutes = ['/registro', '/login', '/perfil']; 
    return !hiddenRoutes.includes(this.router.url);
  }
}