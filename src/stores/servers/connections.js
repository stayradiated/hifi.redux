/* @flow */

import { createPassiveMapStore } from '../../templates'

import { FETCH_ACCOUNT_SERVERS } from '../../constants'

const store = createPassiveMapStore({
  entity: 'connections',
  constants: [FETCH_ACCOUNT_SERVERS.SUCCESS],
  rootSelector: (state) => state.servers.connections,
  mergeOptions: {
    getId: (conn) => conn.uri
  }
})

const reducer = store.reducer
const selectAllConnections = store.selectors

export {
  selectAllConnections
}

export default reducer
