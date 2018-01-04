/* @flow */

import { cacheValue } from '@stayradiated/mandarin'

import { FETCH_LIBRARY_SECTIONS } from '../../../constants'
import * as selectors from './selectors'

import type { Instance } from '../../../types'

export const forceFetchLibrarySections = () => ({
  types: FETCH_LIBRARY_SECTIONS,
  meta: {
    plex: ({ library }: Instance) => library.sections()
  }
})

export const fetchLibrarySections = cacheValue(() => ({
  selectors,
  dispatch: forceFetchLibrarySections
}))
