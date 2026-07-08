import { Component, computed, inject, signal } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import {
  IonHeader, IonToolbar, IonTitle, IonButtons, IonMenuButton, IonContent,
  IonIcon, IonButton, IonModal,
} from '@ionic/angular/standalone';
import { KB_DOCS } from '../../data/kb.data';
import { KbDoc } from '../../models/qa.models';

@Component({
  selector: 'app-kb',
  templateUrl: 'kb.page.html',
  styleUrls: ['kb.page.scss'],
  imports: [IonHeader, IonToolbar, IonTitle, IonButtons, IonMenuButton, IonContent, IonIcon, IonButton, IonModal],
})
export class KbPage {
  private readonly sanitizer = inject(DomSanitizer);
  readonly docs = KB_DOCS;
  readonly base = 'assets/kb/';

  tourDoc = signal<KbDoc | null>(null);
  tourIdx = signal<number>(0);

  readonly currentStep = computed(() => { const d = this.tourDoc(); return d ? d.steps[this.tourIdx()] : null; });
  readonly stepHtml = computed<SafeHtml>(() => {
    const s = this.currentStep();
    return s ? this.sanitizer.bypassSecurityTrustHtml(s.html) : '';
  });
  readonly progress = computed(() => { const d = this.tourDoc(); return d ? (this.tourIdx() + 1) / d.steps.length * 100 : 0; });
  readonly isLast = computed(() => { const d = this.tourDoc(); return d ? this.tourIdx() === d.steps.length - 1 : false; });

  fileUrl(f: string): string { return this.base + encodeURIComponent(f); }

  openTour(i: number): void { this.tourDoc.set(this.docs[i]); this.tourIdx.set(0); }
  closeTour(): void { this.tourDoc.set(null); }
  next(): void { const d = this.tourDoc(); if (!d) return; if (this.tourIdx() < d.steps.length - 1) this.tourIdx.update(i => i + 1); else this.closeTour(); }
  prev(): void { if (this.tourIdx() > 0) this.tourIdx.update(i => i - 1); }
  goStep(i: number): void { this.tourIdx.set(i); }
}
