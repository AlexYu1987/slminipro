/**
 *  Order service 
 *  Use Sequelize model to oprate database.
 *  Created by: Alex.Y (2018/7/4)
 *  Update by: Alex.Y (2018/7/10)
 */

const {
  Sequelize,
  sequelize,
  Order,
  User,
  Commodity,
  Details,
  Address,
  Express
} = require('../db/models.js')

/**
 *  Do order
 *  Add express infomation and update express id to order,if give a fee, update user's balance and orders total
 *  @Param orderId(required)
 *  @Param company(required)
 *  @Param num (optional) 
 *  @Param fee (optional)
 *  @Param transaction (optional)
 */
const doOrder = async function(orderId, company, num, fee, transaction) {
  if (!orderId || !company) throw new Error('缺少参数')
  if (!fee) fee = 0
  var t;
  if (transaction) {
    t = transaction
  } else {
    t = await sequelize.transaction()
  }

  var order = (await Order.findOne({
    where: {
      id: orderId
    }
  })).dataValues

  var userOpenId = order.userOpenId
  if (!userOpenId) {
    throw new Error('订单号不正确或订单不是等待发货状态')
  }

  var user = (await User.findOne({
    where: {
      id: order.userOpenId
    }
  })).dataValues

  if (user.balance < fee) throw new Error('余额不足以支付快递费')

  try {
    const createOpt = {
      company: company
    }
    if (num) createOpt.number = num
    if (fee) createOpt.fee = fee
    const express = (await Express.create(createOpt, {
      transaction: t
    })).dataValues

    const expressId = express.id

    await Order.update({
      expressId: expressId,
      total: order.total + fee
    }, {
      where: {
        id: orderId
      },
      transaction: t
    })

    await User.update({
      balance: user.balance - fee
    }, {
      where: {
        id: userOpenId
      },
      transaction: t
    })

    await t.commit()

  } catch (error) {
    await t.rollback()
    throw new Error('发货失败，数据库异常')
  }
}

/**
 * Rollback order
 * Payback user's cost, then updata order status to 'rollback'
 * @parameter orderId required
 * @parameter transaction optional
 */
const rollbackOrder = async function(orderId, transaction) {
  if (!orderId) throw new Error('缺少参数')

  let order = (await Order.findOne({
    where: {
      id: orderId,
      status: 'waitting'
    }
  })).dataValues

  let openId = order.userOpenId

  if (!openId) {
    throw new Error('订单号不正确或订单不是等待发货状态')
  }

  let t
  if (transaction) {
    t = transaction
  } else {
    t = await sequelize.transaction()
  }

  try {

    await User.update({
      balance: user.balance + order.total
    }, {
      where: {
        id: openId
      },
      transaction: t
    })
    await Order.update({
      status: 'rollback'
    }, {
      where: {
        id: orderId
      },
      transaction: t
    })
    await t.commit()

  } catch (error) {
    t.rollback()
    throw new Error('回滚订单失败，数据库异常')
  }
}

/**
 * Query all orders nested Details and Address,
 * Details also nested Commodity query, order by createAt .
 * @Param [offset, limit] required
 * @Param [status, openId, order] optional
 */
const pagedQuery = async function(offset, limit, status, openId, orderBy) {
  const opt = {
    where: {},
    include: [{
      model: Details,
      include: [Commodity]
    }, {
      model: Address
    }]
  }

  opt.limit = limit
  opt.offset = offset

  if (openId) {
    opt.where.userOpenId = openId
  }

  if (status) {
    opt.where.status = status
  }

  if(orderBy) {
    opt.order = [orderBy]
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
    return orders
  } catch (err) {
    throw new Error('数据库异常')
  }
}

module.exports = {
  rollbackOrder,
  doOrder,
  pagedQuery,
}