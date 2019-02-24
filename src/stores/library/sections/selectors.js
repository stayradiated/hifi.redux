// @flow

import { createValueSelector } from '@stayradiated/mandarin'

const selectors = createValueSelector((state) => state.library.sections)

const error = selectors.error
const fetched = selectors.fetched
const promise = selectors.promise
const value = selectors.value

export { error, fetched, promise, value }
