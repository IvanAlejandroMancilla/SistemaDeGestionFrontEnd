import { Routes } from '@angular/router';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { IncidentsComponent } from './pages/incidents/incidents.component';
import { ShovelsComponent } from './pages/shovels/shovels.component';
import { ConfigurationComponent } from './pages/configuration/configuration.component';


export const routes: Routes = [
  {
    path: '',
    redirectTo: '/',
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
  },  {
    path: 'administrador',
    component: ConfigurationComponent
  },
  // {
  //   path: 'usuarios',
  //   component: UsuariosComponent
  // }
];



/*import { Routes } from '@angular/router';

export const routes: Routes = [];
*/
