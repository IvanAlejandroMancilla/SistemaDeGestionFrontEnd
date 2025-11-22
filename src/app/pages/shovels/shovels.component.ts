import { Component } from '@angular/core';
import { NgIf, NgStyle,NgFor, CommonModule } from '@angular/common';
import { environment } from '../../../environments/environment';
import { apiDashboardDashboardGet } from '../../api/functions';
import { HttpClient } from '@angular/common/http';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { ProgressBarModule } from 'primeng/progressbar';
import { ToastModule } from 'primeng/toast';
import { TagModule } from 'primeng/tag';
import { ButtonModule } from 'primeng/button';
import { PanelModule } from 'primeng/panel';
import { DataViewModule } from 'primeng/dataview';
import { DialogModule } from 'primeng/dialog';
import { ShovelInfoDialogComponent } from './components/shovel-info-dialog/shovel-info-dialog.component';


@Component({
  selector: 'app-shovels',
  standalone: true,
  imports: [
    ButtonModule,
    NgIf,CommonModule,
    ProgressSpinnerModule,
    ProgressBarModule,
    ToastModule,
    DataViewModule,
    TagModule,
    PanelModule,DialogModule,ShovelInfoDialogComponent
  ],
  templateUrl: './shovels.component.html',
  styleUrl: './shovels.component.css',
})
export class ShovelsComponent {
  resumenShovels: any = null;
  showDialog: boolean = false;
  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.loadDashboardSummary();
  }

  loadDashboardSummary() {
    const rootUrl = environment.urlBack;

    apiDashboardDashboardGet(this.http, rootUrl).subscribe({
      next: (response: any) => {
        const body =
          typeof response.body === 'string'
            ? JSON.parse(response.body)
            : response.body;

        console.log('Respuesta dashboard:', body);

        const shovelsCounts = body?.JsonResponse?.[0]?.shovels_status_counts;

        if (shovelsCounts) {
          this.resumenShovels = {
            total: shovelsCounts.Total,
            online: shovelsCounts.Online,
            mantenimiento: shovelsCounts.Mantenimiento,
            offline: shovelsCounts.Offline,
          };

          console.log('Resumen Shovels:', this.resumenShovels);
        }
      },
      error: (err) => {
        console.error('Error loading dashboard:', err);
      },
    });
  }

  porcentaje: number = 90;

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

  estado: string = 'operativa'; // 'operativa', 'offline', 'mantenimiento'

getEstadoSeverity(estado: string): string {
  switch(estado) {
    case 'operativa':
      return 'success';
    case 'offline':
      return 'danger';
    case 'mantenimiento':
      return 'warn';
    default:
      return 'info';
  }
}
}
