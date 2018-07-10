/*
 * Order service controller
 * Created by: Alex.Y (2018/6/28)
 * Updated by:
 */
const {
  Sequelize,
  sequelize,
  Order,
  User,
  Commodity,
  Details,
  Address
} = require('../db/models.js')

const {
  rollbackOrder,
  doOrder,
  pagedQuery,
} = require('../service/orderService.js')

const add = async function(ctx, next) {
  //Get openId from Session and search userInfo
  let openId = ctx.header['openid']
  if (!openId) throw new Error('未登录')

  //Use discount to calculate total cost, then serialize order
  let details = ctx.request.body.details || [],
    total = 0,
    address = ctx.request.body.address
  let comIds = []
  details.forEach(detail => {
    comIds.push(detail.commodityId)
  })
  //Get transaction


  //Get commodities to calculate total cost, client cost can
  //not be trust
  let modelArr = await Commodity.findAll({
    where: {
      id: {
        [Sequelize.Op.in]: comIds
      }
    },
    attributes: ['id', 'price']
  })
  //Total cost
  let commodities = modelArr.map(v => {
    return v.dataValues
  })
  commodities.forEach(c => {
    let d = details.find(v => {
      return v.commodityId == c.id
    })
    total += c.price * d.count
  })

  let uModel = await User.findOne({
    where: {
      openId: openId
    },
    attributes: ['discount', 'balance']
  })
  let user = uModel.dataValues
  total = total * user.discount
  //Throw Error
  if (user.balance < total) throw Error('余额不足')

  let t = await sequelize.transaction()
  try {
    //insert address
    let addressModel = await Address.create({
      name: address['userName'],
      province: address['provinceName'],
      city: address['cityName'],
      distribute: address['countyName'],
      street: address['detailInfo'],
      poscode: address['postalCode'],
      phone: address['telNumber']
    }, {
      transaction: t
    })
    address = addressModel.dataValues

    //insert order
    let orderModel = await Order.create({
      total: total,
      userOpenId: openId,
      addressId: address.id
    }, {
      transaction: t
    })
    let order = orderModel.dataValues

    //update balance
    await User.update({
      balance: user.balance - total
    }, {
      where: {
        openId: openId
      },
      transaction: t
    })

    //Add details
    let detailsArr = []
    details.forEach(d => {
      detailsArr.push({
        commodityId: d.commodityId,
        count: d.count,
        orderId: order.id
      })
    })
    await Details.bulkCreate(detailsArr, {
      transaction: t
    })
    //commit transaction
    await t.commit()
    user.balance = user.balance - total
    ctx.state.code = 200
    ctx.state.data = user

  } catch (error) {
    //rollback transaction
    t.rollback()
    throw new Error('生成订单失败')
  }

  await next()
}

const query = async function(ctx, next) {
  const userOpenId = ctx.request.query.userOpenId
  const condition = ctx.request.query.condition
  const offset = Number.parseInt(ctx.request.query.offset)
  const limit = Number.parseInt(ctx.request.query.limit)

  const opt = {
    where: {},
    order: [
      ['createdAt']
    ],
    include: [{
      model: Details,
      include: [Commodity]
    }, {
      model: Address
    }]
  }

  if (userOpenId) {
    opt.where.userOpenId = userOpenId
  }

  if(condition) {
    opt.where.status = condition
  }

  if (typeof limit == 'number' && typeof offset == 'number') {
    opt.limit = limit
    opt.offset = offset
  }

  try {
    const models = await Order.findAll(opt)
    const orders = models.map(order => {
      const details = order.details.map(detail => {
        const tmp = detail.commodity
        detail = detail.dataValues
        detail.commodity = tmp.dataValues
        return detail
      })
      const address = order.address.dataValues
      order = order.dataValues
      order.details = details
      order.address = address
      return order
    })
    ctx.state.data = orders
  } catch (err) {
    throw new Error('数据库异常')
  }
  await next()
}

/**
 * Count orders which is waitting to process
 */
const countUncomplite = async function(ctx, next) {
  try {
    const userOpenId = ctx.request.query.userOpenId
    const where = {
      status: 'waitting'
    }
    if (userOpenId) where.userOpenId = userOpenId

    const number = await Order.count({
      where: where
    })
    ctx.state.data = number

  } catch (err) {
    ctx.status = 500
    throw new Error('数据库异常')
  }
  await next()
}

/**
 * Query all user's order information
 */
const queryAll = async function(ctx, next) {
  const {status, offset, limit, order, openId, orderBy} = ctx.request.query

  if (typeof(Number.parseInt(offset)) != 'number' || typeof(Number.parseInt(limit)) != 'number') {
    throw new Error('缺少参数或参数类型错误')
  }

  if(typeof(orderBy) == 'string') {
    orderBy = orderBy.split(' ', 2)
  }

  const orders = await pagedQuery(offset, limit, status, null, orderBy)
  ctx.state.data = orders
  await next()
}

/**
 * Process the order
 */
const deliver = async function(ctx, next) {
  const {orderId, company, num, fee} = ctx.request.query
  if(!orderId || !company) {
    throw new Error('缺少参数')
  }

  if (fee && typeof fee != 'number') {
    throw new Error('参数类型错误')
  }

  await doOrder(orderId, company, num, fee)
  await next()
}

/**
 * Cancel the order
 */
const rollback = async function(ctx, next) {
  const orderId = ctx.request.query.orderId
  if (!orderId) {
    throw new Error('缺少参数')
  }

  await rollbackOrder(orderId)
  await next()
}

module.exports = {
  add,
  query,
  countUncomplite,
  deliver,
  rollback,
  queryAll,
}