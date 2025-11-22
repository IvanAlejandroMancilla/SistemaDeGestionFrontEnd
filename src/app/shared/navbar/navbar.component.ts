import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { ToolbarModule } from 'primeng/toolbar';

interface MenuItem {
  label: string;
  route: string;
  icon: string;
}

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [
    CommonModule,
    ButtonModule,
    ToolbarModule
  ],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {
  menuItems: MenuItem[] = [
    {
      label: 'Dashboard',
      route: '/dashboard',
      icon: 'pi pi-home'
    },
    {
      label: 'Incidentes',
      route: '/incidentes',
      icon: 'pi pi-exclamation-triangle'
    },
    {
      label: 'Palas Eléctricas',
      route: '/palaselectricas',
      icon: 'pi pi-wrench'
    },
    {
      label: 'Administrador',
      route: '/administrador',
      icon: 'pi pi-cog'
    }
  ];

  constructor(private router: Router) {}

  navigateTo(route: string) {
    this.router.navigate([route]);
  }

  onSearch() {
    console.log('Buscar activado');
  }

  onAlerts() {
    console.log('Ver alertas');
  }

  onLogin() {
    console.log('Iniciar sesión');
  }
}
