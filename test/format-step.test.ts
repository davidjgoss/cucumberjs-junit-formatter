import test from 'ava'
import { formatStep } from '../src/format-step'
import { PickleStep, Step, TestStepResultStatus } from '@cucumber/messages'

test('formats each line to 80ish chars wide', (t) => {
  t.deepEqual(
    [
      {
        gherkinStep: {
          ...new Step(),
          keyword: 'Given ',
        },
        pickleStep: {
          ...new PickleStep(),
          text: 'a thing',
        },
        status: TestStepResultStatus.PASSED,
      },
      {
        gherkinStep: {
          ...new Step(),
          keyword: 'And ',
        },
        pickleStep: {
          ...new PickleStep(),
          text: 'another thing',
        },
        status: TestStepResultStatus.PASSED,
      },
      {
        gherkinStep: {
          ...new Step(),
          keyword: 'And ',
        },
        pickleStep: {
          ...new PickleStep(),
          text: 'a thing that has incredibly long text such that it crosses our normal threshold',
        },
        status: TestStepResultStatus.PASSED,
      },
      {
        gherkinStep: {
          ...new Step(),
          keyword: 'But ',
        },
        pickleStep: {
          ...new PickleStep(),
          text: 'a slightly longer thing',
        },
        status: TestStepResultStatus.FAILED,
      },
    ].map(formatStep),
    [
      'Given a thing.............................................................passed',
      'And another thing.........................................................passed',
      'And a thing that has incredibly long text such that it crosses our norm...passed',
      'But a slightly longer thing...............................................failed',
    ]
  )
})
