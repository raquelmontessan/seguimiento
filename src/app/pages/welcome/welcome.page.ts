import { Component, inject, signal, viewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import {
  IonContent, IonModal, IonIcon, IonButton, IonInput, IonItem,
} from '@ionic/angular/standalone';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-welcome',
  templateUrl: 'welcome.page.html',
  styleUrls: ['welcome.page.scss'],
  imports: [FormsModule, IonContent, IonModal, IonIcon, IonButton, IonInput, IonItem],
})
export class WelcomePage {
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);
  private readonly modal = viewChild(IonModal);

  /** La app queda restringida a esta pantalla a partir del 10/07/2026. */
  readonly bloqueada = this.auth.appBloqueada();

  loginOpen = signal(false);
  step = signal<'choose' | 'email'>('choose');
  email = signal('');
  showError = signal(false);

  openLogin(): void {
    if (this.bloqueada) return;
    this.step.set('choose');
    this.email.set('');
    this.showError.set(false);
    this.loginOpen.set(true);
  }
  closeLogin(): void { this.loginOpen.set(false); }

  chooseQa(): void { this.showError.set(false); this.step.set('email'); }
  back(): void { this.step.set('choose'); this.showError.set(false); }

  async enterQa(): Promise<void> {
    if (this.bloqueada) return;
    if (this.auth.loginQa(this.email())) {
      await this.dismissAndGo();
    } else {
      this.showError.set(true);
    }
  }

  async enterGuest(): Promise<void> {
    if (this.bloqueada) return;
    this.auth.loginGuest();
    await this.dismissAndGo();
  }

  /** Cierra el modal por completo y luego navega, para no dejar el overlay huérfano. */
  private async dismissAndGo(): Promise<void> {
    try { await this.modal()?.dismiss(); } catch { /* ya cerrado */ }
    this.loginOpen.set(false);
    this.router.navigate(['/home']);
  }

  requestAccess(ev: Event): void {
    ev.preventDefault();
    const subj = encodeURIComponent('Solicitud de acceso – Equipo QA');
    const body = encodeURIComponent(
      'Estimado administrador:\nPor medio del presente, solicito el acceso al sistema como integrante del equipo de QA.\nComparto mis datos para la creación de mi usuario:\n\n* Nombre completo: [Nombre completo]\n* Correo electrónico: [Correo electrónico]\nQuedo atento(a) a cualquier información adicional que sea necesaria para completar el proceso.\nMuchas gracias por su apoyo.\nSaludos cordiales, [Nombre completo]');
    window.location.href = 'mailto:gramirezaa@infonavit.org.mx?subject=' + subj + '&body=' + body;
  }
}
