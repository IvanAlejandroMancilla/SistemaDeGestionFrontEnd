import { Component } from '@angular/core';
import { NgIf } from '@angular/common';
import { environment } from '../../../environments/environment';
import { apiDashboardDashboardGet } from '../../api/functions';
import { HttpClient } from '@angular/common/http';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { ProgressBarModule } from 'primeng/progressbar';
import { ToastModule } from 'primeng/toast';
import { TagModule } from 'primeng/tag';

@Component({
  selector: 'app-shovels',
  standalone: true,
  imports: [NgIf, ProgressSpinnerModule, ProgressBarModule, ToastModule,TagModule],
  templateUrl: './shovels.component.html',
  styleUrl: './shovels.component.css'
})
export class ShovelsComponent {

  resumenShovels: any = null;

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.loadDashboardSummary();
  }

  loadDashboardSummary() {
    const rootUrl = environment.urlBack;

    apiDashboardDashboardGet(this.http, rootUrl).subscribe({
      next: (response: any) => {

        const body = typeof response.body === 'string'
          ? JSON.parse(response.body)
          : response.body;

        console.log("Respuesta dashboard:", body);

        const shovelsCounts = body?.JsonResponse?.[0]?.shovels_status_counts;

        if (shovelsCounts) {
          this.resumenShovels = {
            total: shovelsCounts.Total,
            online: shovelsCounts.Online,
            mantenimiento: shovelsCounts.Mantenimiento,
            offline: shovelsCounts.Offline
          };

          console.log("Resumen Shovels:", this.resumenShovels);
        }
      },
      error: err => {
        console.error("Error loading dashboard:", err);
      }
    });
  }

 porcentaje: number = 10;

getSeverity(): 'success' | 'warn' | 'danger' {
  if (this.porcentaje >= 70) return 'success';
  if (this.porcentaje >= 40) return 'warn';
  return 'danger';
}

  getStatusText(): string {
    if (this.porcentaje >= 70) return 'ACEPTABLE';
    if (this.porcentaje >= 40) return 'RIESGO';
    return 'GRAVE';
  }

}
