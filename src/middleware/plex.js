// @flow

import { selectPlex } from '../stores/plex/instance'

import type { ReduxAction, ReduxStore } from '../types'

export default function plexMiddleware (store: ReduxStore) {
  return (next: Function) => (action: ReduxAction) => {
    if (action == null || action.meta == null || action.meta.plex == null) {
      return next(action)
    }

    const plex = selectPlex.root(store.getState())
    action.meta.async = action.meta.plex(plex)

    return next(action)
  }
}
