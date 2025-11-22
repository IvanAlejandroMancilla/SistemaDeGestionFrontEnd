import { Component } from '@angular/core';
import { NgIf, NgStyle, NgFor, CommonModule } from '@angular/common';
import { environment } from '../../../environments/environment';
import { apiDashboardDashboardGet, apiShovelsListadepalasGet } from '../../api/functions';
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
    NgFor,
    NgIf,
    CommonModule,
    ProgressSpinnerModule,
    ProgressBarModule,
    ToastModule,
    DataViewModule,
    TagModule,
    PanelModule,
    DialogModule,
    ShovelInfoDialogComponent
  ],
  templateUrl: './shovels.component.html',
  styleUrl: './shovels.component.css',
})
export class ShovelsComponent {

  constructor(private http: HttpClient) {}

  resumenShovels: any = null;
  porcentaje: number =10;

  shovelsList: any[] = [];
  loading: boolean = false;

  estadosOperacionales = [
    { label: 'Online', value: 1 },
    { label: 'Mantenimiento', value: 2 },
    { label: 'Offline', value: 3 }
  ];


  /* eLEMNTOS DEL PDIAGLO */
  showDialog: boolean = false;
  selectedShovelId?: number;


  estado: string = 'operativa'; // 'operativa', 'offline', 'mantenimiento'

  // CICLO DE VIDA
  ngOnInit(): void {
    this.loadDashboardSummary();
    this.loadShovels();
  }

  // MÓDULO: DASHBOARD
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
          this.porcentaje = this.getStatusPercent(this.resumenShovels);

          console.log('Resumen Shovels:', this.resumenShovels);
        }
      },
      error: (err) => {
        console.error('Error loading dashboard:', err);
      },
    });
  }
  getStatusPercent(resumen: any): number {
  if (!resumen || resumen.total === 0) return 0;

  const online = resumen.online || 0;
  const mantenimiento = resumen.mantenimiento || 0;
  const total = resumen.total || 0;

  const porcentaje = ((online + mantenimiento) / total) * 100;

  return Math.round(porcentaje);
}


  //  LISTA DE PALAS

  loadShovels() {
    this.loading = true;

    this.fetchShovels().subscribe({
      next: (resp) => {
        const json = this.parseResponse(resp);
        this.shovelsList = this.mapShovels(json.data || []);
        this.loading = false;
      },
      error: (err) => {
        console.error(err);
        this.loading = false;
      }
    });
  }

  private fetchShovels() {
    return apiShovelsListadepalasGet(this.http, environment.urlBack);
  }

  private parseResponse(resp: any) {
    return JSON.parse(resp.body);
  }

  private mapShovels(data: any[]) {
    const result = data.map(item => ({
      idShovel: item.idShovel,
      serialNumber: item.serialNumber,
      model: item.model,
      brand: item.brand,
      dateTime: item.dateTime,
      status: {
        id: item.status,
        name: this.getStatusName(item.status)
      }
    }));

    console.log('Shovels formateadas:', result);
    return result;
  }

  // GETTERS
  private getStatusName(value: number): string {
    const estado = this.estadosOperacionales.find(e => e.value === value);
    return estado ? estado.label : 'Desconocido';
  }

  getSeverity(status: string) {
    switch (status.toLowerCase()) {
      case 'abierto': return 'warn';
      case 'aprobado': return 'info';
      case 'en espera': return 'secondary';
      case 'finalizado': return 'success';

      case 'online': return 'success';
      case 'offline': return 'danger';
      case 'mantenimiento': return 'warn';

      default: return 'contrast';
    }
  }

  getStatusText(): string {
    if (this.porcentaje >= 70) return 'ACEPTABLE';
    if (this.porcentaje >= 40) return 'RIESGO';
    return 'GRAVE';
  }

  getEstadoSeverity(estado: string): string {
    switch (estado) {
      case 'operativa': return 'success';
      case 'offline': return 'danger';
      case 'mantenimiento': return 'warn';
      default: return 'info';
    }
  }


  /* elementos del pDIALOG */
openShovelDialog(id: number) {
  this.selectedShovelId = id;
  this.showDialog = true;
}
}
