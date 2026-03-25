const loverCache = {
  latestMessage: null,
  latestAt: 0,
  refreshing: false,
}

function getCachedLoverMessage(ttlMs) {
  if (!loverCache.latestMessage) return null
  if (Date.now() - loverCache.latestAt >= ttlMs) return null
  return loverCache.latestMessage
}

function setCachedLoverMessage(message) {
  loverCache.latestMessage = message
  loverCache.latestAt = Date.now()
}

function getLatestLoverMessage() {
  return loverCache.latestMessage
}

function isLoverRefreshRunning() {
  return loverCache.refreshing
}

function setLoverRefreshRunning(refreshing) {
  loverCache.refreshing = refreshing
}

function clearLoverCache() {
  loverCache.latestMessage = null
  loverCache.latestAt = 0
  loverCache.refreshing = false
}

export {
  clearLoverCache,
  getCachedLoverMessage,
  getLatestLoverMessage,
  isLoverRefreshRunning,
  setCachedLoverMessage,
  setLoverRefreshRunning,
}