import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { MultiSelectModule } from 'primeng/multiselect';
import { Incident } from './model/IncidentList';
import { HttpClient } from '@angular/common/http';
import { apiIncidentsListaIncidentsGet } from '../../api/functions';
import { environment } from '../../../environments/environment';
import { ButtonModule } from 'primeng/button';
import { PaginatorModule } from 'primeng/paginator';
import { apiDashboardDashboardGet } from '../../api/functions';
import { ResumenIncident } from './model/ResumenIncident'
import { ProgressSpinnerModule, ProgressSpinner } from 'primeng/progressspinner';
import { DialogModule } from 'primeng/dialog';


@Component({
  selector: 'app-incidents',
  standalone: true,
  imports: [
    ButtonModule,
    TableModule,
    CommonModule,
    TableModule,
    TagModule,
    IconFieldModule,
    InputIconModule,
    InputTextModule,
    MultiSelectModule,
    SelectModule,
    FormsModule,
    PaginatorModule,
    ProgressSpinner,
    DialogModule
],
  templateUrl: './incidents.component.html',
  styleUrl: './incidents.component.css',
})

export class IncidentsComponent implements OnInit {

  visible: boolean = false;


  //API resumen Incidentes

  resumenIncident!: ResumenIncident; // El ! indica que se inicializará después

  loadDashboardSummary() {
  const rootUrl = environment.urlBack;
  apiDashboardDashboardGet(this.http, rootUrl).subscribe({
    next: (response: any) => {
      const body = typeof response.body === 'string'
        ? JSON.parse(response.body)
        : response.body;
      const statusCounts = body?.JsonResponse?.[0]?.incidents_status_counts;
      if (statusCounts) {
        // Parseo directo del response al objeto
        this.resumenIncident = {
          total: statusCounts.Total,
          abierto: statusCounts.Abierto,
          aprobado: statusCounts.Aprobado,
          cancelado: statusCounts.Cancelado,
          finalizado: statusCounts.Finalizado
        };
        console.log('Dashboard Summary:', this.resumenIncident);
      }
    },
    error: (error) => {
      console.error('Error loading dashboard:', error);
    }
  });
}


  //API Lista Incidentes
  incidents: Incident[] = [];
  loading: boolean = true;

  brands: { name: string; value: string }[] = [];
  shovelStatuses: { name: string; value: string }[] = [];
  incidentStatuses: { name: string; value: string }[] = [];

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.loadIncidents();
    this.loadDashboardSummary();
    console.log(this.loadIncidents);
  }

  loadIncidents() {
  this.loading = true;

  const rootUrl = environment.urlBack;

  apiIncidentsListaIncidentsGet(this.http, rootUrl).subscribe({
    next: (response: any) => {
      console.log('Respuesta cruda de API:', response);

      const body =
        typeof response.body === 'string'
          ? JSON.parse(response.body)
          : response.body;

      console.log('Body parseado:', body);
      this.incidents = body?.data ?? [];

      console.log('Incidents cargados:', this.incidents);

      this.extractFilterOptions();
      this.loading = false;
    },
    error: (error) => {
      console.error('Error loading incidents:', error);
      this.loading = false;
    },
  });
}

  extractFilterOptions() {
    // Extraer marcas únicas
    const uniqueBrands = [
      ...new Set(this.incidents.map((i) => i.shovel.brand)),
    ];
    this.brands = uniqueBrands.map((brand) => ({ name: brand, value: brand }));

    const uniqueShovelStatuses = [
      ...new Set(this.incidents.map((i) => i.shovel.status.name)),
    ];
    this.shovelStatuses = uniqueShovelStatuses.map((status) => ({
      name: status,
      value: status,
    }));

    const uniqueIncidentStatuses = [
      ...new Set(this.incidents.map((i) => i.statusIncident.name)),
    ];
    this.incidentStatuses = uniqueIncidentStatuses.map((status) => ({
      name: status,
      value: status,
    }));
  }
  getSeverity(
    status: string
  ): 'success' | 'secondary' | 'info' | 'warn' | 'danger' | 'contrast' {
    switch (status.toLowerCase()) {
      case 'abierto':
        return 'warn';
      case 'aprobado':
        return 'info';
      case 'en espera':
        return 'secondary';
      case 'finalizado':
        return 'success';
      case 'online':
        return 'success';
      case 'offline':
        return 'danger';
      case 'mantenimiento':
        return 'warn';
      default:
        return 'contrast';
    }
  }
  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleString('es-CL', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  }

  viewIncident(item: any): void {
    console.log('Ver incidente:', item);
    this.visible = true;
  }

  editIncident(incident: any) {
    // Lógica para editar el incidente (ej: abrir formulario de edición)
    console.log('Editar incidente:', incident);
  }

}
