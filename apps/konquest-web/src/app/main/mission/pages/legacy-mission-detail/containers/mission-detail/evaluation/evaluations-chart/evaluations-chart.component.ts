import {
  ChangeDetectionStrategy,
  Component,
  Inject,
  InjectionToken,
  Input,
  NgZone,
  OnDestroy,
  PLATFORM_ID,
} from '@angular/core';
import { EvaluationSummary } from '@core/model/evaluation.model';
import type { PieChart } from '@amcharts/amcharts4/charts';
import * as am4charts from '@amcharts/amcharts4/charts';
import * as am4core from '@amcharts/amcharts4/core';
import am4themes_animated from '@amcharts/amcharts4/themes/animated';
import { isPlatformBrowser } from '@angular/common';
import { TranslocoService, TranslocoPipe } from '@jsverse/transloco';
import { MatTooltip } from '@angular/material/tooltip';

@Component({
  selector: 'app-evaluations-chart',
  template: `
    <div
      [matTooltip]="'MISSION.DETAIL.EVALUATIONS.COLLECTION.CHART' | transloco"
      id="chartdiv"
      class="w-full h-50"
    ></div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatTooltip, TranslocoPipe],
})
export class EvaluationsChartComponent implements OnDestroy {
  private chart!: PieChart;

  @Input() set summary(summary: EvaluationSummary) {
    if (summary?.nps) {
      this.initChart(summary);
    }
  }

  constructor(
    @Inject(PLATFORM_ID) private platformId: InjectionToken<unknown>,
    private zone: NgZone,
    private _translateService: TranslocoService,
  ) {}

  private initChart(summary: EvaluationSummary) {
    this.browserOnly(() => {
      am4core?.useTheme(am4themes_animated);

      const chart = am4core?.create('chartdiv', am4charts.PieChart);

      chart.paddingRight = 20;

      chart.data = [
        {
          type: this._translateService.translate('MISSION.DETAIL.EVALUATIONS.COLLECTION.PROMOTERS'),
          value: summary.nps.promoters.count,
        },
        {
          type: this._translateService.translate('MISSION.DETAIL.EVALUATIONS.COLLECTION.NEUTRALS'),
          value: summary.nps.neutrals.count,
        },
        {
          type: this._translateService.translate('MISSION.DETAIL.EVALUATIONS.COLLECTION.DETRACTORS'),
          value: summary.nps.detractors.count,
        },
      ];

      // Add and configure Series
      const pieSeries = chart.series.push(new am4charts.PieSeries());
      pieSeries.dataFields.value = 'value';
      pieSeries.dataFields.category = 'type';
      pieSeries.innerRadius = am4core?.percent(55);
      pieSeries.ticks.template.disabled = true;
      pieSeries.labels.template.disabled = true;
      pieSeries.colors.list = [am4core?.color('#4caf50'), am4core?.color('#ffc107'), am4core?.color('#f44336')];
      const label = pieSeries.createChild(am4core?.Label);
      label.text = `${summary.nps.value}`;
      label.horizontalCenter = 'middle';
      label.verticalCenter = 'middle';
      label.fontSize = 20;
      label.fontWeight = '700';

      this.chart = chart;
    });
  }

  browserOnly(f: () => void) {
    if (isPlatformBrowser(this.platformId)) {
      this.zone.runOutsideAngular(() => {
        f();
      });
    }
  }

  ngOnDestroy() {
    this.browserOnly(() => {
      if (this.chart) {
        this.chart.dispose();
      }
    });
  }
}
