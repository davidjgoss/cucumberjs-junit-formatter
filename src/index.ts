import {Formatter, IFormatterOptions} from '@cucumber/cucumber'
import {
  Duration,
  Envelope,
  getWorstTestStepResult,
  TestCase,
  TestStepResultStatus,
  TimeConversion,
  Timestamp,
} from '@cucumber/messages'
import {Query as GherkinQuery} from '@cucumber/gherkin-utils'
import {Query as CucumberQuery} from '@cucumber/query'
import handlebars from 'handlebars'
import fs from 'fs'
import {JunitTemplateContext} from './types'
import {formatStep} from './format-step'
import {formatDuration} from './format-duration'
import {describeStatus} from './describe-status'
import path from 'path'

const {
  addDurations,
  millisecondsToDuration,
  timestampToMillisecondsSinceEpoch,
} = TimeConversion

const compiler = handlebars.create()
const template = fs.readFileSync(
  path.join(__dirname, '..', 'templates', 'testsuite.hbs'),
  {
    encoding: 'utf-8',
  }
)
compiler.registerHelper('formatDuration', formatDuration)
compiler.registerHelper('formatStep', formatStep)
compiler.registerHelper('describeStatus', describeStatus)
const templateDelegate = compiler.compile<JunitTemplateContext>(template)

export default class JunitFormatter extends Formatter {
  testCases: TestCase[] = []
  gherkinQuery: GherkinQuery = new GherkinQuery()
  cucumberQuery: CucumberQuery = new CucumberQuery()
  start: Timestamp

  constructor(options: IFormatterOptions) {
    super(options)
    options.eventBroadcaster.addListener('envelope', (envelope: Envelope) => {
      this.gherkinQuery.update(envelope)
      this.cucumberQuery.update(envelope)
      if (envelope.testCase) {
        this.testCases.push(envelope.testCase)
      }
      if (envelope.testRunStarted) {
        this.start = envelope.testRunStarted.timestamp
      }
      if (envelope.testRunFinished) {
        const tests = this.testCases.map((testCase) => {
          const pickle = this.gherkinQuery
            .getPickles()
            .find((pickle) => pickle.id === testCase.pickleId)
          const steps = pickle.steps.map((pickleStep) => {
            const gherkinStep = this.gherkinQuery.getStep(
              pickle.uri,
              this.gherkinQuery.getLocation(pickleStep.astNodeIds[0]).line
            )
            const results = this.cucumberQuery.getPickleStepTestStepResults([
              pickleStep.id,
            ])
            /**
             * TODO hack to work around https://github.com/cucumber/common/issues/1533
             * with retry, we'll receive results from _all_ attempts, so we need to get from only
             * the latest attempt, as that is the canonical result (whether passed or failed)
             * fix to @cucumber/query should come via cucumber-js 8.0.0
             */
            const { status } = results[results.length - 1]
            return { gherkinStep, pickleStep, status }
          })
          const results = testCase.testSteps.map((testStep) => {
            const results = this.cucumberQuery.getTestStepResults(testStep.id)
            // TODO same reason as above
            return results[results.length - 1]
          })
          const duration: Duration = results
            .map((result) => result.duration)
            .reduce((d1, d2) => addDurations(d1, d2))
          const result = getWorstTestStepResult(results)
          return {
            identity: {
              uri: pickle.uri,
              name: pickle.name,
            },
            steps,
            duration,
            result,
            failed:
              result.status !== TestStepResultStatus.SKIPPED &&
              result.status !== TestStepResultStatus.PASSED,
            skipped: result.status === TestStepResultStatus.SKIPPED,
          }
        })

        options.log(
          templateDelegate({
            tests,
            summary: {
              failed: tests.filter((test) => test.failed).length,
              skipped: tests.filter((test) => test.skipped).length,
              duration: millisecondsToDuration(
                timestampToMillisecondsSinceEpoch(
                  envelope.testRunFinished.timestamp
                ) - timestampToMillisecondsSinceEpoch(this.start)
              ),
            },
          })
        )
      }
    })
  }
}
