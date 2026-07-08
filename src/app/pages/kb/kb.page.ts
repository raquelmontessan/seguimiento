import { Component, computed, inject, signal } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import {
  IonHeader, IonToolbar, IonTitle, IonButtons, IonMenuButton, IonContent,
  IonIcon, IonButton, IonModal, ToastController,
} from '@ionic/angular/standalone';
import { Capacitor } from '@capacitor/core';
import { Filesystem, Directory } from '@capacitor/filesystem';
import { FileOpener } from '@capacitor-community/file-opener';
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
  private readonly toastCtrl = inject(ToastController);
  readonly docs = KB_DOCS;
  readonly base = 'assets/kb/';
  private readonly isNative = Capacitor.isNativePlatform();

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

  /** Abre el PDF: en web en pestaña nueva; en móvil lo copia y lo abre con el visor nativo. */
  async viewFile(f: string): Promise<void> {
    if (!this.isNative) { window.open(this.fileUrl(f), '_blank', 'noopener'); return; }
    try {
      const uri = await this.copyToDevice(f, Directory.Cache);
      await FileOpener.open({ filePath: uri, contentType: 'application/pdf' });
    } catch {
      await this.toast('No se pudo abrir el documento. Instala un visor de PDF e inténtalo de nuevo.');
    }
  }

  /** Descarga el PDF: en web fuerza la descarga; en móvil lo guarda en Documentos. */
  async downloadFile(f: string): Promise<void> {
    if (!this.isNative) {
      const a = document.createElement('a');
      a.href = this.fileUrl(f); a.download = f; a.rel = 'noopener';
      document.body.appendChild(a); a.click(); a.remove();
      return;
    }
    try {
      await this.copyToDevice(f, Directory.Documents);
      await this.toast(`Guardado en Documentos: ${f}`);
    } catch {
      await this.toast('No se pudo guardar el documento.');
    }
  }

  /** Copia un PDF empaquetado (assets/kb) al almacenamiento del dispositivo y devuelve su URI nativa. */
  private async copyToDevice(f: string, directory: Directory): Promise<string> {
    const res = await fetch(this.fileUrl(f));
    if (!res.ok) throw new Error('asset no encontrado');
    const blob = await res.blob();
    const data = await this.blobToBase64(blob);
    const written = await Filesystem.writeFile({ path: f, data, directory, recursive: true });
    return written.uri;
  }

  private blobToBase64(blob: Blob): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onerror = () => reject(reader.error);
      reader.onload = () => resolve((reader.result as string).split(',')[1] ?? '');
      reader.readAsDataURL(blob);
    });
  }

  private async toast(message: string): Promise<void> {
    const t = await this.toastCtrl.create({ message, duration: 2800, position: 'bottom' });
    await t.present();
  }

  openTour(i: number): void { this.tourDoc.set(this.docs[i]); this.tourIdx.set(0); }
  closeTour(): void { this.tourDoc.set(null); }
  next(): void { const d = this.tourDoc(); if (!d) return; if (this.tourIdx() < d.steps.length - 1) this.tourIdx.update(i => i + 1); else this.closeTour(); }
  prev(): void { if (this.tourIdx() > 0) this.tourIdx.update(i => i - 1); }
  goStep(i: number): void { this.tourIdx.set(i); }
}
