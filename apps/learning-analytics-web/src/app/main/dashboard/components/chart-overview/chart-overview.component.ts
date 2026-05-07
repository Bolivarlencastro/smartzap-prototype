import { AfterViewInit, Component, Input, NgZone, OnDestroy } from '@angular/core';
import { DashboardPeriodType } from '../../dashboard.model';
import type { XYChart } from '@amcharts/amcharts4/charts';

declare const am4core: typeof import('@amcharts/amcharts4/core');
declare const am4charts: typeof import('@amcharts/amcharts4/charts');
declare const am4themes_animated: typeof import('@amcharts/amcharts4/themes/animated').default;

am4core.useTheme(am4themes_animated);

@Component({
  selector: 'kp-chart-overview',
  template: ` <div [id]="id" style="width: 100%; height: 510px"></div>`,
})
export class ChartOverviewComponent implements AfterViewInit, OnDestroy {
  @Input()
  period: DashboardPeriodType = DashboardPeriodType.YEAR;

  private _data: any;
  private chart!: XYChart;

  private series1: any;
  private series2: any;
  private line: any;
  private dateAxis: any;
  private valueAxis: any;
  private valueAxis2: any;

  id = 'chartdiv' + Math.random() * 100;

  constructor(private zone: NgZone) {}

  ngAfterViewInit(): void {
    const primaryColor = getComputedColorValue('--mat-sys-primary');
    const tetriaryColor = getComputedColorValue('--mat-sys-secondary');

    this.zone.runOutsideAngular(() => {
      // Create chart instance
      const chart: any = am4core.create(this.id, am4charts.XYChart);
      chart.language.locale['_decimalSeparator'] = ',';
      chart.language.locale['_thousandSeparator'] = '.';
      chart.paddingTop = 40;

      // Add data
      chart.data = this.data;

      // Create axes
      this.dateAxis = chart.xAxes.push(new am4charts.DateAxis());
      this.dateAxis.renderer.labels.template.textAlign = 'middle';
      this.dateAxis.groupData = true;
      this.dateAxis.renderer.minGridDistance = 100;

      this.valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
      this.valueAxis.min = 0;
      this.valueAxis.maxPrecision = 0;
      this.valueAxis.adjustLabelPrecision = false;
      this.valueAxis.renderer.grid.template.disabled = true;
      this.valueAxis.title.text = 'Ativos';

      this.valueAxis2 = chart.yAxes.push(new am4charts.ValueAxis());

      this.valueAxis2.renderer.opposite = true;
      this.valueAxis2.renderer.grid.template.disabled = true;
      this.valueAxis2.title.text = 'Novos Usuários';
      this.valueAxis2.min = 0;
      this.valueAxis2.maxPrecision = 0;

      // Create series
      this.series1 = chart.series.push(new am4charts.ColumnSeries());
      this.series1.id = 'curr-data';
      this.series1.name = 'Ativos';
      this.series1.dataFields.valueY = 'series1';
      this.series1.dataFields.dateX = 'date';
      this.series1.strokeWidth = 0;
      this.series1.clustered = false;
      this.series1.columns.template.id = 'curr-date';
      this.series1.columns.template.width = am4core.percent(60);
      this.series1.columns.template.fill = am4core.color(primaryColor).lighten(0.1);

      this.series2 = chart.series.push(new am4charts.ColumnSeries());
      this.series2.id = 'prev-data';
      this.series2.dataFields.valueY = 'series2';
      this.series2.dataFields.dateX = 'date';
      this.series2.tooltipText = '{name}\n[bold font-size: 20]{valueY}[/]';
      this.series2.strokeWidth = 0;
      this.series2.clustered = false;
      this.series2.columns.template.fill = am4core.color('#ddd').lighten(0.5);
      this.series2.toBack();

      this.line = chart.series.push(new am4charts.LineSeries());
      this.line.id = 'new-courses-data';
      this.line.dataFields.valueY = 'series3';
      this.line.dataFields.dateX = 'date';
      this.line.strokeWidth = 2;
      this.line.tensionX = 0.6;

      this.line.yAxis = this.valueAxis2;
      this.line.tooltipText = '{name}\n[bold font-size: 20]{valueY}[/]';
      this.line.fill = am4core.color(tetriaryColor);
      this.line.stroke = am4core.color(tetriaryColor);

      const bullet3 = this.line.bullets.push(new am4charts.CircleBullet());
      bullet3.circle.radius = 3;
      bullet3.circle.strokeWidth = 2;
      bullet3.circle.fill = am4core.color('#fff');

      // Add cursor
      chart.cursor = new am4charts.XYCursor();

      // Add legend
      chart.legend = new am4charts.Legend();

      // Create ranges
      const createRange = (from: Date, to: Date, label: string) => {
        const range = this.dateAxis.axisRanges.create();
        range.date = from;
        range.endDate = to;
        range.label.text = label;
        range.label.paddingTop = 40;
        range.label.location = 0.5;
        range.label.horizontalCenter = 'middle';
        range.label.fontWeight = 'bolder';
        range.label.dy = -420;
        range.grid.disabled = true;
      };

      createRange(new Date(2020, 0, 1), new Date(2020, 2, 31), 'Q1');
      createRange(new Date(2020, 3, 1), new Date(2020, 5, 31), 'Q2');
      createRange(new Date(2020, 6, 1), new Date(2020, 8, 31), 'Q3');
      createRange(new Date(2020, 9, 1), new Date(2020, 11, 31), 'Q4');

      const createRangeGrid = (date: Date) => {
        const range = this.dateAxis.axisRanges.create();
        range.date = date;
        range.grid.strokeOpacity = 1;
        range.tick.disabled = false;
        range.tick.strokeOpacity = 1;
        range.tick.d = -420;
        range.tick.length = -300;
      };

      createRangeGrid(new Date(2020, 0, 1));
      createRangeGrid(new Date(2020, 3, 1));
      createRangeGrid(new Date(2020, 6, 1));
      createRangeGrid(new Date(2020, 9, 1));

      this.chart = chart;
    });
  }

  ngOnDestroy(): void {
    this.zone.runOutsideAngular(() => {
      if (this.chart) {
        this.chart.dispose();
      }
    });
  }

  get data(): any {
    return this._data;
  }

  @Input()
  set data(data: any) {
    if (!data) {
      return;
    }

    const { result, options } = data;

    if (!result) {
      return;
    }

    if (!this.chart) {
      this._data = result;
      return;
    }

    this._data = result;
    this.chart.data = result;
    this.chart.validateData();

    const timeUnit = this.period === DashboardPeriodType.YEAR ? 'month' : 'day';
    const format = this.period === DashboardPeriodType.YEAR ? 'MMM' : 'dd';

    this.series1.name = options.series1.label;
    this.series1.tooltipText = `{name}\n[bold font-size: 20]{valueY}[/]\n[font-size: 10]${options.series1.hint}[/]`;
    this.series2.name = options.series2.label;
    this.line.name = options.line.label;
    this.valueAxis.title.text = options.valueAxis.label;
    this.valueAxis2.title.text = options.valueAxis2.label;

    this.dateAxis.gridIntervals.setAll([{ timeUnit, count: 1 }]);

    this.dateAxis.dateFormats.setKey(timeUnit, format);
    this.dateAxis.periodChangeDateFormats.setKey(timeUnit, format);
  }
}

function getComputedColorValue(propertyValue: string) {
  const mockEl = document.createElement('div');
  mockEl.style.color = getComputedStyle(document.documentElement).getPropertyValue(propertyValue).trim();
  document.body.appendChild(mockEl);
  const computedColor = getComputedStyle(mockEl).color;
  document.body.removeChild(mockEl);
  return computedColor;
}
