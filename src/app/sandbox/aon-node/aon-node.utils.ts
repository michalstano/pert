import { AoNData, AoNDataString } from '../+state/sandbox.model';

export function convertAoNDataToNumbers(aonData: AoNDataString): AoNData {
  const earliestStart = parseInt(aonData.earliestStart);
  const duration = parseInt(aonData.duration);
  const earliestFinish = parseInt(aonData.earliestFinish);
  const latestStart = parseInt(aonData.latestStart);
  const float = parseInt(aonData.float);
  const latestFinish = parseInt(aonData.latestFinish);

  const getValue = (value: number) => (isNaN(value) ? undefined : value);

  return {
    ...aonData,
    earliestStart: getValue(earliestStart),
    duration: getValue(duration),
    earliestFinish: getValue(earliestFinish),
    latestStart: getValue(latestStart),
    float: getValue(float),
    latestFinish: getValue(latestFinish)
  };
}

export function convertAoNDataToStrings(aonData: AoNData): AoNDataString {
  return {
    ...aonData,
    earliestStart: aonData.earliestStart?.toString(),
    duration: aonData.duration?.toString(),
    earliestFinish: aonData.earliestFinish?.toString(),
    latestStart: aonData.latestStart?.toString(),
    float: aonData.float?.toString(),
    latestFinish: aonData.latestFinish?.toString()
  };
}
