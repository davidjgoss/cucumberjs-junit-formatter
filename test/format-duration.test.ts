import test from 'ava'
import { formatDuration } from '../src/format-duration'
import { millisecondsToDuration } from '@cucumber/messages/dist/src/TimeConversion'

test('formats durations as junit-compatible time', (t) => {
  t.deepEqual(formatDuration(millisecondsToDuration(1000)), '1.000')
  t.deepEqual(formatDuration(millisecondsToDuration(1234)), '1.234')
  t.deepEqual(formatDuration({ seconds: 30, nanos: 500001 }), '30.001')
  t.deepEqual(formatDuration({ seconds: 30, nanos: 499999 }), '30.000')
})
