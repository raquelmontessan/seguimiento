import { AfterViewInit, Component, ElementRef, OnDestroy, effect, input, viewChild } from '@angular/core';
import { Chart, ChartConfiguration, registerables } from 'chart.js';

Chart.register(...registerables);

/** Envoltorio ligero de Chart.js reactivo a señales. */
@Component({
  selector: 'app-chart',
  template: `<div class="chartwrap" [style.height.px]="height()"><canvas #cv></canvas></div>`,
  styles: [`.chartwrap { position: relative; width: 100%; }`],
})
export class ChartComponent implements AfterViewInit, OnDestroy {
  readonly config = input.required<ChartConfiguration>();
  readonly height = input<number>(240);

  private readonly canvas = viewChild.required<ElementRef<HTMLCanvasElement>>('cv');
  private chart?: Chart;
  private ready = false;

  constructor() {
    effect(() => {
      const cfg = this.config();
      if (this.ready) this.build(cfg);
    });
  }

  ngAfterViewInit(): void {
    this.ready = true;
    this.build(this.config());
  }

  private build(cfg: ChartConfiguration): void {
    this.chart?.destroy();
    const ctx = this.canvas().nativeElement.getContext('2d');
    if (!ctx) return;
    this.chart = new Chart(ctx, cfg);
  }

  ngOnDestroy(): void {
    this.chart?.destroy();
  }
}
