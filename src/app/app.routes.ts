import { Routes } from '@angular/router';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { ShovelsComponent } from './pages/shovels/shovels.component';
import { ConfigurationComponent } from './pages/configuration/configuration.component';

import { IncidentsComponent } from './pages/incidents/incidents.component';
import { IncidentInfoDialogComponent } from './pages/incidents/components/incident-info-dialog/incident-info-dialog.component';
import { IncidentEditDialogComponent } from './pages/incidents/components/incident-edit-dialog/incident-edit-dialog.component';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/dashboard',
    pathMatch: 'full'
  },
  {
    path: 'dashboard',
    component: DashboardComponent
  },
  {
    path: 'incidentes',
    children: [
      {
        path: '',
        component: IncidentsComponent
      },
      {
        path: 'detalle',
        component: IncidentInfoDialogComponent
      },
      { path: 'detalle/:id', component: IncidentInfoDialogComponent },
      {
        path: 'editar',
        component: IncidentEditDialogComponent
      }
    ]
  },

  {
    path: 'palaselectricas',
    component: ShovelsComponent
  },
  {
    path: 'administrador',
    component: ConfigurationComponent
  }
];
