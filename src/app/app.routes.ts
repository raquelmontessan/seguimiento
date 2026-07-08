import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  {
    path: 'bienvenida',
    loadComponent: () => import('./pages/welcome/welcome.page').then(m => m.WelcomePage),
  },
  {
    path: 'home',
    canActivate: [authGuard],
    loadComponent: () => import('./pages/home/home.page').then(m => m.HomePage),
  },
  {
    path: 'organigrama',
    canActivate: [authGuard],
    loadComponent: () => import('./pages/org/org.page').then(m => m.OrgPage),
  },
  {
    path: 'seguimiento',
    canActivate: [authGuard],
    loadComponent: () => import('./pages/seguimiento/seguimiento.page').then(m => m.SeguimientoPage),
  },
  {
    path: 'conocimiento',
    canActivate: [authGuard],
    loadComponent: () => import('./pages/kb/kb.page').then(m => m.KbPage),
  },
  { path: '', redirectTo: 'bienvenida', pathMatch: 'full' },
  { path: '**', redirectTo: 'bienvenida' },
];
