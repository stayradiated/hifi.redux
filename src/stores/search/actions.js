/* @flow */

import { normalize } from 'perplexed'

import { FETCH_SEARCH_RESULTS } from '../../constants'

import type { Instance } from '../../types'

const fetchSearchResults = (query: string, limit: number) => ({
  types: FETCH_SEARCH_RESULTS,
  payload: { query, limit },
  meta: {
    plex: ({ library }: Instance) => normalize(library.searchAll(query, limit))
  }
})

export {
  fetchSearchResults
}
