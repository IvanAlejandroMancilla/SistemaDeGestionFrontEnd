import { Component, OnInit, OnChanges, SimpleChanges, Input } from '@angular/core';
import { TagModule } from 'primeng/tag';
import { DividerModule } from 'primeng/divider';
import { ImageModule } from 'primeng/image';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from '../../../../../environments/environment';
import { apiIncidentsIncidentByIdIdIncidntGet } from '../../../../api/functions';
import { IncidentDetail } from '../../model/incident-detail.model';


@Component({
  selector: 'app-incident-info-dialog',
  standalone: true,
  imports: [
    TagModule,
    DividerModule,
    ImageModule,
    ButtonModule,
    CommonModule
  ],
  templateUrl: './incident-info-dialog.component.html',
  styleUrl: './incident-info-dialog.component.css'
})

export class IncidentInfoDialogComponent implements OnInit {
  incident: IncidentDetail | null = null;
  loading: boolean = true;
  error: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient
  ) { }
  ngOnInit(): void {

    const id = Number(this.route.snapshot.paramMap.get('id'));
    console.log('ID recibido desde URL:', id);

    if (!id) {
      this.error = true;
      this.loading = false;
      return;
    }

    apiIncidentsIncidentByIdIdIncidntGet(
      this.http,
      environment.urlBack,
      { idINCIDNT: id }
    ).subscribe({

      next: (resp: any) => {
        console.log('Respuesta cruda del backend:', resp);

        try {
          const parsed = JSON.parse(resp.body);
          console.log('JSON parseado:', parsed);

          if (Array.isArray(parsed.data) && parsed.data.length > 0) {
            this.incident = parsed.data[0] as IncidentDetail;
          } else {
            console.error('La estructura no contiene data[0]');
            this.error = true;
          }

        } catch (e) {
          console.error('Error parseando JSON:', e);
          this.error = true;
        }

        this.loading = false;
      },

      error: err => {
        console.error('Error en la petición:', err);
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


  }

// @Input() incidentId?: number;
// data: IncidentData | null = null;
// loading: boolean = false;

// incidentData: IncidentData | null = null;

// constructor(
//   private http: HttpClient,
//   private route: ActivatedRoute,
//   private router: Router
// ) {}

// ngOnInit() {
//   console.log('ngOnInit - incidentId:', this.incidentId);
// }

// ngOnChanges(changes: SimpleChanges) {
//   if (changes['incidentId'] && changes['incidentId'].currentValue) {
//     console.log('ngOnChanges - incidentId:', changes['incidentId'].currentValue);
//     this.loadIncident(changes['incidentId'].currentValue);
//   }
// }

//  loadIncident(idINCIDNT: number) {
//   this.loading = true;
//   const rootUrl = environment.urlBack;

//   apiIncidentsIncidentByIdIdIncidntGet(
//     this.http,
//     rootUrl,
//     { idINCIDNT }
//   ).subscribe({
//     next: (response: any) => {
//       const body = typeof response.body === 'string'
//         ? JSON.parse(response.body)
//         : response.body;

//       this.data = body; // Cambié incidentData por data
//       this.loading = false;
//     },
//     error: (error: any) => {
//       console.error('Error loading incident:', error);
//       this.loading = false;
//     }
//   });
// }

// getSeverity(status: string): 'success' | 'secondary' | 'info' | 'warn' | 'danger' | 'contrast' {
//   if (!status) return 'contrast';

//   switch (status.toLowerCase()) {
//     case 'abierto':
//       return 'warn';
//     case 'aprobado':
//       return 'info';
//     case 'en espera':
//       return 'secondary';
//     case 'finalizado':
//       return 'success';
//     case 'online':
//       return 'success';
//     case 'offline':
//       return 'danger';
//     case 'mantenimiento':
//       return 'warn';
//     default:
//       return 'contrast';
//   }
//
