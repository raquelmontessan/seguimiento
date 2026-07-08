import { Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ChartConfiguration, Plugin } from 'chart.js';
import {
  IonHeader, IonToolbar, IonTitle, IonButtons, IonMenuButton, IonContent,
  IonSelect, IonSelectOption, IonButton, IonIcon, IonSegment, IonSegmentButton, IonLabel,
  ToastController,
} from '@ionic/angular/standalone';
import { QaDataService } from '../../services/qa-data.service';
import { AuthService } from '../../services/auth.service';
import { ChartComponent } from '../../shared/chart.component';
import { Registro } from '../../models/qa.models';
import { GRUPOS, GCOL, EJEC, FASES_POR_GRUPO, ORDEN_FASES } from '../../data/constants';

type MlMode = 'act' | 'eje' | 'cie' | 'sla';
interface FaseGroup { fase: string; color: string; items: Registro[]; }
interface HeatCell { v: number; bg: string | null; fg: string; l?: string; mo?: string; }
interface HeatRow { label: string; cells: HeatCell[]; tot: number; }
interface HeatTable { colLabel: string; cols: string[]; rows: HeatRow[]; clickable: boolean; }

@Component({
  selector: 'app-seguimiento',
  templateUrl: 'seguimiento.page.html',
  styleUrls: ['seguimiento.page.scss'],
  imports: [
    FormsModule, IonHeader, IonToolbar, IonTitle, IonButtons, IonMenuButton, IonContent,
    IonSelect, IonSelectOption, IonButton, IonIcon, IonSegment, IonSegmentButton, IonLabel,
    ChartComponent,
  ],
})
export class SeguimientoPage {
  readonly qa = inject(QaDataService);
  readonly auth = inject(AuthService);
  private readonly toastCtrl = inject(ToastController);
  readonly GRUPOS = GRUPOS;
  readonly GCOL = GCOL;

  // ---- estado local ----
  mlMode = signal<MlMode | null>(null);
  mlFase = signal<string>('');
  hmMode = signal<'l' | 'e' | 'st' | 'blq'>('l');
  lidSem = signal<string>('');
  detailTester = signal<string | null>(null);
  blqSel = signal<{ l: string; mo: string } | null>(null);

  private readonly MODE_TITLE: Record<MlMode, string> = {
    act: 'Requerimientos activos',
    eje: 'Requerimientos en ejecución',
    cie: 'Requerimientos en cierre / seguimiento',
    sla: 'Requerimientos con SLA vencido',
  };

  // ---- métricas ----
  readonly D = computed(() => this.qa.filtered());
  readonly nAct = computed(() => this.D().length);
  readonly nEje = computed(() => this.D().filter(r => EJEC.has(r.g)).length);
  readonly nCie = computed(() => this.D().length - this.nEje());
  readonly nSla = computed(() => this.D().filter(r => r.s === 'Vencido').length);

  // ---- testers ordenados por carga (para gráfica y semáforo) ----
  readonly testersOrdenados = computed(() => {
    const D = this.D();
    const tot: Record<string, number> = {};
    const testers = [...new Set(D.map(r => r.e))];
    testers.forEach(t => tot[t] = D.filter(r => r.e === t).length);
    return testers.sort((a, b) => tot[b] - tot[a]);
  });

  readonly leyendaGrupos = computed(() =>
    GRUPOS.map(g => ({ g, color: GCOL[g], count: this.D().filter(r => r.g === g).length })));

  // ---- gráfica 1: carga por consultor y fase ----
  readonly chart1Height = computed(() => Math.max(200, this.testersOrdenados().length * 34 + 70));
  readonly chart1 = computed<ChartConfiguration>(() => {
    const D = this.D();
    const testers = this.testersOrdenados();
    const tot: Record<string, number> = {};
    testers.forEach(t => tot[t] = D.filter(r => r.e === t).length);
    return {
      type: 'bar',
      data: {
        labels: testers,
        datasets: GRUPOS.map(g => ({
          label: g,
          data: testers.map(t => D.filter(r => r.e === t && r.g === g).length),
          backgroundColor: GCOL[g], borderRadius: 3, maxBarThickness: 22,
        })),
      },
      options: {
        indexAxis: 'y', responsive: true, maintainAspectRatio: false,
        plugins: { legend: { display: false }, tooltip: { callbacks: { afterTitle: (i: any) => 'Total: ' + tot[i[0].label] } } },
        scales: {
          x: { stacked: true, ticks: { precision: 0, color: '#8a92a0' }, grid: { color: '#ece8e3' } },
          y: { stacked: true, ticks: { color: '#5b6472' }, grid: { display: false } },
        },
      },
    };
  });

  // ---- gráfica 2: carga por línea de negocio ----
  readonly chart2Data = computed(() => {
    const D = this.D();
    const lobs: Record<string, number> = {};
    D.forEach(r => lobs[r.l] = (lobs[r.l] || 0) + 1);
    return Object.entries(lobs).sort((a, b) => b[1] - a[1]).slice(0, 14);
  });
  readonly chart2Height = computed(() => Math.max(170, this.chart2Data().length * 34 + 70));
  readonly chart2 = computed<ChartConfiguration>(() => {
    const lp = this.chart2Data();
    return {
      type: 'bar',
      data: { labels: lp.map(x => x[0]), datasets: [{ data: lp.map(x => x[1]), backgroundColor: '#8e2438', borderRadius: 3, maxBarThickness: 20 }] },
      options: {
        indexAxis: 'y', responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } },
        scales: { x: { ticks: { precision: 0, color: '#8a92a0' }, grid: { color: '#ece8e3' } }, y: { ticks: { color: '#5b6472' }, grid: { display: false } } },
      },
    };
  });

  // ---- gráfica 3: carga por analista ----
  readonly chart3 = computed<ChartConfiguration>(() => {
    const D = this.D();
    const anas = [...new Set(D.map(r => r.a))].sort();
    return {
      type: 'bar',
      data: {
        labels: anas,
        datasets: GRUPOS.map(g => ({ label: g, data: anas.map(a => D.filter(r => r.a === a && r.g === g).length), backgroundColor: GCOL[g], borderRadius: 3, maxBarThickness: 26 })),
      },
      options: {
        indexAxis: 'y', responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } },
        scales: { x: { stacked: true, ticks: { precision: 0, color: '#8a92a0' }, grid: { color: '#ece8e3' } }, y: { stacked: true, ticks: { color: '#5b6472' }, grid: { display: false } } },
      },
    };
  });

  // ---- filtro fase específica ----
  readonly faseEspecificaOpts = computed(() => {
    const g = this.qa.filters().gru;
    if (!g || !FASES_POR_GRUPO[g]) return [];
    const presentes = [...new Set(this.qa.data().filter(r => r.g === g).map(r => r.f))];
    return FASES_POR_GRUPO[g].filter(f => presentes.includes(f));
  });

  // ---- panel de lista (mlist) ----
  readonly mlFaseOptions = computed(() => {
    const mode = this.mlMode();
    if (!mode) return [];
    const all = this.mlAll();
    const fases = [...new Set(all.map(r => r.f))].sort((a, b) => this.ordFase(a) - this.ordFase(b) || a.localeCompare(b, 'es'));
    return fases.map(f => ({ f, count: all.filter(r => r.f === f).length }));
  });
  private mlAll(): Registro[] {
    const mode = this.mlMode();
    const D = this.D();
    if (mode === 'eje') return D.filter(r => EJEC.has(r.g));
    if (mode === 'cie') return D.filter(r => !EJEC.has(r.g));
    if (mode === 'sla') return D.filter(r => r.s === 'Vencido');
    return D;
  }
  readonly mlGroups = computed<FaseGroup[]>(() => {
    if (!this.mlMode()) return [];
    let rows = this.mlAll();
    const faseSel = this.mlFase();
    if (faseSel) rows = rows.filter(r => r.f === faseSel);
    const grupos: Record<string, Registro[]> = {};
    rows.forEach(r => (grupos[r.f] = grupos[r.f] || []).push(r));
    return Object.keys(grupos)
      .sort((a, b) => this.ordFase(a) - this.ordFase(b) || a.localeCompare(b, 'es'))
      .map(f => {
        const items = grupos[f].sort((a, b) => String(a.e).localeCompare(String(b.e), 'es'));
        return { fase: f, color: GCOL[items[0].g] || '#c3c2b7', items };
      });
  });
  readonly mlTitle = computed(() => {
    const mode = this.mlMode();
    if (!mode) return '';
    const tesSel = this.qa.filters().tes;
    const faseSel = this.mlFase();
    let rows = this.mlAll();
    if (faseSel) rows = rows.filter(r => r.f === faseSel);
    return this.MODE_TITLE[mode] + (tesSel ? ' — ' + tesSel : '') + (faseSel ? ' · ' + faseSel : '') + ' (' + rows.length + ')';
  });
  private ordFase(f: string): number { const i = ORDEN_FASES.indexOf(f); return i < 0 ? 99 : i; }

  toggleMlist(mode: MlMode): void {
    if (this.mlMode() === mode) { this.mlMode.set(null); return; }
    this.mlMode.set(mode);
    this.mlFase.set('');
  }
  closeMlist(): void { this.mlMode.set(null); }

  // ---- tabla de capacidad ----
  readonly capRows = computed(() => {
    const D = this.D();
    const testers = [...new Set(D.map(r => r.e))];
    return testers.map(t => {
      const rs = D.filter(r => r.e === t);
      const e2 = rs.filter(r => EJEC.has(r.g)).length;
      const c2 = rs.length - e2;
      const lobs = new Set(rs.map(r => r.l)).size;
      let rec: string, cls: string;
      if (e2 <= 3) { rec = 'Sí, con holgura'; cls = 'ok'; }
      else if (e2 <= 5) { rec = 'Posible, con reservas'; cls = 'warn'; }
      else { rec = 'No recomendable'; cls = 'bad'; }
      return { t, act: rs.length, e2, c2, lobs, rec, cls };
    }).sort((a, b) => b.act - a.act || b.e2 - a.e2);
  });

  // ---- semáforo ----
  readonly lideresSem = computed(() => {
    const D = this.D();
    return [...new Set(D.map(r => r.lt || 'Sin líder asignado'))].sort((a, b) => a.localeCompare(b, 'es'))
      .map(l => ({ l, n: new Set(D.filter(r => r.lt === l).map(r => r.e)).size }));
  });
  readonly semRows = computed(() => {
    const D = this.D();
    const lid = this.lidSem();
    let testers = this.testersOrdenados();
    if (lid) testers = testers.filter(t => { const any = D.find(r => r.e === t); return any && any.lt === lid; });
    return testers.map(t => {
      const rs = D.filter(r => r.e === t);
      const e2 = rs.filter(r => EJEC.has(r.g)).length;
      const c2 = rs.length - e2;
      let txt: string, cls: string;
      if (e2 <= 3) { txt = 'Puede recibir'; cls = 'ok'; }
      else if (e2 <= 5) { txt = 'Al límite'; cls = 'warn'; }
      else { txt = 'Saturado'; cls = 'bad'; }
      return { t, e2, c2, txt, cls };
    });
  });

  // ---- detalle por consultor ----
  readonly detailRows = computed(() => {
    const t = this.detailTester();
    if (!t) return [];
    return this.D().filter(r => r.e === t);
  });
  showDetail(t: string): void { this.detailTester.set(t); }
  closeDetail(): void { this.detailTester.set(null); }

  // ---- mapas de calor ----
  private heatColor(v: number, max: number): string | null {
    if (!v) return null;
    const tt = Math.sqrt(v / max);
    const light = [251, 236, 238], dark = [142, 36, 56];
    const c = light.map((x, i) => Math.round(x + (dark[i] - x) * tt));
    return 'rgb(' + c.join(',') + ')';
  }
  readonly heatTable = computed<HeatTable>(() => {
    const mode = this.hmMode();
    if (mode === 'blq') return this.buildBloqTable();
    const key = mode as 'l' | 'e' | 'st';
    const labels: Record<string, string> = { l: 'Línea de negocio', e: 'Consultor', st: 'Estatus' };
    const FULL = this.qa.full();
    const tipos = [...new Set(FULL.map(r => r.t))].sort((a, b) => FULL.filter(r => r.t === b).length - FULL.filter(r => r.t === a).length);
    const rowVals = [...new Set(FULL.map(r => (r as any)[key] as string))];
    const counts: Record<string, any> = {}; let max = 0;
    rowVals.forEach(rv => { counts[rv] = {}; let tot = 0; tipos.forEach(t => { const c = FULL.filter(r => (r as any)[key] === rv && r.t === t).length; counts[rv][t] = c; tot += c; if (c > max) max = c; }); counts[rv].__tot = tot; });
    rowVals.sort((a, b) => counts[b].__tot - counts[a].__tot);
    const rows: HeatRow[] = rowVals.map(rv => ({
      label: rv,
      cells: tipos.map(t => { const c = counts[rv][t]; return { v: c, bg: this.heatColor(c, max), fg: c / max > 0.45 ? '#fff' : '#8e2438' } as HeatCell; }),
      tot: counts[rv].__tot,
    }));
    return { colLabel: labels[key], cols: tipos, rows, clickable: false };
  });
  private buildBloqTable(): HeatTable {
    const BLOQ = this.qa.bloq();
    const motivos = [...new Set(BLOQ.map(b => b.motivo))].sort((a, b) => BLOQ.filter(x => x.motivo === b).length - BLOQ.filter(x => x.motivo === a).length);
    const lineas = [...new Set(BLOQ.map(b => b.l))];
    const counts: Record<string, any> = {}; let max = 0;
    lineas.forEach(l => { counts[l] = {}; let tot = 0; motivos.forEach(mo => { const c = BLOQ.filter(b => b.l === l && b.motivo === mo).length; counts[l][mo] = c; tot += c; if (c > max) max = c; }); counts[l].__tot = tot; });
    lineas.sort((a, b) => counts[b].__tot - counts[a].__tot);
    const rows: HeatRow[] = lineas.map(l => ({
      label: l,
      cells: motivos.map(mo => { const c = counts[l][mo]; return { v: c, bg: this.heatColor(c, max), fg: c / max > 0.45 ? '#fff' : '#8e2438', l, mo } as HeatCell; }),
      tot: counts[l].__tot,
    }));
    return { colLabel: 'Línea de negocio', cols: motivos, rows, clickable: true };
  }
  readonly blqItems = computed(() => {
    const sel = this.blqSel();
    if (!sel) return [];
    return this.qa.bloq().filter(b => b.l === sel.l && (!sel.mo || b.motivo === sel.mo));
  });
  clickHeat(cell: HeatCell): void {
    if (this.hmMode() === 'blq' && cell.v && cell.l) this.blqSel.set({ l: cell.l, mo: cell.mo || '' });
  }
  closeBlq(): void { this.blqSel.set(null); }

  // ---- helpers de plantilla ----
  slaPill(s: string): { txt: string; cls: string } | null {
    if (s === 'Vencido') return { txt: 'SLA vencido', cls: 'bad' };
    if (s === 'A Tiempo') return { txt: 'A tiempo', cls: 'ok' };
    return null;
  }
  setFilter(key: any, val: string): void { this.qa.setFilter(key, val); if (key === 'gru') this.qa.setFilter('fase', ''); }
  clearFilters(): void { this.qa.clearFilters(); this.mlMode.set(null); }

  onFile(ev: Event): void {
    const input = ev.target as HTMLInputElement;
    const file = input.files && input.files[0];
    if (!file) return;
    this.mlMode.set(null);
    this.detailTester.set(null);
    this.qa.loadFile(file).then(async res => {
      input.value = '';
      const toast = await this.toastCtrl.create({
        message: res.msg,
        duration: res.ok ? 3500 : 6000,
        position: 'top',
        color: res.ok ? 'success' : 'danger',
        buttons: [{ text: 'Cerrar', role: 'cancel' }],
      });
      await toast.present();
    });
  }

  // =====================================================================
  //  Vista gerencial (Invitado)
  // =====================================================================
  private readonly CIERRE = 'Concluido/Cierre';
  readonly gmTotal = computed(() => this.qa.data().length);
  readonly gmCie = computed(() => this.qa.data().filter(r => r.g === this.CIERRE).length);
  readonly gmEje = computed(() => this.gmTotal() - this.gmCie());
  readonly gmAvg = computed(() => { const d = this.qa.data(); return Math.round(d.reduce((s, r) => s + (+r.av || 0), 0) / (d.length || 1)); });
  readonly gmAreas = computed(() => {
    const D = this.qa.data();
    const byArea: Record<string, { t: number; e: number; c: number }> = {};
    D.forEach(r => { const a = r.l || 'Sin área'; (byArea[a] = byArea[a] || { t: 0, e: 0, c: 0 }); byArea[a].t++; if (r.g === this.CIERRE) byArea[a].c++; else byArea[a].e++; });
    const rows = Object.entries(byArea).sort((a, b) => b[1].t - a[1].t);
    const maxT = rows.length ? rows[0][1].t : 1;
    return rows.map(([a, o]) => ({ a, ...o, wTot: (o.t / maxT * 100), wE: (o.e / o.t * 100), wC: (o.c / o.t * 100) }));
  });
  readonly gmChart = computed<ChartConfiguration>(() => {
    const D = this.qa.data();
    const groups = GRUPOS.filter(g => D.some(r => r.g === g));
    const counts = groups.map(g => D.filter(r => r.g === g).length);
    const GER_PAL: Record<string, string> = { 'Definición': '#8e2438', 'Desarrollo/PU': '#2f3c88', 'QA (UAT)': '#4b515e', 'Tarea adicional': '#9aa0ab', 'Concluido/Cierre': '#5b6bc0' };
    const SHORT: Record<string, string> = { 'Definición': 'Definición', 'Desarrollo/PU': 'Desarrollo', 'QA (UAT)': 'QA / UAT', 'Tarea adicional': 'T. adicional', 'Concluido/Cierre': 'Cierre' };
    const colors = groups.map(g => GER_PAL[g] || '#8e2438');
    const total = counts.reduce((a, b) => a + b, 0) || 1;
    const barValues: Plugin = {
      id: 'barValues',
      afterDatasetsDraw(chart) {
        const c = chart.ctx; const meta = chart.getDatasetMeta(0); const ds = chart.data.datasets[0].data as number[];
        c.save(); c.textAlign = 'center'; c.textBaseline = 'bottom'; c.fillStyle = '#1a1c23'; c.font = '700 13px "Segoe UI",system-ui,sans-serif';
        meta.data.forEach((bar: any, i: number) => c.fillText(String(ds[i]), bar.x, bar.y - 5));
        c.restore();
      },
    };
    return {
      type: 'bar',
      data: { labels: groups.map(g => SHORT[g] || g), datasets: [{ data: counts, backgroundColor: colors, borderRadius: 4, maxBarThickness: 70 }] },
      options: {
        responsive: true, maintainAspectRatio: false, layout: { padding: { top: 22 } },
        plugins: { legend: { display: false }, tooltip: { callbacks: { title: (it: any) => groups[it[0].dataIndex], label: (it: any) => ' ' + it.parsed.y + ' proyectos (' + Math.round(it.parsed.y / total * 100) + '%)' } } },
        scales: { x: { grid: { display: false }, ticks: { color: '#5a5f6e' } }, y: { beginAtZero: true, grid: { color: '#eef0f2' }, ticks: { precision: 0, color: '#8b909d' } } },
      },
      plugins: [barValues],
    };
  });
  readonly gmLegend = computed(() => {
    const D = this.qa.data();
    const groups = GRUPOS.filter(g => D.some(r => r.g === g));
    const GER_PAL: Record<string, string> = { 'Definición': '#8e2438', 'Desarrollo/PU': '#2f3c88', 'QA (UAT)': '#4b515e', 'Tarea adicional': '#9aa0ab', 'Concluido/Cierre': '#5b6bc0' };
    return groups.map(g => ({ g, color: GER_PAL[g] || '#8e2438' }));
  });
}
