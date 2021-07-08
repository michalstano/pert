import { Edge, Node } from '@swimlane/ngx-graph';

export interface AoNData {
  earliestStart: number;
  duration: number;
  earliestFinish: number;
  name: string;
  latestStart: number;
  float: number;
  latestFinish: number;
}

export interface ConnectionProcess {
  firstId?: string;
  secondId?: string;
}

export interface PortData {
  nodes: Node[];
  links: Edge[];
}

export enum EscapeEvent {
  connectionMode = 'CONNECTION_MODE',
  editMode = 'EDIT_MODE',
  selectionMode = 'SELECTION_MODE',
  empty = 'EMPTY'
}
