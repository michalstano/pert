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
