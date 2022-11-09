import { segment } from 'oicq'
import fs from 'fs'
import { getImg, base64ToBuffer } from './utils.js'
import { task } from './task.js'
import { userDb, adminDb, groupWhiteListDb, privateWhiteListDb } from './db.js'
import { isNumber, union } from 'lodash-es'
export default (bot, config) => {
	bot.on("message", async function (msg) {
		const isAdmin = adminDb.data.includes(msg.user_id);
		console.log(isAdmin)
		if (isAdmin) {
			if (msg.raw_message.startsWith('添加群聊白名单 ')) {
				const groupId = Number(msg.raw_message.slice(8));
				console.log(groupId)
				if (!isNumber(groupId)) {
					msg.reply(`${groupId} 不是合法adminid`, true)
					return
				}
				groupWhiteListDb.data = union(groupWhiteListDb.data, [groupId])
				groupWhiteListDb.write()
			}
			if (msg.raw_message.startsWith('删除群聊白名单 ')) {
				const groupId = Number(msg.raw_message.slice(8));
				console.log(groupId)
				if (!isNumber(groupId)) {
					msg.reply(`${groupId} 不是合法adminid`, true)
					return
				}
				groupWhiteListDb.data = groupWhiteListDb.data.filter(v => v !== groupId)
				groupWhiteListDb.write()
			}
			if (msg.raw_message.startsWith('添加私聊白名单 ')) {
				const privateId = Number(msg.raw_message.slice(8));
				if (!isNumber(privateId)) {
					msg.reply(`${privateId} 不是合法adminid`, true)
					return
				}
				privateWhiteListDb.data = union(privateWhiteListDb.data, [privateId])
				privateWhiteListDb.write()
			}

			if (msg.raw_message.startsWith('删除私聊白名单 ')) {
				const privateId = Number(msg.raw_message.slice(8));
				if (!isNumber(privateId)) {
					msg.reply(`${privateId} 不是合法adminid`, true)
					return
				}
				privateWhiteListDb.data = privateWhiteListDb.data.filter(v => v !== privateId)
				privateWhiteListDb.write()
			}
		}

		if (msg.raw_message.startsWith(config.aiDraw.reply)) {
			const isWhitelist = msg.group_id ? groupWhiteListDb.data.includes(msg.group_id) : privateWhiteListDb.data.includes(msg.user_id)
			if (!isWhitelist) {
				return
			}
			task.push(async (cb) => {
				const prompt = msg.raw_message.slice(config.aiDraw.reply.length)
				const res = await getImg(prompt);
				const images = res.data.images;
				if (!images) {
					msg.reply("error", true)
					// logger.error({ prompt, user_id: msg.user_id, status: 'error' })
					cb()
					return
				}
				const imagesBuf = images.map(base64ToBuffer)
				// logger.info({ prompt, user_id: msg.user_id, status: 'success' })
				cb()
				msg.reply(segment.image(imagesBuf[0]), true)
			})

		}
	})

}