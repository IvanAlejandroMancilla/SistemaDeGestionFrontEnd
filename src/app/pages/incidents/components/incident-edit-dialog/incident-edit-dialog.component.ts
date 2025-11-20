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

  estadosOperacionales = [
    { label: 'Online', value: 1 },
    { label: 'Offline', value: 2 },
    { label: 'En Mantenimiento', value: 3 },
  ];

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
