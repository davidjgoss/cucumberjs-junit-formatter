import {
  Duration,
  Pickle,
  PickleStep,
  Step,
  TestStepResult,
  TestStepResultStatus,
} from '@cucumber/messages'

export interface ComposedStep {
  gherkinStep: Step
  pickleStep: PickleStep
  status: TestStepResultStatus
}

export interface JunitTemplateContext {
  tests: {
    pickle: Pickle
    steps: ComposedStep[]
    duration: Duration
    result: TestStepResult
    failed: boolean
    skipped: boolean
  }[]
  summary: {
    failed: number
    skipped: number
    duration: Duration
  }
}
