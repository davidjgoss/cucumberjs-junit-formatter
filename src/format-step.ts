import { ComposedStep } from './types'

export function formatStep({
  gherkinStep,
  pickleStep,
  status,
}: ComposedStep): string {
  const leftSide = `${gherkinStep.keyword}${pickleStep.text}`
    .padEnd(71, '.')
    .substr(0, 71)
  const rightSide = `...${status.toLowerCase()}`
  return leftSide + rightSide
}
