/* @flow */

import '@babel/polyfill'

import middleware from './middleware'
import createRootReducer from './stores'
import initializePlex from './initializePlex'

export * from './stores'
export * from './constants'

export {
  initializePlex,
  middleware,
  createRootReducer
}
