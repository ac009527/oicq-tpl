"use strict"
const { segment } = require("oicq")
const { bot, config } = require("./index")

const { getImg, base64ToBuffer } = require('./utils')
const { task } = require('./task')
const { logger } = require('./logger');
const fs = require("fs")
let aiDrawWhitelist = JSON.parse(fs.readFileSync('./aiDrawWhitelist.json').toString())
bot.on("message", async function (msg) {
	console.log(msg.raw_message.startsWith('添加群聊白名单 '), msg.user_id, config.adminIds.includes(msg.user_id))
	const isAdmin = config.adminIds.includes(msg.user_id);
	if (isAdmin) {
		if (msg.raw_message.startsWith('添加群聊白名单 ')) {
			const groupId = msg.raw_message.slice(8);
			aiDrawWhitelist = JSON.parse(fs.readFileSync('./aiDrawWhitelist.json').toString());
			aiDrawWhitelist.groupIds.push(groupId)
			fs.writeFileSync('./aiDrawWhitelist.json', JSON.stringify(aiDrawWhitelist))
			msg.reply(JSON.stringify(aiDrawWhitelist, null, 2), true)
		}
		if (msg.raw_message.startsWith('添加私聊白名单 ')) {
			const privateId = msg.raw_message.slice(8);
			aiDrawWhitelist = JSON.parse(fs.readFileSync('./aiDrawWhitelist.json').toString());
			aiDrawWhitelist.privateIds.push(privateId)
			fs.writeFileSync('./aiDrawWhitelist.json', JSON.stringify(aiDrawWhitelist))
			msg.reply(JSON.stringify(aiDrawWhitelist, null, 2), true)
		}
	}

	if (msg.raw_message.startsWith(config.aiDraw.reply)) {
		const isWhitelist = msg.group_id ? aiDrawWhitelist.groupIds.map(Number).includes(msg.group_id) : aiDrawWhitelist.privateIds.map(Number).includes(msg.user_id)
		if (!isWhitelist) {
			return
		}
		task.push(async (cb) => {
			const prompt = msg.raw_message.slice(config.aiDraw.reply.length)
			const res = await getImg(prompt);
			const images = res.data.images;
			if (!images) {
				msg.reply("error", true)
				logger.error({ prompt, user_id: msg.user_id, status: 'error' })
				cb()
				return
			}
			const imagesBuf = images.map(base64ToBuffer)
			logger.info({ prompt, user_id: msg.user_id, status: 'success' })
			cb()
			msg.reply(segment.image(imagesBuf[0]), true)
		})

	}
})
