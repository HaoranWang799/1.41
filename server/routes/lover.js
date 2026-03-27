/**
 * server/routes/lover.js — Virtual Lover API Routes
 *
 * 路由定义，分发到 controller
 */

import express from 'express'
import { handlePostMessage, handlePostBatch, handleDeleteMemory } from '../controllers/loverController.js'

const router = express.Router()

/**
 * POST /api/lover/message
 * 生成虚拟助手消息
 */
router.post('/message', handlePostMessage)

/**
 * POST /api/lover/batch
 * 批量生成 10 条消息，前端弹药池使用
 */
router.post('/batch', handlePostBatch)

/**
 * DELETE /api/lover/memory
 * 清空所有对话记忆
 */
router.delete('/memory', handleDeleteMemory)

export default router
