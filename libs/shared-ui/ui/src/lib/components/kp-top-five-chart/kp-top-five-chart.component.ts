import type { XYChart } from '@amcharts/amcharts4/charts';
import { Color } from '@amcharts/amcharts4/core';
import { isPlatformBrowser } from '@angular/common';
import { AfterViewInit, Component, Inject, InjectionToken, Input, NgZone, OnDestroy, PLATFORM_ID } from '@angular/core';

declare const am4core: typeof import('@amcharts/amcharts4/core');
declare const am4charts: typeof import('@amcharts/amcharts4/charts');
declare const am4themes_animated: typeof import('@amcharts/amcharts4/themes/animated').default;

const CHART_ID_PREFIX = 'analytics-top-five-chart';

@Component({
  selector: 'kp-top-five-chart',
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
export class KpTopFiveChartComponent implements AfterViewInit, OnDestroy {
  private _chart!: XYChart;
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

      const chart = am4core.create(this.chartId, am4charts.XYChart);
      chart.padding(40, 40, 40, 40);

      const categoryAxis = chart.yAxes.push(new am4charts.CategoryAxis());
      categoryAxis.renderer.grid.template.location = 0;
      categoryAxis.dataFields.category = 'label';
      categoryAxis.renderer.minGridDistance = 1;
      categoryAxis.renderer.inversed = true;
      categoryAxis.renderer.grid.template.disabled = true;

      const valueAxis = chart.xAxes.push(new am4charts.ValueAxis());
      valueAxis.min = 0;

      const series = chart.series.push(new am4charts.ColumnSeries());
      series.dataFields.categoryY = 'label';
      series.dataFields.valueX = 'value';
      series.tooltipText = '{valueX.value}';
      series.columns.template.strokeOpacity = 0;
      series.columns.template.column.cornerRadiusBottomRight = 5;
      series.columns.template.column.cornerRadiusTopRight = 5;

      const labelBullet = series.bullets.push(new am4charts.LabelBullet());
      labelBullet.label.horizontalCenter = 'left';
      labelBullet.label.dx = 10;
      labelBullet.label.text = '{values.valueX.workingValue.formatNumber("0as")}';
      labelBullet.label.truncate = false;
      labelBullet.label.background.fill = am4core.color('white', 0.5);
      labelBullet.locationX = 1;

      // as by default columns of the same series are of the same color, we add adapter which takes colors from chart.colors color set
      series.columns.template.adapter.add('fill', (fill, target): Color | undefined => {
        return target.dataItem ? chart.colors.getIndex(target.dataItem?.index) : undefined;
      });

      categoryAxis.sortBySeries = series;
      chart.data = [];
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
