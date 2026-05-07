import { ChangeDetectionStrategy, Component } from '@angular/core';
import { BaseChartDirective, provideCharts, withDefaultRegisterables } from 'ng2-charts';
import { ChartConfiguration, ChartOptions } from 'chart.js';
import { TranslocoPipe, TranslocoService } from '@jsverse/transloco';

@Component({
  selector: 'lp-led-enrollments-history-chart',
  imports: [BaseChartDirective, TranslocoPipe],
  providers: [provideCharts(withDefaultRegisterables())],
  template: `
    <p class="font-bold mb-4">{{ 'LEADER_PANEL.ENROLLMENT_HISTORY.TITLE' | transloco }}</p>
    <div class="chart-container">
      <canvas baseChart [data]="chartData" [options]="chartOptions" [type]="'line'"></canvas>
    </div>
  `,
  styles: `
    :host {
      @apply border border-default w-full;
      align-items: center;
      padding: 0.875rem;
      gap: 0.75rem;
      border-radius: 0.5rem;
      background-color: var(--mat-sys-surface);
    }

    .chart-container {
      position: relative;
      margin: auto;
      height: 190px;
      width: 100%;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LedEnrollmentsHistoryChartComponent {
  readonly chartOptions: ChartOptions;
  readonly chartData: ChartConfiguration['data'];

  constructor(private readonly translocoService: TranslocoService) {
    this.chartOptions = this.buildChartOptions();
    this.chartData = this.buildChartData();
  }

  private buildChartData(): ChartConfiguration['data'] {
    // Assim que tivermos os dados da api, podemos converter isso para um computed signal, já definindo as cores na inicialização do componente
    // e depois mesclando os dados

    const labels = this.translocoService.translate('LEADER_PANEL.ENROLLMENT_HISTORY.MONTHS');
    const splitLabels = labels.split(' ');
    const finishedLabel = this.translocoService.translate('LEADER_PANEL.ENROLLMENT_HISTORY.FINISHED');
    const totalLabel = this.translocoService.translate('LEADER_PANEL.ENROLLMENT_HISTORY.TOTAL');
    const backgroundColorOpacity = 0.2;

    const finishedBackgroundColor = getComputedColorValue('--mat-sys-primary', backgroundColorOpacity);
    const finishedBorderColor = getComputedColorValue('--mat-sys-primary');

    const totalBackgroundColor = getComputedColorValue('--mat-sys-on-surface-variant', backgroundColorOpacity);
    const totalBorderColor = getComputedColorValue('--mat-sys-on-surface-variant');
    const pointBorderColor = getComputedColorValue('--mat-sys-surface');

    return {
      datasets: [
        {
          data: [10, 15, 12, 7, 4, 10, 18, 19, 13, 12, 10, 10],
          label: finishedLabel,
          backgroundColor: finishedBackgroundColor,
          borderColor: finishedBorderColor,
          pointBackgroundColor: finishedBorderColor,
          pointBorderColor,
          pointHoverBackgroundColor: '#fff',
          pointHoverBorderColor: 'rgba(148,159,177,0.8)',
          fill: 'origin',
        },
        {
          data: [10, 18, 12, 8, 7, 15, 22, 20, 25, 14, 12, 10],
          label: totalLabel,
          backgroundColor: totalBackgroundColor,
          borderColor: totalBorderColor,
          pointBackgroundColor: totalBorderColor,
          pointBorderColor,
          pointHoverBackgroundColor: '#fff',
          pointHoverBorderColor: 'rgba(77,83,96,1)',
          fill: 'origin',
        },
      ],
      labels: splitLabels,
    };
  }

  private buildChartOptions(): ChartOptions {
    const labelsColor = getComputedColorValue('--mat-sys-on-surface');
    const gridColor = getComputedColorValue('--mat-sys-outline-variant');

    const defaultScalesOption = {
      grid: {
        color: gridColor,
      },
      ticks: {
        color: labelsColor,
      },
    };

    return {
      maintainAspectRatio: false,
      elements: {
        line: {
          tension: 0.5,
        },
      },
      scales: {
        y: { ...defaultScalesOption, position: 'left' },
        x: defaultScalesOption,
      },
      plugins: {
        tooltip: { mode: 'x', intersect: false },
        legend: { display: true, align: 'end', labels: { color: labelsColor } },
      },
    };
  }
}

function getComputedColorValue(propertyValue: string, alpha = 1) {
  const mockEl = document.createElement('div');
  mockEl.style.color = getComputedStyle(document.documentElement).getPropertyValue(propertyValue).trim();
  document.body.appendChild(mockEl);

  const computedColor = getComputedStyle(mockEl).color;
  mockEl.remove();
  return toRGBA(computedColor, alpha);
}

function toRGBA(color: string, alpha = 1): string {
  const rgbaRegex = /rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([\d.]+))?\)/;

  const match = rgbaRegex.exec(color);
  if (!match?.length) {
    return color;
  }

  const r = match[1];
  const g = match[2];
  const b = match[3];
  const a = match[4] || alpha;

  return `rgba(${r}, ${g}, ${b}, ${a})`;
}
