import type { PieChart } from '@amcharts/amcharts4/charts';
import { isPlatformBrowser } from '@angular/common';
import { AfterViewInit, Component, Inject, InjectionToken, Input, NgZone, OnDestroy, PLATFORM_ID } from '@angular/core';

declare const am4core: typeof import('@amcharts/amcharts4/core');
declare const am4charts: typeof import('@amcharts/amcharts4/charts');
declare const am4themes_animated: typeof import('@amcharts/amcharts4/themes/animated').default;

const CHART_ID_PREFIX = 'analytics-donut-chart';

export interface DonutSlice {
  label: string;
  value: number;
}

@Component({
  selector: 'kp-analytics-donut-chart',
  imports: [],
  template: `<div [id]="chartId"></div>`,
  styles: [
    `
      :host {
        width: 100%;

        > div {
          width: 100%;
          height: 50vh;
          max-height: 400px;
        }
      }
    `,
  ],
})
export class KpAnalyticsDonutChartComponent implements AfterViewInit, OnDestroy {
  private _chart!: PieChart;
  chartId!: string;

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
      pieSeries.slices.template.stroke = am4core.color('#fff');
      pieSeries.slices.template.strokeWidth = 2;
      pieSeries.slices.template.strokeOpacity = 1;

      // This creates initial animation
      pieSeries.hiddenState.properties.opacity = 1;
      pieSeries.hiddenState.properties.endAngle = -90;
      pieSeries.hiddenState.properties.startAngle = -90;

      this._chart = chart;
    });
  }

  ngOnDestroy(): void {
    // Clean up chart when the component is removed
    this.browserOnly(() => {
      if (this._chart) {
        this._chart.dispose();
      }
    });
  }

  @Input()
  set data(data: DonutSlice[]) {
    if (!data || !this._chart) {
      return;
    }

    this._chart.data = data;
    this._chart.validateData();
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
