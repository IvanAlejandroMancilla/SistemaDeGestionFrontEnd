import { Routes } from '@angular/router';
import { IncidentsComponent } from './incidents.component';
import { IncidentInfoDialogComponent } from './components/incident-info-dialog/incident-info-dialog.component';
import { IncidentEditDialogComponent } from './components/incident-edit-dialog/incident-edit-dialog.component';

export const incidentsRoutes: Routes = [
  {
    path: '',
    component: IncidentsComponent,
    children: [
      { path: ':id', component: IncidentInfoDialogComponent },
      { path: ':id/edit', component: IncidentEditDialogComponent }
    ]
  }
];
