import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
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
  ],
  templateUrl: './incident-edit-dialog.component.html',
  styleUrl: './incident-edit-dialog.component.css'
})


export class IncidentEditDialogComponent implements OnInit {

  observation: string= "";
  incidentForm!: FormGroup;
  constructor(private fb: FormBuilder) {}

  estadosIncidente=[
		{label:"Abierto",value: 1},
    {label:"Aprobado",value: 2},
    {label:"En Espera",value: 3},
		{label:"Finalizado",value: 4},
	];
  estadosOperacionales = [
    { label: 'Online', value: 1 },
    { label: 'Offline', value: 2 },
    { label: 'En Mantenimiento', value: 3 },
  ];



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

  ngOnInit(): void {
    this.incidentForm = this.fb.group({
      estadoOperacional: ['', Validators.required],
      observaciones: ['', [Validators.required, Validators.maxLength(500)]]
    });

    // Cargar datos existentes
    this.incidentForm.patchValue({
      estadoOperacional: 'Online',
      observaciones: 'Sistema de enfriamiento requiere revisión inmediata'
    });
  }
}
