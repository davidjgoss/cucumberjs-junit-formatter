import test from 'ava'
import { Cli } from '@cucumber/cucumber'
import { PassThrough } from 'stream'
import streamToString from 'stream-to-string'

test('it formats the test run correctly', async (t) => {
  const argv = [
    'node',
    'cucumber-js',
    '--retry',
    '2',
    '--retry-tag-filter',
    '@retry',
    '--format',
    './dist/index.js',
  ]
  const cwd = process.cwd()
  const stdout = new PassThrough()
  const cli = new Cli({ argv, cwd, stdout })
  try {
    await cli.run()
  } catch (ignored) {
    console.error(ignored)
  }
  stdout.end()
  const actual = await streamToString(stdout)
  const normalised = actual
    .replace(new RegExp(cwd, 'g'), '')
    .replace(/time="[\d.]+"/g, 'time="0"')

  t.snapshot(normalised)
})
