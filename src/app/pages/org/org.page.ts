import { Component, inject, signal } from '@angular/core';
import {
  IonHeader, IonToolbar, IonTitle, IonButtons, IonMenuButton, IonContent,
  IonSegment, IonSegmentButton, IonLabel,
} from '@ionic/angular/standalone';
import { QaDataService } from '../../services/qa-data.service';

@Component({
  selector: 'app-org',
  templateUrl: 'org.page.html',
  styleUrls: ['org.page.scss'],
  imports: [
    IonHeader, IonToolbar, IonTitle, IonButtons, IonMenuButton, IonContent,
    IonSegment, IonSegmentButton, IonLabel,
  ],
})
export class OrgPage {
  private readonly qa = inject(QaDataService);
  readonly org = this.qa.org;
  tab = signal<'gen' | 'bk'>('gen');
}
