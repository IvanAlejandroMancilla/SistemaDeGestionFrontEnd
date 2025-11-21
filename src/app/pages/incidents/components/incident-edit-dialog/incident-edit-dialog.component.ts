import { Component, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { DividerModule } from 'primeng/divider';
import { DropdownModule } from 'primeng/dropdown';
import { ImageModule } from 'primeng/image';
import { TagModule } from 'primeng/tag';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';
import { FormsModule } from '@angular/forms';
import { apiIncidentsIncidentByIdIdIncidntGet } from '../../../../api/functions';
import { apiIncidentsUpdateObservationPatch } from '../../../../api/functions';
import { IncidentDetail } from '../../model/incident-detail.model';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../../environments/environment';
import { BaseIcon } from 'primeng/icons/baseicon';
import { CommonModule, NgIf } from '@angular/common';

@Component({
  selector: 'app-incident-edit-dialog',
  standalone: true,
  imports: [
    TagModule,
    DividerModule,
    ImageModule,
    ButtonModule,
    ReactiveFormsModule,
    TagModule,
    DividerModule,
    ImageModule,
    ButtonModule,
    InputTextModule,
    DropdownModule,
    TextareaModule,
    CommonModule,
  ],
  templateUrl: './incident-edit-dialog.component.html',
  styleUrl: './incident-edit-dialog.component.css',
})
export class IncidentEditDialogComponent implements OnInit {
  observation: string = '';
  incident: IncidentDetail | null = null;
  incidentForm!: FormGroup;
  incidentId!: number;
  maxWords = 250;
  helperValue = 'Sin Datos';

  estadosIncidente = [
    { label: 'Abierto', value: 1 },
    { label: 'Aprobado', value: 2 },
    { label: 'En Espera', value: 3 },
    { label: 'Finalizado', value: 4 },
  ];
  estadosOperacionales = [
    { label: 'Online', value: 1 },
    { label: 'Offline', value: 2 },
    { label: 'Mantenimiento', value: 3 },
  ];

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    this.incidentForm = this.fb.group({
      estadoIncidente: [null, Validators.required],
      estadoOperacional: [null, Validators.required],
      observaciones: [
        '',
        [Validators.required, this.maxWordsValidator(this.maxWords)],
      ],
    });

    //Leer id desde la ruta
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.incidentId = id;

    if (!id) {
      console.warn('No se recibió id en la ruta para editar');
      return;
    }

    // Llamar al backend para obtener el incidente
    apiIncidentsIncidentByIdIdIncidntGet(this.http, environment.urlBack, {
      idINCIDNT: id,
    }).subscribe({
      next: (resp: any) => {
        try {
          const parsed = JSON.parse(resp.body);
          console.log('Detalle incidente (edit):', parsed);

          if (Array.isArray(parsed.data) && parsed.data.length > 0) {
            this.incident = parsed.data[0] as IncidentDetail;

            // Rellenado del formulario con los valores actuales
            this.incidentForm.patchValue({
              estadoIncidente: this.incident.statusIncident?.idStatus ?? null,
              estadoOperacional: this.incident.shovel?.status?.idStatus ?? null,
              observaciones: this.incident.observation ?? '',
            });
          } else {
            console.warn('No se encontró data[0] para este incidente');
          }
        } catch (e) {
          console.error('Error parseando JSON de incidente:', e);
        }
      },
      error: (err) => {
        console.error('Error al obtener incidente por id:', err);
      },
    });
  }

  maxWordsValidator(max: number): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value: string = control.value || '';
      const words = value.trim() ? value.trim().split(/\s+/) : [];

      return words.length > max
        ? { maxWords: { actual: words.length, max } }
        : null;
    };
  }

  get currentWordCount(): number {
    const value: string = this.incidentForm?.get('observaciones')?.value || '';
    const words = value.trim() ? value.trim().split(/\s+/) : [];
    return words.length;
  }

  getSeverity(
    status?: string
  ): 'success' | 'secondary' | 'info' | 'warn' | 'danger' | 'contrast' {
    if (!status) return 'contrast';

    const s = status.toLowerCase();

    switch (s) {
      case 'abierto':
        return 'warn';
      case 'aprobado':
      case 'En espera':
      case 'mantenimiento':
        return 'info';
      case 'finalizado':
      case 'online':
        return 'success';
      case 'offline':
        return 'danger';
      default:
        return 'contrast';
    }
  }
  getIcon(status?: string): string {
  if (!status) return 'pi pi-question-circle';

  const s = status.toLowerCase();

  switch (s) {
    case 'abierto':
      return 'pi pi-exclamation-circle';

    case 'aprobado':
      return 'pi pi-check-circle';

    case 'en espera':
      return 'pi pi-clock';

    case 'mantenimiento':
      return 'pi pi-wrench';

    case 'finalizado':
      return 'pi pi-flag';

    case 'online':
      return 'pi pi-check';

    case 'offline':
      return 'pi pi-times-circle';

    default:
      return 'pi pi-info-circle';
  }
}

}
