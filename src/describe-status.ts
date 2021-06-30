import { TestStepResultStatus } from '@cucumber/messages'

const DESCRIPTIONS: Record<TestStepResultStatus, string> = {
  UNKNOWN: `A result couldn't be established`,
  PASSED: 'Everything went fine',
  SKIPPED: 'The test case was skipped',
  PENDING: 'A step in the test case is not yet implemented',
  UNDEFINED: 'A step in the test case is not defined',
  AMBIGUOUS: 'Multiple definitions match one of the steps in the test case',
  FAILED: 'A hook or step failed',
}

export function describeStatus(status: TestStepResultStatus): string {
  return DESCRIPTIONS[status]
}
