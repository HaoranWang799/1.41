import { mkdir, readFile, writeFile } from 'fs/promises'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const MAX_MEMORY_ITEMS = 6
const __dirname = dirname(fileURLToPath(import.meta.url))
const STORE_PATH = join(__dirname, '../data/virtual-lover-store.json')

const DEFAULT_MEMORY = {
  interactionCount: 0,
  lastMood: '温柔',
  recentMessages: [],
  lastUserName: undefined,
}

let loverMemory = { ...DEFAULT_MEMORY }
let isLoaded = false

async function ensureMemoryLoaded() {
  if (isLoaded) return

  try {
    const raw = await readFile(STORE_PATH, 'utf8')
    const parsed = JSON.parse(raw)
    loverMemory = {
      interactionCount: typeof parsed.interactionCount === 'number' ? parsed.interactionCount : 0,
      lastMood: typeof parsed.lastMood === 'string' ? parsed.lastMood : '温柔',
      recentMessages: Array.isArray(parsed.recentMessages) ? parsed.recentMessages : [],
      lastUserName: typeof parsed.lastUserName === 'string' ? parsed.lastUserName : undefined,
    }
  } catch {
    await persistMemory()
  }

  isLoaded = true
}

async function persistMemory() {
  await mkdir(dirname(STORE_PATH), { recursive: true })
  await writeFile(STORE_PATH, JSON.stringify(loverMemory, null, 2), 'utf8')
}

function getRelationshipStage(interactionCount) {
  if (interactionCount >= 12) return '亲密稳定期'
  if (interactionCount >= 6) return '暧昧升温期'
  if (interactionCount >= 3) return '逐渐熟悉期'
  return '刚开始心动期'
}

async function getLoverMemoryContext() {
  await ensureMemoryLoaded()
  return {
    interactionCount: loverMemory.interactionCount,
    lastMood: loverMemory.lastMood,
    lastUserName: loverMemory.lastUserName,
    recentMessages: [...loverMemory.recentMessages],
    relationshipStage: getRelationshipStage(loverMemory.interactionCount),
  }
}

async function rememberLoverMessage(message, { userName } = {}) {
  await ensureMemoryLoaded()
  if (!message?.text) return

  const lastMessage = loverMemory.recentMessages[loverMemory.recentMessages.length - 1]
  if (lastMessage?.text === message.text) {
    loverMemory.lastMood = message.mood || loverMemory.lastMood
    if (userName) loverMemory.lastUserName = userName
    await persistMemory()
    return
  }

  loverMemory.interactionCount += 1
  loverMemory.lastMood = message.mood || loverMemory.lastMood
  if (userName) loverMemory.lastUserName = userName

  loverMemory.recentMessages.push({
    text: message.text,
    mood: message.mood || '温柔',
    at: Date.now(),
  })

  if (loverMemory.recentMessages.length > MAX_MEMORY_ITEMS) {
    loverMemory.recentMessages = loverMemory.recentMessages.slice(-MAX_MEMORY_ITEMS)
  }

  await persistMemory()
}

async function clearLoverMemory() {
  await ensureMemoryLoaded()
  loverMemory = { ...DEFAULT_MEMORY }
  await persistMemory()
}

export { clearLoverMemory, getLoverMemoryContext, rememberLoverMessage }