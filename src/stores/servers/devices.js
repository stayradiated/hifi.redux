// @flow

import { createPassiveMapStore } from '../../templates'

import { FETCH_ACCOUNT_SERVERS } from '../../constants'

const store = createPassiveMapStore({
  entity: 'devices',
  constants: [FETCH_ACCOUNT_SERVERS.SUCCESS],
  rootSelector: (state) => state.servers.devices,
  mergeOptions: {
    getId: (device) => device.id
  }
})

const reducer = store.reducer
const selectAllDevices = store.selectors

export { selectAllDevices }

export default reducer
