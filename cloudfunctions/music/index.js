// 云函数入口文件
const cloud = require('wx-server-sdk')
const TcbRouter = require('tcb-router')
const rp = require('request-promise')
const BASE_URL = 'http://47.94.251.164:3000'

cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
  const app = new TcbRouter({event})

  app.router('playlist', async (ctx, next) => {
    ctx.body = await cloud.database().collection('playlist')
      .skip(event.start)
      .limit(event.count)
      .orderBy('createTime', 'desc')
      .get()
      .then((res) => {
        return res
      })
  })

  app.router('musiclist', async (ctx, next) => {
    ctx.body = await rp(`${BASE_URL}/playlist/detail?id=${parseInt(event.playlistId)}`).then(res => {
      return JSON.parse(res)
    })
  })

  app.router('bannerList', async (ctx, next) => {
    ctx.body = await rp(`${BASE_URL}/banner?type=2`).then(res => {
      return JSON.parse(res)
    })
  })

  return app.serve()
}