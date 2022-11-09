"use strict"
const { bot, config } = require("./index")

// 同意好友申请
bot.on("request.friend", e => { 
    e.approve(!!config['request.friend']) 
})

// 同意群邀请
bot.on("request.group.invite", e => { 
    e.approve(!!config['request.group.invite']) 
})

// 同意加群申请，拒绝`e.approve(false)`
// bot.on("request.group.add", e => { 
//     e.approve(!!config['request.friend']) 
// })