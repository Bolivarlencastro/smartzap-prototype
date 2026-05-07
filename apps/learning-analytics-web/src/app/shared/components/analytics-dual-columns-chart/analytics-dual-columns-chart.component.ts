import type { CategoryAxis, ColumnSeries, ValueAxis, XYChart } from '@amcharts/amcharts4/charts';
import { isPlatformBrowser } from '@angular/common';
import { AfterViewInit, Component, Inject, InjectionToken, Input, NgZone, OnDestroy, PLATFORM_ID } from '@angular/core';

declare const am4core: typeof import('@amcharts/amcharts4/core');
declare const am4charts: typeof import('@amcharts/amcharts4/charts');
declare const am4themes_animated: typeof import('@amcharts/amcharts4/themes/animated').default;

const CHART_ID_PREFIX = 'analytics-dual-columns-chart';

@Component({
  selector: 'app-dual-columns-chart',
  template: ` <div [id]="chartId"></div>`,
  styleUrls: ['./analytics-dual-columns-chart.component.scss'],
})
export class AnalyticsDualColumnsChartComponent implements AfterViewInit, OnDestroy {
  @Input() header!: string;

  @Input() series1Label = 'Serie 1';
  @Input() series1Field = 'value1';
  @Input() series1Color = '#4156ee';

  @Input() series2Label = 'Serie 2';
  @Input() series2Field = 'value2';
  @Input() series2Color = '#a0abf7';

  @Input() categoryLabel = '';
  @Input() categoryField = 'category';

  chartId!: string;

  private chart!: XYChart;

  private categoryAxis!: CategoryAxis;
  private valueAxis!: ValueAxis;
  private series1!: ColumnSeries;
  private series2!: ColumnSeries;

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
      if (this.header) {
        const title = chart.titles.create();
        title.text = this.header;
        title.fontSize = 20;
        title.marginBottom = 30;
        title.align = 'left';
      }

      // Create axes
      const categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis());
      categoryAxis.dataFields.category = this.categoryField;
      categoryAxis.renderer.opposite = true;
      categoryAxis.renderer.minGridDistance = 100;
      categoryAxis.renderer.grid.template.location = 0;

      const valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
      valueAxis.min = 0;
      valueAxis.renderer.grid.template.disabled = true;

      // Create series
      const series1 = chart.series.push(new am4charts.ColumnSeries());
      series1.clustered = false;
      series1.name = this.series1Label;
      series1.dataFields.valueY = this.series1Field;
      series1.dataFields.categoryX = this.categoryField;
      series1.columns.template.width = am4core.percent(60);
      series1.columns.template.fill = am4core.color(this.series1Color);
      series1.tooltipText = `[bold]${this.categoryLabel ? this.categoryLabel + ': ' : ''}{categoryX}[/]\n
                            ${this.series1Label}: {valueY}\n
                            ${this.series2Label}: {${this.series2Field}}`;

      const series2 = chart.series.push(new am4charts.ColumnSeries());
      series2.name = this.series2Label;
      series2.dataFields.valueY = this.series2Field;
      series2.dataFields.categoryX = this.categoryField;
      series2.columns.template.fill = am4core.color(this.series2Color);
      series2.toBack();

      // Add cursor
      chart.cursor = new am4charts.XYCursor();
      chart.cursor.lineX.disabled = true;

      // Add legend
      chart.legend = new am4charts.Legend();

      // bindings
      this.chart = chart;
      this.categoryAxis = categoryAxis;
      this.valueAxis = valueAxis;
      this.series1 = series1;
      this.series2 = series2;
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

    this.chart.data = data;
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
