module.exports = async (ctx, next) => {
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
