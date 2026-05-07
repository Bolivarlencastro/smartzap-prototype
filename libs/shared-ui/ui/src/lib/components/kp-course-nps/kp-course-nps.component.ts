import type { PieChart } from '@amcharts/amcharts4/charts';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  Inject,
  InjectionToken,
  Input,
  NgZone,
  OnDestroy,
  PLATFORM_ID,
} from '@angular/core';
import { KpTextCircleComponent } from '../kp-text-circle';

declare const am4core: typeof import('@amcharts/amcharts4/core');
declare const am4charts: typeof import('@amcharts/amcharts4/charts');
declare const am4themes_animated: typeof import('@amcharts/amcharts4/themes/animated').default;

const CHART_ID_PREFIX = 'analytics-course-nps-chart';

const EMPTY_DATA: NpsRowPercent = {
  color: '#dadada',
  label: '- empty data -',
  value: 1,
  percent: 100,
  opacity: 0.3,
  strokeDasharray: '4,4',
  tooltip: '',
};

@Component({
  selector: 'kp-course-nps',
  imports: [CommonModule, KpTextCircleComponent],
  template: `
    <div class="course-nps flex flex-row p-10">
      <table class="w-2/3 mb-32">
        @for (row of rows; track row) {
          <tr>
            <td class="w-1/5">
              <span class="color-tag" [style.background-color]="row.color"> &nbsp; </span>
            </td>
            <td class="w-2/5">{{ row.label }}</td>
            <td class="font-bold w-1/5">{{ row.value }}</td>
            <td class="w-1/5">{{ row.percent | number: '1.1-1' }}%</td>
          </tr>
        }
      </table>
      <kp-text-circle [value]="(npsCalc | number: '1.0-1') + '%'"></kp-text-circle>
    </div>
  `,
  styles: [
    `
      .course-nps {
        .chart {
          height: 20vh;
        }

        .color-tag {
          display: inline-block;
          width: 35px;
          height: 12px;
          border-radius: 5px;
          border: 1px solid lightgray;
          vertical-align: middle;
        }
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class KpCourseNpsComponent implements AfterViewInit, OnDestroy {
  rows!: NpsRow[];
  chartId!: string;
  chart!: PieChart;
  npsCalc: number;

  constructor(
    @Inject(PLATFORM_ID) private platformId: InjectionToken<string>,
    private zone: NgZone,
  ) {
    this.makeId();
  }

  // Run the function only in the browser
  browserOnly(f: () => void): any {
    if (isPlatformBrowser(this.platformId)) {
      this.zone.runOutsideAngular(() => {
        f();
      });
    }
  }

  ngAfterViewInit(): void {
    this.browserOnly(() => {
      am4core.useTheme(am4themes_animated);

      // Create chart instance
      const chart = am4core.create(this.chartId, am4charts.PieChart);

      // Add data
      chart.data = [];

      // Set inner radius
      chart.innerRadius = am4core.percent(50);

      // Add and configure Series
      const pieSeries = chart.series.push(new am4charts.PieSeries());
      pieSeries.dataFields.value = 'value';
      pieSeries.dataFields.category = 'label';

      const slice = pieSeries.slices.template;
      slice.tooltipText = '{category}: {value} ({percent.formatNumber("#.#")}%)';
      slice.propertyFields.stroke = 'color';
      slice.propertyFields.fill = 'color';

      // For empty data only
      slice.propertyFields.strokeDasharray = 'strokeDasharray';
      slice.propertyFields.fillOpacity = 'opacity';
      slice.propertyFields.tooltipText = 'tooltip';

      // Disable labels
      pieSeries.labels.template.disabled = true;

      this.chart = chart;
    });
  }

  ngOnDestroy(): void {
    // Clean up chart when the component is removed
    this.browserOnly(() => {
      if (this.chart) {
        this.chart.dispose();
      }
    });
  }

  @Input()
  set data(data: NpsRow[]) {
    if (!data || !this.chart) {
      return;
    }
    const total = data.reduce<number>((acc, row) => acc + row.value, 0);
    const rows = data.map<NpsRowPercent>((row) => ({
      ...row,
      percent: total ? (100 * row.value) / total : 0,
    }));

    this.rows = rows;
    const promoters = parseFloat(rows[0]?.percent.toFixed(1)) || 0;
    const detractors = parseFloat(rows[2]?.percent.toFixed(1)) || 0;
    this.npsCalc = promoters - detractors;

    this.chart.data = total ? rows : [EMPTY_DATA];
    this.chart.validateData();
  }

  private makeId(): void {
    console.assert(!this.chartId);
    let id: string;
    let exists: HTMLElement | null;
    do {
      const suffix = Math.floor(Math.random() * 100000);
      id = CHART_ID_PREFIX + '_' + suffix;
      exists = document.getElementById(id);
    } while (exists);
    this.chartId = id;
  }
}

export interface NpsRow {
  color: string;
  label: string;
  value: number;
  percent?: number;
}

interface NpsRowPercent extends NpsRow {
  percent: number;

  // For dummy data
  tooltip?: string;
  opacity?: number;
  strokeDasharray?: string;
}
