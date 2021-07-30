import { ChartItem, ChartSeriesItem, PortData } from './sandbox.model';

export const createPortData = ({
  links = [],
  nodes = []
}: Partial<PortData> = {}) => ({
  links,
  nodes
});

export const createChartSeriesItem = ({
  name = 'name',
  value = 1
}: Partial<ChartSeriesItem> = {}) => ({
  name,
  value
});

export const createChartItem = ({
  name = 'name',
  series = [createChartSeriesItem()]
}: Partial<ChartItem> = {}) => ({
  name,
  series
});
