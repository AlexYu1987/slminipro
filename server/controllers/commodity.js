/*
 * 处理commodity请求
 * Created by: Alex.Y (2018/6/19)
 * Updated by: Alex.Y (2018/7/10)
 */
const {
  Commodity
} = require('../db/models.js')

const {
  deleteById
} = require('../service/commodityService.js')

const add = function(ctx, next) {
  try {
    let data = ctx.request.body
    const name = data.name
    const price = data.price
    const picUrl = data.picUrl
    const param = data.param
    const discription = data.discription
    const ensure = data.ensure

    const createOpt = {
      name: name,
      price: price,
      picUrl: picUrl
    }

    if (param) createOpt['param'] = param
    if (discription) createOpt['discription'] = discription
    if (ensure) createOpt['ensure'] = ensure

    return Commodity.create(createOpt).then(data => {
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

const getAll = function(ctx, next) {
  return Commodity.findAll().then(commodities => {
    ctx.state.data = []
    commodities.forEach(c => {
      ctx.state.data.push(c.dataValues)
    })
    ctx.state.code = 200
    return next()
  }).catch(error => {
    ctx.state.code = 500
    ctx.state.data = '数据库错误'
  })
}

const delById = async function(ctx, next) {
  const {
    id
  } = ctx.request.body

  if (!id) {
    throw new Error('缺少参数')
  }

  await deleteById(id)
  await next()
}

module.exports = {
  add,
  getAll,
  delById,
}