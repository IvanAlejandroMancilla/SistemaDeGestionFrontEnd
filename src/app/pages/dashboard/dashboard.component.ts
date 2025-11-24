import { Component, OnDestroy, OnInit } from '@angular/core';
import { CardModule } from 'primeng/card';
import { ChartModule } from 'primeng/chart';
import { CommonModule } from '@angular/common';
import { apiDashboardDashboardGet } from '../../api/functions';
import { interval, Subscription, switchMap } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { ChartData, ChartOptions } from 'chart.js';
import { environment } from '../../../environments/environment';




apiDashboardDashboardGet
@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, CardModule, ChartModule, CardModule, CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})


export class DashboardComponent implements OnInit {

  // Resumen de incidentes (igual que en el componente de incidentes)
  resumenIncident!: {
    total: number;
    abierto: number;
    aprobado: number;
    cancelado: number;
    finalizado: number;
  };

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.loadDashboardSummary();
  }


  loadDashboardSummary() {
    const rootUrl = environment.urlBack;

    apiDashboardDashboardGet(this.http, rootUrl).subscribe({
      next: (response: any) => {

        // Esto asegura compatibilidad con tu backend
        const body = typeof response.body === 'string'
          ? JSON.parse(response.body)
          : response.body;

        const statusCounts = body?.JsonResponse?.[0]?.incidents_status_counts;

        if (statusCounts) {
          this.resumenIncident = {
            total: statusCounts.Total,
            abierto: statusCounts.Abierto,
            aprobado: statusCounts.Aprobado,
            cancelado: statusCounts.Cancelado,
            finalizado: statusCounts.Finalizado
          };
          console.log('Dashboard desde burno Summary:', this.resumenIncident);
        }
      },
      error: (error) => {
        console.error('Error loading dashboard:', error);
      }
    });
  };



}
