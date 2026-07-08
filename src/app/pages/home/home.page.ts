import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import {
  IonHeader, IonToolbar, IonTitle, IonButtons, IonMenuButton, IonContent, IonIcon,
} from '@ionic/angular/standalone';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  imports: [RouterLink, IonHeader, IonToolbar, IonTitle, IonButtons, IonMenuButton, IonContent, IonIcon],
})
export class HomePage {
  readonly auth = inject(AuthService);

  readonly cards = [
    { url: '/organigrama', icon: 'git-network-outline', title: 'Organigrama', desc: 'Estructura del equipo: organigrama general y backups por línea de negocio.' },
    { url: '/seguimiento', icon: 'stats-chart-outline', title: 'Seguimiento de avance', desc: 'Carga activa, semáforo de disponibilidad, mapas de calor y detalle por consultor.' },
    { url: '/conocimiento', icon: 'book-outline', title: 'Base de conocimiento', desc: 'Guías y documentos de referencia del proceso de pruebas QA.' },
  ];
}
