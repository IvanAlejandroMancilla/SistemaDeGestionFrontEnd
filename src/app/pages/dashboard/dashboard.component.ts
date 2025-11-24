import { Component, OnDestroy, OnInit } from '@angular/core';
import { CardModule } from 'primeng/card';
import { ChartModule } from 'primeng/chart';
import { CommonModule } from '@angular/common';
import { apiDashboardDashboardGet } from '../../api/functions';
import { interval, Subscription, switchMap } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { ChartData, ChartOptions } from 'chart.js';
import { environment } from '../../../environments/environment';
import { DashboardResponse, IncidentsStatusCounts, ShovelsStatusCounts } from './model/dashboard-detail.model';




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
}
