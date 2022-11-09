import { createClient } from 'oicq'
import JSON5 from 'json5'
import fs from 'fs'
import path from 'path'
import aiDrawPlugin from './plugin-ai-draw.js'
import { fileURLToPath } from 'node:url'
// Extend Low class with a new `chain` field
const __dirname = path.dirname(fileURLToPath(import.meta.url))
let config = JSON5.parse(fs.readFileSync(path.join(__dirname, '../config/config.json')).toString())

const bot = createClient(config.account, { platform: config.platform })

bot
	.on("system.login.qrcode", function (e) {
		this.logger.mark("扫码后按Enter完成登录")
		process.stdin.once("data", () => {
			this.login()
		})
	})
	.login()


aiDrawPlugin(bot, config) //ai绘画
// require("../plugin-request") //加群和好友
// require("../plugin-online") //监听上线事件

process.on("unhandledRejection", (reason, promise) => {
	console.log('Unhandled Rejection at:', promise, 'reason:', reason)
})
export { config }