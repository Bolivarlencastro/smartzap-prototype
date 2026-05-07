import { AfterViewInit, Component, Inject, InjectionToken, Input, NgZone, OnDestroy, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import type { XYChart, CategoryAxis, ValueAxis, ColumnSeries, ValueAxisDataItem } from '@amcharts/amcharts4/charts';
import { Color } from '@amcharts/amcharts4/core';

declare const am4core: typeof import('@amcharts/amcharts4/core');
declare const am4charts: typeof import('@amcharts/amcharts4/charts');
declare const am4themes_animated: typeof import('@amcharts/amcharts4/themes/animated').default;

const CHART_ID_PREFIX = 'analytics-performance-distribution-chart';

const RANGES = [
  { from: 0, to: 0.1, label: '10%', color: '#dc648c' },
  { from: 0.1, to: 0.25, label: '25%', color: '#db65cc' },
  { from: 0.25, to: 0.5, label: '50%', color: '#faa46d' },
  { from: 0.5, to: 0.75, label: '75%', color: '#66b2dd' },
  { from: 0.75, to: 1, label: '100%', color: '#6b79ec' },
];

@Component({
  selector: 'kp-performance-distribution-chart',
  imports: [],
  template: `<div [id]="chartId"></div>`,
  styles: [
    `
      :host {
        width: 100%;

        > div {
          width: 100%;
          height: 50vh;
          min-height: 300px;
        }
      }
    `,
  ],
})
export class KpPerformanceDistributionChartComponent implements AfterViewInit, OnDestroy {
  @Input() header!: string;
  @Input() label!: string;

  chartId!: string;

  private chart!: XYChart;
  private yAxis!: CategoryAxis;
  private xAxis!: ValueAxis;
  private series!: ColumnSeries;
  private ranges!: ValueAxisDataItem[];

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
      const chart = am4core.create(this.chartId, am4charts.XYChart);
      chart.padding(40, 40, 40, 40);
      chart.data = this.data;

      // Chart Title
      const title = chart.titles.create();
      title.text = this.header;
      title.fontSize = 28;
      title.fontWeight = 'bold';
      title.marginBottom = 30;
      title.align = 'left';

      // Chart label
      const label = chart.chartContainer.createChild(am4core.Label);
      label.text = this.label;
      label.fontSize = 20;
      label.align = 'center';

      // Create axes
      const yAxis = chart.yAxes.push(new am4charts.CategoryAxis());
      yAxis.dataFields.category = 'category';
      yAxis.renderer.grid.template.disabled = true;
      yAxis.renderer.labels.template.disabled = true;

      const xAxis = chart.xAxes.push(new am4charts.ValueAxis());
      xAxis.renderer.opposite = true;
      xAxis.renderer.grid.template.disabled = true;
      xAxis.renderer.labels.template.disabled = true;
      xAxis.renderer.baseGrid.disabled = true;
      xAxis.min = 0;
      xAxis.max = 1;

      // Create series
      const series = chart.series.push(new am4charts.ColumnSeries());
      series.dataFields.valueX = 'to';
      series.dataFields.openValueX = 'from';
      series.dataFields.categoryY = 'category';
      series.columns.template.adapter.add('fill', (_fill, target): Color | undefined => {
        if (target.dataItem) {
          return chart.colors.getIndex(target.dataItem.index);
        }
        return undefined;
      });
      series.columns.template.strokeOpacity = 0;
      series.columns.template.height = 40;

      const labelBullet = series.bullets.push(new am4charts.LabelBullet());
      labelBullet.locationX = 0.5;
      labelBullet.label.dy = 40;
      labelBullet.label.text = '{doc_count}';
      labelBullet.label.truncate = false;
      labelBullet.label.fontSize = 20;
      labelBullet.label.fontWeight = 'bold';

      // Ranges
      const ranges = [];
      for (let i = -1; i < RANGES.length; i++) {
        const range = xAxis.axisRanges.create();

        // Special range
        if (i < 0) {
          range.value = 0;
          range.label.text = '0%';
        } else {
          range.value = RANGES[i].to;
          range.label.text = RANGES[i].label;
        }

        range.label.fontSize = 20;
        range.grid.disabled = true;
        range.tick.length = 30;
        range.tick.dy = 30;
        range.tick.strokeOpacity = 0.3;

        ranges.push(range);
      }

      // bindings
      this.chart = chart;
      this.xAxis = xAxis;
      this.yAxis = yAxis;
      this.series = series;
      this.ranges = ranges;
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
  set data(data: any) {
    if (!data || !this.chart) {
      return;
    }

    this.chart.data = data.map((d: any) => ({ category: '', ...d }));
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
