/* @flow */

import { selectPlex } from '../stores/plex/instance'

import type { ReduxAction, ReduxStore } from '../types'

export default function plexMiddleware (store: ReduxStore) {
  return (next: Function) => (action: ReduxAction) => {
    if (!action || !action.meta || !('plex' in action.meta)) {
      return next(action)
    }

    const plex = selectPlex.root(store.getState())
    action.meta.async = action.meta.plex(plex)

    return next(action)
  }
}
