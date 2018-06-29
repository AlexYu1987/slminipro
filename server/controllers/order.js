/*
 * Order service controller
 * Created by: Alex.Y (2018/6/28)
 * Updated by:
 */
const {Sequelize, sequelize, Order, User, Commodity, Details} = require('../db/models.js')

const add = function(ctx, next) {
  return sequelize.transaction(function (t) {
    //Get openId from Session and search userInfo
    let openId = ctx.header['openid']
    if (!openId) throw new Error('未登录')

    //Use discount to calculate total cost, then serialize order
    let details = ctx.request.body || [], total = 0, user = {}
    let comIds = []
    details.forEach(detail => {
      comIds.push(detail.commodityId)
    })

    // commodity.findAll({
    //   where: {id: {[Sequelize.Op.in]: comIds}}
    // },{
    //   transaction: t
    // }).then(c => {
    //   //calculate totoal price
    //   details.forEach(c => {
    //     total += commodities[c.commodityId] * c.count
    //   })
    //   return User.
    // })

    //Find commodity in comIds 
    Commodity.findAll({
      where: {id: {[Sequelize.Op.in]: comIds} },
      attributes: ['id', 'price']
    }, {transaction: t}).then(commodities => {
      //calculate totoal price
      details.forEach(d => {
        commodities.forEach(c => {
          if (d.commodityId == c.id) {
            total += c.price * d.count
          }
        })    
      })
      return User.findOne({
        where: {openId: openId},
        attributes: ['discount', 'balance']
      }, { transaction: t })
    }).then(u => {
      user = u
      if (u.balance < total) throw Error('余额不足')
      //Add order include details
      return Order.create({
        total: total,
        userOpenId: openId
      }, { transaction: t })
    }).then(order => {
      //Add details
      let detailsArr = []
      details.forEach(d => {
        detailsArr.push({
          commodityId: d.commodityId,
          count: d.count,
          orderId: order.id
        })
        return Details.bulkCreate(detailsArr,{transaction: t})
      })
    }).then(() => {
      //Charge user's fee
      return User.update({balance: user.balance - total}, {where: {openId: openId}}, {transaction: t})
    }).catch(err => {
      throw new Error(err.message)
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

const test = async function(ctx) {
  //Get openId from Session and search userInfo
  let openId = ctx.header['openid']
  if (!openId) throw new Error('未登录')

  //Use discount to calculate total cost, then serialize order
  let details = ctx.request.body || [], total = 0, user = {}
  let comIds = []
  details.forEach(detail => {
    comIds.push(detail.commodityId)
  })

  let t = await Sequelize.transaction()


}

module.exports = {add, test}