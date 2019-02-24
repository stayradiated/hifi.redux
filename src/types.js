// @flow

/** * perplexed ***/

export type Library = {
  sections: Function,
  timeline: Function,
  rate: Function,
  searchAll: Function,
  playQueue: Function,
  createQueue: Function,
  metadataChildren: Function,
  metadata: Function,
  editPlaylistTitle: Function,
  removeFromPlaylist: Function,
  addToPlaylist: Function
}

export type ServerConnection = {}

export type Account = {
  authenticate: Function,
  requestPin: Function,
  checkPin: Function
}

export type Server = {
  id: string
}

export type Connection = {
  address: string,
  local: boolean,
  port: string,
  protocol: string,
  uri: string
}

export type ConnectionStatus = {
  available: boolean,
  server: string,
  connection?: Connection,
  serverConnection?: ServerConnection
}

export type Track = {}

export type QueueItem = {
  id: string,
  track: Track
}

/** * mandarin ***/

export type Dispatch = (any) => any

export type GetState = () => Object

export type ReduxStore = {
  getState: GetState
}

export type ReduxAction = {
  type: string,
  payload: any,
  value: any,
  meta: any,
  error?: Error
}

export type ReduxType = {
  REQUEST: string,
  FAILURE: string,
  SUCCESS: string
}

/** * hifi.kitchen ***/

export type Instance = {
  ready: boolean,
  client: Client,
  account: Account,
  serverConnection: ServerConnection,
  library: Library,
  serverId: string,
  libarySectionId: string
}
