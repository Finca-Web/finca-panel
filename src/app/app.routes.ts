import { Routes } from '@angular/router';
import { DashboardLayoutComponent } from './dashboard/presentation/components/layout/dashboard-layout.component';
import { PropertiesLayoutComponent } from './properties/presentation/components/properties-layout/properties-layout.component';

const baseTitle = 'Finca Verde - Panel de Control';

export const routes: Routes = [
  {
    path: 'dashboard',
    component: DashboardLayoutComponent,
    title: `${baseTitle} - Dashboard`,
    data: { animation: 'DashboardPage' }
  },
  {
    path: 'properties',
    component: PropertiesLayoutComponent,
    title: `${baseTitle} - Propiedades`,
    data: { animation: 'PropertiesPage' }
  },
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' }
];
