// @flow

import { normalize } from 'perplexed'

import { createFetchValueStore } from '../../templates'

import { FETCH_ACCOUNT_SERVERS } from '../../constants'

const store = createFetchValueStore({
  constant: FETCH_ACCOUNT_SERVERS,
  rootSelector: (state) => state.servers.account,
  getActionOptions: () => ({
    meta: {
      plex: ({ account }) => normalize(account.servers())
    }
  }),
  reducerOptions: {
    defaultValue: [],
    getValue: (action) => action.value.result.id.devices
  }
})

const reducer = store.reducer
const fetchAccountServers = store.fetchValue
const forceFetchAccountServers = store.forceFetchValue
const selectAccountServers = store.selectors

export { fetchAccountServers, forceFetchAccountServers, selectAccountServers }

export default reducer
