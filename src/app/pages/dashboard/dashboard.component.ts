import { Component, OnDestroy, OnInit } from '@angular/core';
import { CardModule } from 'primeng/card';
import { ChartModule } from 'primeng/chart';
import { CommonModule } from '@angular/common';
import { apiDashboardDashboardGet } from '../../api/functions';
import { interval, Subscription, switchMap } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { ChartData, ChartOptions } from 'chart.js';
import { environment } from '../../../environments/environment';
import {
  DashboardResponse, IncidentsStatusCounts, ShovelsStatusCounts, IncidentsByMonth,
  DashboardJsonResponseItem, ShovelsByBrand, MarcaResumen
} from './model/dashboard-detail.model';
import { TooltipModule } from 'primeng/tooltip';




apiDashboardDashboardGet
@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, CardModule, ChartModule, CardModule, CommonModule, TooltipModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})


export class DashboardComponent implements OnInit {

  resumenIncident!: IncidentsStatusCounts;
  resumenShovels!: ShovelsStatusCounts;
  resumenMarcas: MarcaResumen[] = [];
  constructor(private http: HttpClient) { }

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
        this.buildShovelBrandChart(data.shovels_by_brand);
        this.resumenMarcas = this.mapearMarcas(data.shovels_by_brand);

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

  shovelBrandData: ChartData<'bar'> = {
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
          fill: false, tension: 0.4
        },
        {
          label: 'Aprobado',
          borderColor: '#42a5f5',
          backgroundColor: '#42a5f5',
          data: aprobados,
          fill: false, tension: 0.4
        },
        {
          label: 'Cancelado',
          borderColor: '#e57373',
          backgroundColor: '#e57373',
          data: cancelados,
          fill: false, tension: 0.4
        },
        {
          label: 'Finalizado',
          borderColor: '#66bb6a',
          backgroundColor: '#66bb6a',
          data: finalizados,
          fill: false, tension: 0.4
        }
      ]
    };
  }


  private buildShovelBrandChart(data: ShovelsByBrand[]) {

    // 1) Sacamos las marcas únicas
    const labels = [...new Set(data.map(x => x.brand))];

    // 2) Para cada marca, buscamos los totales por status
    const online = labels.map(m =>
      data.find(d => d.brand === m && d.statusName === 'Online')?.total || 0
    );

    const mantenimiento = labels.map(m =>
      data.find(d => d.brand === m && d.statusName === 'Mantenimiento')?.total || 0
    );

    const offline = labels.map(m =>
      data.find(d => d.brand === m && d.statusName === 'Offline')?.total || 0
    );

    // 3) Creamos ChartData EXACTO como tu template lo requiere
    this.shovelBrandData = {
      labels,
      datasets: [
        {
          label: 'Online',
          backgroundColor: '#66bb6a',
          data: online
        },
        {
          label: 'Mantenimiento',
          backgroundColor: '#fbc02d',
          data: mantenimiento
        },
        {
          label: 'Offline',
          backgroundColor: '#e57373',
          data: offline
        }
      ]
    };
  }

  getBrandTotal(index: number): number {
    if (!this.shovelBrandData || !this.shovelBrandData.datasets) return 0;

    return this.shovelBrandData.datasets
      .map(ds => Number(ds.data[index]) || 0)
      .reduce((a, b) => a + b, 0);
  }

  getDatasetValue(dsIndex: number, brandIndex: number): number {
    if (!this.shovelBrandData?.datasets?.[dsIndex]) return 0;
    return Number(this.shovelBrandData.datasets[dsIndex].data[brandIndex]) || 0;
  }

  // ===== MAPEO POR MARCA =====


  private mapearMarcas(data: ShovelsByBrand[]): MarcaResumen[] {
  return Object.values(
    data.reduce((acc: Record<string, MarcaResumen>, curr: ShovelsByBrand) => {
      const brand = curr.brand;

      if (!acc[brand]) {
        acc[brand] = {
          name: brand,
          online: 0,
          mantenimiento: 0,
          offline: 0,
          total: 0
        };
      }

      switch (curr.statusName) {
        case 'Online':
          acc[brand].online = curr.total;
          break;
        case 'Mantenimiento':
          acc[brand].mantenimiento = curr.total;
          break;
        case 'Offline':
          acc[brand].offline = curr.total;
          break;
      }

      acc[brand].total =
        acc[brand].online +
        acc[brand].mantenimiento +
        acc[brand].offline;

      return acc;

    }, {} as Record<string, MarcaResumen>)
  );
}

}



