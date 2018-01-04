/* @flow */

import { cacheValue } from '@stayradiated/mandarin'

import { FETCH_LIBRARY_SECTIONS } from '../../../constants'
import * as selectors from './selectors'

import type { Instance } from '../../../types'

const forceFetchLibrarySections = () => ({
  types: FETCH_LIBRARY_SECTIONS,
  meta: {
    plex: ({ library }: Instance) => library.sections()
  }
})

const fetchLibrarySections = cacheValue(() => ({
  selectors,
  dispatch: forceFetchLibrarySections
}))

export {
  fetchLibrarySections,
  forceFetchLibrarySections
}
