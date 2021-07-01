import { Pickle } from '@cucumber/messages'

export function compositeName(pickle: Pickle): string {
  return `${pickle.uri}${pickle.name}`
}
