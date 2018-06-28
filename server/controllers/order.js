/*
 * Order service controller
 * Created by: Alex.Y (2018/6/28)
 * Updated by:
 */
const {Sequelize, sequelize, Order, User, Commodity, Details} = require('../db/models.js')

const add = function(ctx, next) {
  return sequelize.transaction(function (t) {
    //Get openId from Session and search userInfo
    let session = ctx.header['X - WX - Skey']
    let openId = cession.userinfo.openId
    if (!openId) throw new Error('未登录')

    //Use discount to calculate total cost, then serialize order
    let details = ctx.request.data || [], total = 0, user = {}
    let comIds = []
    details.forEach(detail => {
      comIds.push(detail.commodityId)
    })

    //Find commodity in comIds 
    Commodity.findAll({
      where: {id: {[Op.in]: comIds} },
      attributes: ['id', ['price']]
    }, {transaction: t}).then(commodities => {
      //calculate totoal price
      details.forEach(c => {
        total += commodities[c.commodityId] * c.count
      })

      return User.findOne({
        where: {openId: openId},
        attributes: ['discount', 'balance']
      })
    }, {transaction: t}).then(u => {
      user = u
      if (u.balance < total) throw Error('余额不足')
      //Add order include details
      return Order.create({
        total: total,
        userOpenId: openId
      })
    }, {transaction: t}).then(order => {
      //Add details
      details.forEach(d => {
        Details.create({
          commodityId: d.commodityId,
          count: d.count,
          orderId: order.id
        })
      })
    },{transaction:t}).then(() => {
      //Charge user's fee
      User.update({balance: user.balance - total}, {where: {openId: openId}})
    })
  }).then(result => {
    //return user info to refresh balance
    ctx.state.data = result
    ctx.state.code = 200
    return next()
  }).catch(error => {
    throw new Error(error.message) 
  })
}

module.exports = {add}