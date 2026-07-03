import { Routes } from '@angular/router';

const baseTitle = 'Finca Verde - Panel de Control';

export const routes: Routes = [
  {
    path: 'dashboard',
    loadComponent: () =>
      import('./dashboard/presentation/components/layout/dashboard-layout.component')
        .then(m => m.DashboardLayoutComponent),
    title: `${baseTitle} - Dashboard`
  },
  {
    path: 'properties',
    loadComponent: () =>
      import('./properties/presentation/components/properties-layout/properties-layout.component')
        .then(m => m.PropertiesLayoutComponent),
    title: `${baseTitle} - Propiedades`
  },
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' }
];
