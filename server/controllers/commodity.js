/*
 * 处理commodity请求
 * Created by: Alex.Y
 * /2018/6/19
 */
const {
  Commodity
} = require('../db/models.js')

const add = function add(ctx, next) {
  try {
    let data = ctx.request.body
    const name = data.name
    const price = data.price
    const picUrl = data.picUrl
    const param = data.param
    const discription = data.discription
    const ensure = data.ensure

    const createOpt = {name: name, price: price, picUrl: picUrl}

    if (param) createOpt['param'] = param
    if (discription) createOpt['discription'] = discription
    if (ensure)  createOpt['ensure'] = ensure

    Commodity.create(createOpt).then(data => {
      return next()
    }).catch(err => {
      ctx.state.code = 500
      ctx.state.data = '数据持久化错误'
    })
  } catch (error) {
    ctx.state.code = 500
    ctx.state.data = '系统错误'
  }
}

module.exports = {
  add
}