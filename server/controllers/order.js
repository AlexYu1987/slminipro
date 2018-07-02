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
    await next()

  } catch (error) {
    //rollback transaction
    t.rollback()
    throw new Error('生成订单失败')
  }
}

const uncomplite = async function(ctx, next) {
  const userOpenId = ctx.request.query.userOpenId
  if (userIpenId) {
    throw new Error('用户未登录')
  }

  try {
    const models = await Order.findAll({
      where: {
        userOpenId: userOpenId,
        status: 'ready',
        include: [{
          model: Details,
          as: 'details',
          include: [Commodity]
        }, Address],
        order: 'createAt DESC'
      }
    })
  } catch (err) {
    throw new Error('数据库异常')
  }

  const orders = models.dataValues
  ctx.state.data = orders
  await next()
}

module.exports = {
  add,
  uncomplite
}