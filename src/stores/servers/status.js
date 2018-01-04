/* @flow */

import { ServerConnection } from 'perplexed'

import { createFetchMapStore } from '../../templates'

import { FETCH_SERVER_STATUS } from '../../constants'
import { fetchAccountServers } from './account'
import { selectAllConnections } from './connections'
import { selectAllDevices } from './devices'

import type { Account, Server, Connection, ConnectionStatus } from '../../types'

const TIMEOUT = 5 * 1000

async function connect (account: Account, server: Server, connection: Connection): Promise<ConnectionStatus> {
  const serverConnection = new ServerConnection(connection.uri, account)

  try {
    await serverConnection.fetch('/', { timeout: TIMEOUT })
  } catch (error) {
    return {
      available: false,
      server: server.id
    }
  }

  return {
    available: true,
    server: server.id,
    connection: connection.uri,
    serverConnection
  }
}

export function connectMultiple (account: Account, server: Server, connections: Array<Connection>): Promise<ConnectionStatus> {
  if (connections.length <= 0) {
    throw new Error('Must pass at least one connection')
  }

  return new Promise((resolve, reject) => {
    Promise.all(connections.map(async (c) => {
      const connection = await connect(account, server, c)
      if (connection.available) {
        resolve(connection)
      }
      return connection
    })).then((results) => {
      // none of the connections were successful
      resolve(results[0])
    }).catch(reject)
  })
}

const handleFetchServerStatus = (serverId: string) => {
  return async (dispatch, getState) => {
    // make sure all the account servers have been fetched first
    await dispatch(fetchAccountServers())
    const state = getState()
    const allDevices = selectAllDevices.values(state)
    const allConnections = selectAllConnections.values(state)

    const server = allDevices.get(serverId)
    const connections = server.connections.map((id) => allConnections.get(id))

    dispatch({
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
  fetchServerStatus,
  forceFetchServerStatus,
  selectServerStatus
}

export default reducer
