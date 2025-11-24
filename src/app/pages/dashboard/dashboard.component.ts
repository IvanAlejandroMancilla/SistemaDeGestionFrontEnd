import { Component, OnDestroy, OnInit } from '@angular/core';
import { CardModule } from 'primeng/card';
import { ChartModule } from 'primeng/chart';
import { CommonModule } from '@angular/common';
import { apiDashboardDashboardGet } from '../../api/functions';
import { interval, Subscription, switchMap } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { ChartData, ChartOptions } from 'chart.js';
import { environment } from '../../../environments/environment';
import { DashboardResponse, IncidentsStatusCounts, ShovelsStatusCounts,IncidentsByMonth,
  DashboardJsonResponseItem,ShovelsByBrand} from './model/dashboard-detail.model';




apiDashboardDashboardGet
@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, CardModule, ChartModule, CardModule, CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})


export class DashboardComponent implements OnInit {

  resumenIncident!: IncidentsStatusCounts;
  resumenShovels!: ShovelsStatusCounts;

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.loadDashboardSummary();
  }


 loadDashboardSummary() {
    const rootUrl = environment.urlBack;

    apiDashboardDashboardGet(this.http, rootUrl).subscribe({
      next: (response: any) => {

        const body: DashboardResponse =
          typeof response.body === 'string'
            ? JSON.parse(response.body)
            : response.body;

        const data = body.JsonResponse[0];
        this.buildIncidentTrendChart(data.incidents_by_month);

        // INCIDENTES
        this.resumenIncident = {
          ...data.incidents_status_counts
        };

        // PALAS
        this.resumenShovels = {
          ...data.shovels_status_counts
        };

        console.log('Incidentes:', this.resumenIncident);
        console.log('Shovels:', this.resumenShovels);
      },

      error: (error) => {
        console.error('Error loading dashboard:', error);
      }
    });
  }

// graficos

incidentTrendData: ChartData<'line'> = {
  labels: [],
  datasets: []
};

// chartOptions: ChartOptions = {
//   responsive: true,
//   plugins: {
//     legend: { position: 'top' },
//     tooltip: {
//       enabled: true,
//       mode: 'index',
//       callbacks: {
//         title: (ctx: any) => ctx[0].label,
//         label: (ctx: any) => `${ctx.dataset.label}: ${ctx.parsed.y}`
//       }
//     }
//   }
// };

chartOptions: ChartOptions = {
  responsive: true,

  plugins: {
    legend: { position: 'top' },
    tooltip: {
      enabled: true,
      mode: 'index',
      callbacks: {
        title: (ctx: any) => ctx[0].label,
        label: (ctx: any) => `${ctx.dataset.label}: ${ctx.parsed.y}`
      }
    }
  },

  scales: {
    y: {
      beginAtZero: true,
      grace: '25%',
    },

    x: {
      offset: true
    }
  },
  animation: {
    duration: 1200,
    easing: 'easeInOutCubic'
  },

  hover: {
    mode: 'nearest',
    intersect: true
  }
};




private buildIncidentTrendChart(data: IncidentsByMonth[]) {

  const labels = [...new Set(data.map(x => x.mes_anio))];

  const abiertos = labels.map(m =>
    data.find(d => d.mes_anio === m && d.status === 'Abierto')?.total || 0
  );

  const aprobados = labels.map(m =>
    data.find(d => d.mes_anio === m && d.status === 'Aprobado')?.total || 0
  );

  const cancelados = labels.map(m =>
    data.find(d => d.mes_anio === m && d.status === 'Cancelado')?.total || 0
  );

  const finalizados = labels.map(m =>
    data.find(d => d.mes_anio === m && d.status === 'Finalizado')?.total || 0
  );

  this.incidentTrendData = {
    labels,
    datasets: [
      {
        label: 'Abierto',
        borderColor: '#fbc02d',
        backgroundColor: '#fbc02d',
        data: abiertos,
        fill: false,tension: 0.4
      },
      {
        label: 'Aprobado',
        borderColor: '#42a5f5',
        backgroundColor: '#42a5f5',
        data: aprobados,
        fill: false,tension: 0.4
      },
      {
        label: 'Cancelado',
        borderColor: '#e57373',
        backgroundColor: '#e57373',
        data: cancelados,
        fill: false,tension: 0.4
      },
      {
        label: 'Finalizado',
        borderColor: '#66bb6a',
        backgroundColor: '#66bb6a',
        data: finalizados,
        fill: false,tension: 0.4
      }
    ]
  };
}


}
