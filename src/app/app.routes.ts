import { Routes } from '@angular/router';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { IncidentsComponent } from './pages/incidents/incidents.component';
import { ShovelsComponent } from './pages/shovels/shovels.component';
import { ConfigurationComponent } from './pages/configuration/configuration.component';
import { IncidentInfoDialogComponent } from './pages/incidents/components/incident-info-dialog/incident-info-dialog.component';


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
    component: IncidentsComponent
  },
  {
    path: 'palaselectricas',
    component: ShovelsComponent
  },
  {
    path: 'administrador',
    component: ConfigurationComponent
  },

  {
    path: 'detalle',
    component: IncidentInfoDialogComponent
  }
  // {
  //   path: 'usuarios',
  //   component: UsuariosComponent
  // }
];



/*import { Routes } from '@angular/router';

export const routes: Routes = [];
*/
