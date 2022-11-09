"use strict"
const { createClient } = require("oicq")
const JSON5 = require('json5')
const fs = require('fs')
let config = JSON5.parse(fs.readFileSync('./config.json5').toString())

const bot = createClient(config.account, { platform: config.platform })

bot
	.on("system.login.qrcode", function (e) {
		this.logger.mark("扫码后按Enter完成登录")
		process.stdin.once("data", () => {
			this.login()
		})
	})
	.login()

exports.bot = bot
exports.config = config

setInterval(() => {
	config = JSON5.parse(fs.readFileSync('./config.json5'))
}, 1 * 1000 * 60);
// template plugins
require("./plugin-ai-draw") //ai绘画
require("./plugin-request") //加群和好友
require("./plugin-online") //监听上线事件

process.on("unhandledRejection", (reason, promise) => {
	console.log('Unhandled Rejection at:', promise, 'reason:', reason)
})
