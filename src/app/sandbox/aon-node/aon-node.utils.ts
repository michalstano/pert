import { AoNData } from '../+state/sandbox.model';

export function convertAoNData(aonData: AoNData): AoNData {
  return {
    ...aonData,
    earliestStart: +aonData.earliestStart,
    duration: +aonData.duration,
    earliestFinish: +aonData.earliestFinish,
    latestStart: +aonData.latestStart,
    float: +aonData.float,
    latestFinish: +aonData.latestFinish
  };
}
