import { Component, OnInit, OnChanges, SimpleChanges, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../../environments/environment';
import { apiIncidentsIncidentByShovelIdShovelGet } from '../../../../api/functions';

@Component({
  selector: 'app-shovel-info-dialog',
  standalone: true,
  imports: [
    CommonModule
  ],
  templateUrl: './shovel-info-dialog.component.html',
  styleUrl: './shovel-info-dialog.component.css'
})
export class ShovelInfoDialogComponent implements OnInit, OnChanges {

  @Input() shovelId?: number;

  incidents: any[] = [];
  loading: boolean = false;
  error: boolean = false;
  rawResponse: any = null;

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    if (this.shovelId) {
      this.loadIncidents(this.shovelId);

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

      },

      error: () => {
        this.error = true;
        this.loading = false;
      }
    });
  }
}
