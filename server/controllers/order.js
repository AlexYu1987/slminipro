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
  Details
} = require('../db/models.js')

const add = async function(ctx, next) {
  //Get openId from Session and search userInfo
  let openId = ctx.header['openid']
  if (!openId) throw new Error('未登录')

  //Use discount to calculate total cost, then serialize order
  let details = ctx.request.body || [],
    total = 0
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
  //Throw Error
  if (user.balance < total) throw Error('余额不足')

  let t = await sequelize.transaction()
  try {
    //insert order
    let orderModel = await Order.create({
      total: total,
      userOpenId: openId
    },{transaction: t})
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
    ctx.state.code = 200
    await next()

  } catch (error) {
    //rollback transaction
    t.rollback()
    throw new Error('生成订单失败')
  }
}

module.exports = {
  add
}