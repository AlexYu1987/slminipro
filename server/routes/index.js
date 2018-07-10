/**
 * ajax 服务路由集合
 */
const router = require('koa-router')({
    prefix: '/weapp'
})
const controllers = require('../controllers')

// 从 sdk 中取出中间件
// 这里展示如何使用 Koa 中间件完成登录态的颁发与验证
const { auth: { authorizationMiddleware, validationMiddleware } } = require('../qcloud')

// --- 登录与授权 Demo --- //
// 登录接口
router.get('/login', authorizationMiddleware, controllers.login.getUserInfo, controllers.login.getRoleInfo)
// 用户信息接口（可以用来验证登录态）
router.get('/user', validationMiddleware, controllers.user)

// --- 图片上传 Demo --- //
// 图片上传接口，小程序端可以直接将 url 填入 wx.uploadFile 中
router.post('/upload', controllers.upload)

// --- 商品服务接口 --- //
//增加商品
router.post('/commodity/add', controllers.commodity.add)
//查询所有商品
router.get('/commodity/all', controllers.commodity.getAll)
router.post('/commodity/del', controllers.commodity.delById)

// --- 订单服务接口 Demo --- //
router.post('/order/add', controllers.order.add)
router.get('/order/query', controllers.order.query)
router.get('/order/query/all', controllers.order.queryAll)
router.get('/order/uncomplite/count', controllers.order.countUncomplite)
router.get('/order/deliver', controllers.order.deliver)
router.get('/order/rollback', controllers.order.rollback)

module.exports = router
