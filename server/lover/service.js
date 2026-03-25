import { generateLoverMessage } from '../ai/grok.js'
import {
  getCachedLoverMessage,
  getLatestLoverMessage,
  isLoverRefreshRunning,
  setCachedLoverMessage,
  setLoverRefreshRunning,
} from './cache.js'
import { getRandomFallbackMessage } from './constants.js'
import { getLoverMemoryContext, rememberLoverMessage } from './memory.js'

function withTimeout(promise, ms) {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error('AI_TIMEOUT')), ms)
    promise
      .then((value) => {
        clearTimeout(timer)
        resolve(value)
      })
      .catch((error) => {
        clearTimeout(timer)
        reject(error)
      })
  })
}

async function refreshLoverMessageInBackground(context) {
  if (isLoverRefreshRunning()) return

  setLoverRefreshRunning(true)
  try {
    const result = await generateLoverMessage({
      ...context,
      memory: await getLoverMemoryContext(),
    })
    setCachedLoverMessage(result)
  } catch (error) {
    console.error('[Grok Refresh Error]', error.message)
  } finally {
    setLoverRefreshRunning(false)
  }
}

async function createLoverMessageResponse({ context, forceRefresh, cacheTtlMs, maxWaitMs, forceWaitMs }) {
  const cachedMessage = getCachedLoverMessage(cacheTtlMs)
  if (cachedMessage && !forceRefresh) {
    await rememberLoverMessage(cachedMessage, { userName: context.userName })
    return { ...cachedMessage, source: 'cache' }
  }

  try {
    const waitMs = forceRefresh ? forceWaitMs : maxWaitMs
    const liveMessage = await withTimeout(generateLoverMessage({
      ...context,
      memory: await getLoverMemoryContext(),
    }), waitMs)
    setCachedLoverMessage(liveMessage)
    await rememberLoverMessage(liveMessage, { userName: context.userName })
    return { ...liveMessage, source: forceRefresh ? 'live-forced' : 'live' }
  } catch (error) {
    const latestMessage = getLatestLoverMessage()
    if (latestMessage) {
      refreshLoverMessageInBackground(context)
      await rememberLoverMessage(latestMessage, { userName: context.userName })
      return {
        ...latestMessage,
        source: forceRefresh ? 'stale-cache-forced' : 'stale-cache',
      }
    }

    refreshLoverMessageInBackground(context)
    const fallbackMessage = getRandomFallbackMessage()
    await rememberLoverMessage(fallbackMessage, { userName: context.userName })
    return { ...fallbackMessage, source: 'fallback' }
  }
}

export { createLoverMessageResponse }