import { Component, OnInit, OnChanges, SimpleChanges, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../../environments/environment';
import { apiIncidentsIncidentByShovelIdShovelGet } from '../../../../api/functions';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { DividerModule } from 'primeng/divider';
import { TabsModule } from 'primeng/tabs';
import { TableModule } from 'primeng/table';
import { TabViewModule } from 'primeng/tabview';
import { CardModule } from 'primeng/card';



@Component({
  selector: 'app-shovel-info-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ButtonModule,
    TagModule,
    TabsModule,
    TableModule,
    CardModule,
    TabsModule,
    DividerModule,
  ],
  templateUrl: './shovel-info-dialog.component.html',
  styleUrl: './shovel-info-dialog.component.css'
})
export class ShovelInfoDialogComponent implements OnInit, OnChanges {

  @Input() shovelId?: number;

  test: any = 1;
  incidents: any[] = [];
  loading: boolean = false;
  error: boolean = false;
  rawResponse: any = null;

    constructor(private http: HttpClient) { }

  ngOnInit(): void {
    if (this.shovelId) {
      this.loadIncidents(this.shovelId);
      // grafico
      //this.generateChart();

    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['shovelId'] && this.shovelId) {
      this.loadIncidents(this.shovelId);
    }
  }

  loadIncidents(idShovel: number): void {
    this.loading = true;
    this.error = false;
    this.incidents = [];
    this.rawResponse = null;
    //kpis


    apiIncidentsIncidentByShovelIdShovelGet(
      this.http,
      environment.urlBack,
      { idShovel }
    ).subscribe({
      next: (resp: any) => {


        const body = typeof resp.body === 'string'
          ? JSON.parse(resp.body)
          : resp.body;

        this.rawResponse = body;

        if (body?.data?.length > 0) {
          this.incidents = body.data;
        } else {
          this.error = true;
        }

        console.log("INCIDENTES:", this.incidents);

        this.loading = false;
        //kpis
        this.calculateIncidentStats();
      },

      error: () => {
        this.error = true;
        this.loading = false;
      }
    });
  }

  getSeverity(status?: string):
    'success' | 'secondary' | 'info' | 'warn' | 'danger' | 'contrast' {

    if (!status) return 'contrast';

    const s = status.toLowerCase();

    switch (s) {
      case 'abierto':
        return 'warn';
      case 'aprobado':
        return 'info';
      case 'en espera':
      case 'mantenimiento':
        return 'secondary';
      case 'finalizado':
      case 'online':
        return 'success';
      case 'offline':
        return 'danger';
      default:
        return 'contrast';
    }
  }


  //* kpis */

  incidentStats = {
    total: 0,
    abiertos: 0,
    finalizados: 0,
    espera: 0,
    aprobados: 0
  };

  private calculateIncidentStats() {
    const list = this.incidents || [];

    this.incidentStats.abiertos = list.filter(x =>
      x.statusIncident?.name?.toLowerCase() === 'abierto'
    ).length;

    this.incidentStats.finalizados = list.filter(x =>
      x.statusIncident?.name?.toLowerCase() === 'finalizado'
    ).length;

    this.incidentStats.espera = list.filter(x =>
      x.statusIncident?.name?.toLowerCase().includes('espera')
    ).length;

    this.incidentStats.aprobados = list.filter(x =>
      x.statusIncident?.name?.toLowerCase() === 'aprobado'
    ).length;
    this.incidentStats.total = this.incidentStats.abiertos + this.incidentStats.finalizados + this.incidentStats.espera + this.incidentStats.aprobados;
  }

 /* data: any;
  options: any;

  //grafico
  generateChart() {
  this.data = {
    labels: ['Total', 'En Espera', 'Abiertos', 'Aprobados', 'Finalizados'],
    datasets: [
      {
        label: 'Incidentes',
        data: [
          this.incidentStats.total,
          this.incidentStats.espera,
          this.incidentStats.abiertos,
          this.incidentStats.aprobados,
          this.incidentStats.finalizados
        ],
        fill: false,
        borderColor: '#3B82F6',
        tension: 0.3
      }
    ]
  };

  this.options = {
    responsive: true,
    maintainAspectRatio: false
  };
}*/


}
