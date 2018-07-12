/**
 * User controller
 * Created by: Alex.Y (7/12/2018)
 * Updated by:
 */

const userService = require('../service/userService.js')

const validation = async (ctx, next) => {
    // 通过 Koa 中间件进行登录态校验之后
    // 登录信息会被存储到 ctx.state.$wxInfo
    // 具体查看：
    if (ctx.state.$wxInfo.loginState === 1) {
        // loginState 为 1，登录态校验成功
        ctx.state.data.userinfo = ctx.state.$wxInfo.userinfo
        ctx.state.data['time'] = Math.floor(Date.now() / 1000)

        //find user's role
        let user = await User.findById(ctx.state.data.userinfo['openId'])
        ctx.state.data.userinfo['balance'] = user.balance
        ctx.state.data.userinfo['role'] = user.role

        console.log('login')
        
    } else {
        ctx.state.code = -1
    }
}

const pagedGetAll = async function(ctx, next) {
  const {offset, limit} = ctx.request.query
  //TODO: 校验参数
  try {
    const users = await userService.pagedFind(offset, limit)
    ctx.state.data = users

  } catch (err) {
    throw new Error('数据库异常')
  }

  await next()
}

const getOneById = async function(ctx, next) {
  const {openId} = ctx.request.query
  //TODO:参数校验

  try {
    const user = await userService.findById(openId)
    ctx.state.data = user

  } catch (err) {
    throw new Error('数据库异常')
  }

  await next()
}

const updateUser = async function(ctx, next) {
  const {openId, balance, discount} = ctx.request.query
  //TODO:参数校验
  try {
    const affect = await userService.updateUserById(openId, balance, discount)

  } catch(error) {
    throw new Error('数据库异常')
  }

  await next()
}

module.exports = {
  validation,
  pagedGetAll,
  getOneById,
  updateUser,
}
