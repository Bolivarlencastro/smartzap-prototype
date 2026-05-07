import { DashboardService } from './dashboard.service';

import { DashboardPeriodType } from './dashboard.model';
import { TranslocoService } from '@jsverse/transloco';
import { LearnAnalyticsApi } from '@keeps-platform-frontend-workspace/kp-keeps';

describe('DashboardService', () => {
  let service: DashboardService;
  let learnAnalyticsServiceMock: jest.Mocked<LearnAnalyticsApi>;
  let translateServiceMock: jest.Mocked<TranslocoService>;

  beforeEach(() => {
    learnAnalyticsServiceMock = {} as any;
    translateServiceMock = {
      translate: jest.fn().mockImplementation((value) => value),
    } as any;
    service = new DashboardService(learnAnalyticsServiceMock, translateServiceMock);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should process graphs data for users :: getChartDataUsers()', () => {
    const givenInput = [
      {
        aggs: {
          active_users: { value: 23 },
          activity_histogram: {
            buckets: [
              {
                doc_count: 592,
                key: 1672531200000,
                key_as_string: '2023-01-01T00:00:00.000Z',
                users_per_interval: { value: 9 },
              },
              {
                doc_count: 198,
                key: 1675209600000,
                key_as_string: '2023-02-01T00:00:00.000Z',
                users_per_interval: { value: 8 },
              },
              {
                doc_count: 139,
                key: 1677628800000,
                key_as_string: '2023-03-01T00:00:00.000Z',
                users_per_interval: { value: 11 },
              },
              {
                doc_count: 389,
                key: 1680307200000,
                key_as_string: '2023-04-01T00:00:00.000Z',
                users_per_interval: { value: 9 },
              },
              {
                doc_count: 458,
                key: 1682899200000,
                key_as_string: '2023-05-01T00:00:00.000Z',
                users_per_interval: { value: 7 },
              },
              {
                doc_count: 935,
                key: 1685577600000,
                key_as_string: '2023-06-01T00:00:00.000Z',
                users_per_interval: { value: 15 },
              },
              {
                doc_count: 392,
                key: 1688169600000,
                key_as_string: '2023-07-01T00:00:00.000Z',
                users_per_interval: { value: 8 },
              },
              {
                doc_count: 482,
                key: 1690848000000,
                key_as_string: '2023-08-01T00:00:00.000Z',
                users_per_interval: { value: 10 },
              },
              {
                doc_count: 20,
                key: 1693526400000,
                key_as_string: '2023-09-01T00:00:00.000Z',
                users_per_interval: { value: 5 },
              },
            ],
          },
          avg_users_per_interval: { value: 9.11111111111111 },
          total: { value: 3605 },
        },
        data: [],
        total: 3605,
      },
      {
        aggs: {
          active_users: { value: 16 },
          activity_histogram: {
            buckets: [
              {
                doc_count: 32,
                key: 1640995200000,
                key_as_string: '2022-01-01T00:00:00.000Z',
                users_per_interval: { value: 2 },
              },
              {
                doc_count: 53,
                key: 1643673600000,
                key_as_string: '2022-02-01T00:00:00.000Z',
                users_per_interval: { value: 1 },
              },
              {
                doc_count: 60,
                key: 1646092800000,
                key_as_string: '2022-03-01T00:00:00.000Z',
                users_per_interval: { value: 4 },
              },
              {
                doc_count: 34,
                key: 1648771200000,
                key_as_string: '2022-04-01T00:00:00.000Z',
                users_per_interval: { value: 3 },
              },
              {
                doc_count: 52,
                key: 1651363200000,
                key_as_string: '2022-05-01T00:00:00.000Z',
                users_per_interval: { value: 4 },
              },
              {
                doc_count: 42,
                key: 1654041600000,
                key_as_string: '2022-06-01T00:00:00.000Z',
                users_per_interval: { value: 4 },
              },
              {
                doc_count: 22,
                key: 1656633600000,
                key_as_string: '2022-07-01T00:00:00.000Z',
                users_per_interval: { value: 3 },
              },
              {
                doc_count: 101,
                key: 1659312000000,
                key_as_string: '2022-08-01T00:00:00.000Z',
                users_per_interval: { value: 8 },
              },
              {
                doc_count: 141,
                key: 1661990400000,
                key_as_string: '2022-09-01T00:00:00.000Z',
                users_per_interval: { value: 5 },
              },
              {
                doc_count: 53,
                key: 1664582400000,
                key_as_string: '2022-10-01T00:00:00.000Z',
                users_per_interval: { value: 6 },
              },
              {
                doc_count: 84,
                key: 1667260800000,
                key_as_string: '2022-11-01T00:00:00.000Z',
                users_per_interval: { value: 8 },
              },
              {
                doc_count: 177,
                key: 1669852800000,
                key_as_string: '2022-12-01T00:00:00.000Z',
                users_per_interval: { value: 6 },
              },
            ],
          },
          avg_users_per_interval: { value: 4.5 },
          total: { value: 851 },
        },
        data: [],
        total: 851,
      },
      {
        aggs: {
          buckets: [
            { doc_count: 4, key: 1672531200000, key_as_string: '2023-01-01T00:00:00.000Z' },
            { doc_count: 24, key: 1675209600000, key_as_string: '2023-02-01T00:00:00.000Z' },
            { doc_count: 9, key: 1677628800000, key_as_string: '2023-03-01T00:00:00.000Z' },
            { doc_count: 6, key: 1680307200000, key_as_string: '2023-04-01T00:00:00.000Z' },
            { doc_count: 15, key: 1682899200000, key_as_string: '2023-05-01T00:00:00.000Z' },
            { doc_count: 3, key: 1685577600000, key_as_string: '2023-06-01T00:00:00.000Z' },
            { doc_count: 12, key: 1688169600000, key_as_string: '2023-07-01T00:00:00.000Z' },
            { doc_count: 14, key: 1690848000000, key_as_string: '2023-08-01T00:00:00.000Z' },
            { doc_count: 7, key: 1693526400000, key_as_string: '2023-09-01T00:00:00.000Z' },
          ],
        },
        data: [],
        total: 94,
      },
      {
        aggs: {
          buckets: [
            { doc_count: 5, key: 1640995200000, key_as_string: '2022-01-01T00:00:00.000Z' },
            { doc_count: 9, key: 1643673600000, key_as_string: '2022-02-01T00:00:00.000Z' },
            { doc_count: 21, key: 1646092800000, key_as_string: '2022-03-01T00:00:00.000Z' },
            { doc_count: 5, key: 1648771200000, key_as_string: '2022-04-01T00:00:00.000Z' },
            { doc_count: 9, key: 1651363200000, key_as_string: '2022-05-01T00:00:00.000Z' },
            { doc_count: 22, key: 1654041600000, key_as_string: '2022-06-01T00:00:00.000Z' },
            { doc_count: 7, key: 1656633600000, key_as_string: '2022-07-01T00:00:00.000Z' },
            { doc_count: 24, key: 1659312000000, key_as_string: '2022-08-01T00:00:00.000Z' },
            { doc_count: 12, key: 1661990400000, key_as_string: '2022-09-01T00:00:00.000Z' },
            { doc_count: 10, key: 1664582400000, key_as_string: '2022-10-01T00:00:00.000Z' },
            { doc_count: 37, key: 1667260800000, key_as_string: '2022-11-01T00:00:00.000Z' },
            { doc_count: 15, key: 1669852800000, key_as_string: '2022-12-01T00:00:00.000Z' },
          ],
        },
        data: [],
        total: 176,
      },
      {
        aggs: {
          buckets: [
            { doc_count: 1, key: 1633046400000, key_as_string: '2021-10-01T00:00:00.000Z' },
            { doc_count: 12, key: 1635724800000, key_as_string: '2021-11-01T00:00:00.000Z' },
            { doc_count: 13, key: 1638316800000, key_as_string: '2021-12-01T00:00:00.000Z' },
            { doc_count: 5, key: 1640995200000, key_as_string: '2022-01-01T00:00:00.000Z' },
            { doc_count: 9, key: 1643673600000, key_as_string: '2022-02-01T00:00:00.000Z' },
            { doc_count: 21, key: 1646092800000, key_as_string: '2022-03-01T00:00:00.000Z' },
            { doc_count: 5, key: 1648771200000, key_as_string: '2022-04-01T00:00:00.000Z' },
            { doc_count: 9, key: 1651363200000, key_as_string: '2022-05-01T00:00:00.000Z' },
            { doc_count: 22, key: 1654041600000, key_as_string: '2022-06-01T00:00:00.000Z' },
            { doc_count: 7, key: 1656633600000, key_as_string: '2022-07-01T00:00:00.000Z' },
            { doc_count: 24, key: 1659312000000, key_as_string: '2022-08-01T00:00:00.000Z' },
            { doc_count: 12, key: 1661990400000, key_as_string: '2022-09-01T00:00:00.000Z' },
            { doc_count: 10, key: 1664582400000, key_as_string: '2022-10-01T00:00:00.000Z' },
            { doc_count: 37, key: 1667260800000, key_as_string: '2022-11-01T00:00:00.000Z' },
            { doc_count: 15, key: 1669852800000, key_as_string: '2022-12-01T00:00:00.000Z' },
            { doc_count: 4, key: 1672531200000, key_as_string: '2023-01-01T00:00:00.000Z' },
            { doc_count: 24, key: 1675209600000, key_as_string: '2023-02-01T00:00:00.000Z' },
            { doc_count: 9, key: 1677628800000, key_as_string: '2023-03-01T00:00:00.000Z' },
            { doc_count: 6, key: 1680307200000, key_as_string: '2023-04-01T00:00:00.000Z' },
            { doc_count: 15, key: 1682899200000, key_as_string: '2023-05-01T00:00:00.000Z' },
            { doc_count: 3, key: 1685577600000, key_as_string: '2023-06-01T00:00:00.000Z' },
            { doc_count: 12, key: 1688169600000, key_as_string: '2023-07-01T00:00:00.000Z' },
            { doc_count: 14, key: 1690848000000, key_as_string: '2023-08-01T00:00:00.000Z' },
            { doc_count: 7, key: 1693526400000, key_as_string: '2023-09-01T00:00:00.000Z' },
          ],
        },
        data: [],
        total: 312,
      },
      {
        aggs: {
          buckets: [
            { doc_count: 1, key: 1633046400000, key_as_string: '2021-10-01T00:00:00.000Z' },
            { doc_count: 12, key: 1635724800000, key_as_string: '2021-11-01T00:00:00.000Z' },
            { doc_count: 13, key: 1638316800000, key_as_string: '2021-12-01T00:00:00.000Z' },
            { doc_count: 5, key: 1640995200000, key_as_string: '2022-01-01T00:00:00.000Z' },
            { doc_count: 9, key: 1643673600000, key_as_string: '2022-02-01T00:00:00.000Z' },
            { doc_count: 21, key: 1646092800000, key_as_string: '2022-03-01T00:00:00.000Z' },
            { doc_count: 5, key: 1648771200000, key_as_string: '2022-04-01T00:00:00.000Z' },
            { doc_count: 9, key: 1651363200000, key_as_string: '2022-05-01T00:00:00.000Z' },
            { doc_count: 22, key: 1654041600000, key_as_string: '2022-06-01T00:00:00.000Z' },
            { doc_count: 7, key: 1656633600000, key_as_string: '2022-07-01T00:00:00.000Z' },
            { doc_count: 24, key: 1659312000000, key_as_string: '2022-08-01T00:00:00.000Z' },
            { doc_count: 12, key: 1661990400000, key_as_string: '2022-09-01T00:00:00.000Z' },
            { doc_count: 10, key: 1664582400000, key_as_string: '2022-10-01T00:00:00.000Z' },
            { doc_count: 37, key: 1667260800000, key_as_string: '2022-11-01T00:00:00.000Z' },
            { doc_count: 15, key: 1669852800000, key_as_string: '2022-12-01T00:00:00.000Z' },
          ],
        },
        data: [],
        total: 202,
      },
      { interval: 'month', start_date: '2023-01-01', end_date: '2023-12-31' },
      { interval: 'month', start_date: '2022-01-01', end_date: '2022-12-31' },
    ];

    const expectedOutput = {
      chartData: [
        { date: '2020-01-01', series2: 2, series1: 9, series3: 4, series4: 5 },
        { date: '2020-02-01', series2: 1, series1: 8, series3: 24, series4: 9 },
        { date: '2020-03-01', series2: 4, series1: 11, series3: 9, series4: 21 },
        { date: '2020-04-01', series2: 3, series1: 9, series3: 6, series4: 5 },
        { date: '2020-05-01', series2: 4, series1: 7, series3: 15, series4: 9 },
        { date: '2020-06-01', series2: 4, series1: 15, series3: 3, series4: 22 },
        { date: '2020-07-01', series2: 3, series1: 8, series3: 12, series4: 7 },
        { date: '2020-08-01', series2: 8, series1: 10, series3: 14, series4: 24 },
        { date: '2020-09-01', series2: 5, series1: 5, series3: 7, series4: 12 },
        { date: '2020-10-01', series2: 6, series1: 0, series3: 0, series4: 10 },
        { date: '2020-11-01', series2: 8, series1: 0, series3: 0, series4: 37 },
        { date: '2020-12-01', series2: 6, series1: 0, series3: 0, series4: 15 },
      ],
      widget1: {
        title: 'DASHBOARD.WIDGETS.NEW_USERS.TITLE',
        subtitle: 'DASHBOARD.WIDGETS.NEW_USERS.SUBTITLE',
        value: 94,
        target: -46.590909090909086,
      },
      widget2: {
        title: 'DASHBOARD.WIDGETS.ACTIVE_USERS.TITLE',
        subtitle: 'DASHBOARD.WIDGETS.ACTIVE_USERS.SUBTITLE',
        value: 23,
        target: 43.75,
      },
      widget3: {
        title: 'DASHBOARD.WIDGETS.TOTAL_USERS.TITLE',
        subtitle: 'DASHBOARD.WIDGETS.TOTAL_USERS.SUBTITLE',
        value: 312,
        target: 54.45544554455446,
      },
    };

    const output = service.getChartDataUsers(givenInput, DashboardPeriodType.YEAR, DashboardPeriodType);

    expect(output).toStrictEqual(expectedOutput);
  });
});
