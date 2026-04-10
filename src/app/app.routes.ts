import { Routes } from '@angular/router';
import {DashboardLayoutComponent} from './dashboard/presentation/components/layout/dashboard-layout.component';

const baseTitle = 'Finca Verde - Panel de Control';

export const routes: Routes = [

  {path: 'dashboard', component: DashboardLayoutComponent, title: `${baseTitle} - Dashboard`},
  {path: '', redirectTo: 'dashboard', pathMatch: 'full'},
];
