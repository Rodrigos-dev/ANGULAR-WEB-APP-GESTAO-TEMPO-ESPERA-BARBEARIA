import { Route } from '@angular/router';

import { authGuard } from '../../core/guards/auth/auth.guard';

export const SUBSCRIPTION_ROUTES: Route[] = [
  {
    path: '',
    redirectTo: 'admin',
    pathMatch: 'full',
  },
  {
    path: '',
    title: 'Assinatura',
    loadComponent: () => import('./pages/subscription/subscription.page').then(m => m.SubscriptionPage),
    children: [
      {
        path: 'admin',
        title: 'Dados do Administrador',
        loadComponent: () => import('./components/admin-details/admin-details.component').then(m => m.AdminDetailsComponent),
      },
      {
        path: 'company',
        title: 'Dados da Empresa',
        loadComponent: () => import('./components/company-details/company-details.component').then(m => m.CompanyDetailsComponent),
      },
      {
        path: 'select-plan',
        title: 'Selecionar Plano',
        loadComponent: () => import('./components/select-plan/select-plan.component').then(m => m.SelectPlanComponent),
      },
    ],
  },
  {
    path: 'detail',
    title: 'Detalhes da Assinatura',
    canActivate: [authGuard],
    loadComponent: () => import('./pages/subscription-detail/subscription-detail.page').then(m => m.SubscriptionDetailPage),
    children: [
      {
        path: 'admin',
        title: 'Editar Administrador',
        loadComponent: () => import('./components/admin-details/admin-details.component').then(m => m.AdminDetailsComponent),
      },
      {
        path: 'company',
        title: 'Editar Empresa',
        loadComponent: () => import('./components/company-details/company-details.component').then(m => m.CompanyDetailsComponent),
      },
    ],
  },
];
