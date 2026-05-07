import type { LegendPosition, SlicedChart } from '@amcharts/amcharts4/charts';
import { isPlatformBrowser } from '@angular/common';
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
declare const am4core: typeof import('@amcharts/amcharts4/core');
declare const am4charts: typeof import('@amcharts/amcharts4/charts');
declare const am4themes_animated: typeof import('@amcharts/amcharts4/themes/animated').default;

const CHART_ID_PREFIX = 'analytics-funnel-chart';

@Component({
  selector: 'kp-analytics-funnel-chart',
  imports: [],
  template: `<div [id]="chartId"></div>`,
  styles: `
    :host {
      width: 100%;

      > div {
        width: 100%;
        height: 50vh;
        max-height: 400px;
      }
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class KpAnalyticsFunnelChartComponent implements AfterViewInit, OnDestroy {
  @Input() legendPosition: LegendPosition | null = null;
  @Input() alignLabels = false;

  private _chart!: SlicedChart;

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

      const chart = am4core.create(this.chartId, am4charts.SlicedChart);
      chart.hiddenState.properties.opacity = 0; // this makes initial fade in effect

      chart.data = [];

      const series = chart.series.push(new am4charts.FunnelSeries());
      series.colors.step = 2;
      series.dataFields.value = 'value';
      series.dataFields.category = 'label';
      series.orientation = 'horizontal';
      series.bottomRatio = 1;
      series.alignLabels = this.alignLabels;

      series.labels.template.text = '{value}';
      series.slices.template['dummyData'] = 'data';
      series.slices.template.tooltipText = '{category}: {value.value} ({dummyData.percent.formatNumber("#.#")}%)';

      chart.legend = new am4charts.Legend();
      chart.legend.valueLabels.template.text = ' ';

      if (this.legendPosition) {
        chart.legend.position = this.legendPosition;
      }

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
  set data(data: any) {
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
