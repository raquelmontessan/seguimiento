import { Component, inject } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import {
  IonApp, IonSplitPane, IonMenu, IonContent, IonList, IonItem, IonIcon, IonLabel,
  IonRouterOutlet, IonMenuToggle, IonListHeader,
} from '@ionic/angular/standalone';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  imports: [
    RouterLink, RouterLinkActive,
    IonApp, IonSplitPane, IonMenu, IonContent, IonList, IonItem, IonIcon, IonLabel,
    IonRouterOutlet, IonMenuToggle, IonListHeader,
  ],
})
export class AppComponent {
  readonly auth = inject(AuthService);
  private readonly router = inject(Router);

  readonly pages = [
    { title: 'Inicio', url: '/home', icon: 'home-outline' },
    { title: 'Organigrama', url: '/organigrama', icon: 'git-network-outline' },
    { title: 'Seguimiento', url: '/seguimiento', icon: 'stats-chart-outline' },
    { title: 'Base de conocimiento', url: '/conocimiento', icon: 'book-outline' },
  ];

  logout(): void {
    this.auth.logout();
    this.router.navigate(['/bienvenida']);
  }
}
