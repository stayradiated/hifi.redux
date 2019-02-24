// @flow

import { ServerConnection } from 'perplexed'
import { timeout } from 'promise-timeout'

import { createFetchMapStore } from '../../templates'

import { FETCH_SERVER_STATUS } from '../../constants'
import { fetchAccountServers } from './account'
import { selectAllConnections } from './connections'
import { selectAllDevices } from './devices'

import type { Account, Server, Connection, ConnectionStatus } from '../../types'

const TIMEOUT = 5 * 1000

async function connect (
  account: Account,
  server: Server,
  connection: Connection
): Promise<ConnectionStatus> {
  const serverConnection = new ServerConnection(connection.uri, account)
  const startTime = Date.now()

  try {
    await timeout(
      serverConnection.fetch('/', {
        timeout: TIMEOUT
      }),
      TIMEOUT
    )
  } catch (error) {
    return {
      connection,
      ping: Infinity,
      available: false,
      server: server.id
    }
  }

  const ping = Date.now() - startTime

  return {
    connection,
    available: true,
    ping,
    server: server.id,
    serverConnection
  }
}

async function connectMultiple (
  account: Account,
  server: Server,
  connections: Array<Connection>
): Promise<ConnectionStatus> {
  if (connections.length <= 0) {
    throw new Error('Must pass at least one connection')
  }

  const results = await Promise.all(
    connections.map(async (c, i) => {
      const result = await connect(
        account,
        server,
        c
      )
      return result
    })
  )

  // sort by ping in ascending order
  results.sort((a, b) => a.ping - b.ping)

  const local = results.find((result) => result.connection.local)
  if (local != null && local.available) {
    return local
  }

  const available = results.find((result) => result.available)
  if (available != null) {
    return available
  }

  return results[0]
}

function handleFetchServerStatus (serverId: string) {
  return async (dispatch, getState) => {
    // make sure all the account servers have been fetched first
    await dispatch(fetchAccountServers())
    const state = getState()
    const allDevices = selectAllDevices.values(state)
    const allConnections = selectAllConnections.values(state)

    const server = allDevices.get(serverId)
    const connections = server.connections.map((id) => allConnections.get(id))

    return dispatch({
      types: FETCH_SERVER_STATUS,
      payload: { id: serverId },
      meta: {
        plex: ({ account }) => connectMultiple(account, server, connections)
      }
    })
  }
}

const store = createFetchMapStore({
  constant: FETCH_SERVER_STATUS,
  rootSelector: (state) => state.servers.status,
  forceFetch: handleFetchServerStatus,
  getCacheOptions: (serverId) => ({
    id: serverId
  })
})

const reducer = store.reducer
const fetchServerStatus = store.fetchMap
const forceFetchServerStatus = store.forceFetch
const selectServerStatus = store.selectors

export {
  connectMultiple,
  fetchServerStatus,
  forceFetchServerStatus,
  selectServerStatus
}

export default reducer
