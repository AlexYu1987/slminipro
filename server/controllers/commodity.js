/*
 * 处理commodity请求
 * Created by: Alex.Y
 * /2018/6/19
 */
const {Commodity:commodity} = require('../db/models.js')

async function get(ctx, next) {
  let id = ctx.param.id
  if (id) {
    ctx.body = await Commodity.findById(id)
  } else {
    ctx.body = await Commodity.findAll({attributes: ['id', 'name', 'smallPic', 'price']})
  }
  ctx.response.status = 200
  ctx.type = 'application/json; charset=utf-8'
}

module.exports = {get}