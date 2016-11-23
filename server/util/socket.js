import socketCluster from 'socketcluster-client'

import config from 'src/config'

// TODO: fix this! we're effectively using module caching to create a singleton. yuck.
let socket = null

export function getSocket() {
  if (socket) {
    return socket
  }

  socket = socketCluster.connect({hostname: config.server.sockets.host})
  socket.on('connect', () => console.log('... socket connected'))
  socket.on('disconnect', () => console.log('socket disconnected, will try to reconnect socket ...'))
  socket.on('connectAbort', () => null)
  socket.on('error', error => console.warn(error.message))

  return socket
}