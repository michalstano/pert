import { Edge, Node } from '@swimlane/ngx-graph';

export interface AoNData {
  earliestStart: number | undefined;
  duration: number | undefined;
  earliestFinish: number | undefined;
  name: string | undefined;
  latestStart: number | undefined;
  float: number | undefined;
  latestFinish: number | undefined;
}

export interface AoNDataString {
  earliestStart: string | undefined;
  duration: string | undefined;
  earliestFinish: string | undefined;
  name: string | undefined;
  latestStart: string | undefined;
  float: string | undefined;
  latestFinish: string | undefined;
}

export interface ConnectionProcess {
  firstId?: string;
  secondId?: string;
}

export interface PortData {
  nodes: Node[];
  links: Edge[];
}

export interface ChartSeriesItem {
  name: string;
  value: number;
}
export interface ChartItem {
  name: string;
  series: ChartSeriesItem[];
}

export enum EscapeEvent {
  connectionMode = 'CONNECTION_MODE',
  editMode = 'EDIT_MODE',
  nodeSelectionMode = 'NODE_SELECTION_MODE',
  linkSelectionMode = 'LINK_SELECTION_MODE',
  empty = 'EMPTY'
}
