/* 
 * 登录授权接口
 * Created By:Alex.Y
 * Since: 2018/6/21
 */
const {User} = require('../db/models.js')

module.exports = async (ctx, next) => {
    // 通过 Koa 中间件进行登录之后
    // 登录信息会被存储到 ctx.state.$wxInfo
    // 具体查看：
    if (ctx.state.$wxInfo.loginState) {
        ctx.state.data = ctx.state.$wxInfo.userinfo
        ctx.state.data['time'] = Math.floor(Date.now() / 1000)

        //find user's role
        User.findOrCreate({where: {openId: ctx.state.data.userinfo['openId']}, 
          default: {role: 'visitor'}}).spread((user, created) => {
            ctx.state.data.userinfo['balance'] = user.balance
            ctx.state.data.userinfo['role'] = user.role
          })
    }
}
