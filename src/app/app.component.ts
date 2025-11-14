// src/app/app.component.ts
import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { HttpClient } from '@angular/common/http';
import { apiDashboardDashboardGet } from './api/fn/dashboard/api-dashboard-dashboard-get';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, ButtonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  title = 'SistemaDeGestionFrontEnd';

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    // 🔹 Esto es solo para probar que Angular está corriendo
    console.log('AppComponent inicializado ✅');

    const rootUrl = 'https://localhost:7232';

    apiDashboardDashboardGet(this.http, rootUrl).subscribe({
      next: (response) => {
        console.log('Dashboard OK:', response);
        console.log('Status:', response.status);
      },
      error: (err) => {
        console.error('Error llamando /api/Dashboard/Dashboard:', err);
      }
    });
  }
}
