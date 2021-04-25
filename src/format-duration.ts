import { Duration, TimeConversion } from '@cucumber/messages'

export function formatDuration(duration: Duration): string {
  return (TimeConversion.durationToMilliseconds(duration) / 1000).toFixed(3)
}
