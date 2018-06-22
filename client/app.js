const qcloud = require('./vendor/wafer2-client-sdk/index')
const config = require('./config')
const {showBusy,showSuccess, showModal} = require('./utils/util.js')

App({
  onLaunch: function () {
    qcloud.setLoginUrl(config.service.loginUrl)
    showBusy('正在登录')
    const session = qcloud.Session.get()

    if (session) {
      // 第二次登录
      // 或者本地已经有登录态
      // 可使用本函数更新登录态
      qcloud.loginWithCode({
        success: res => {
          showSuccess('登录成功')
        },
        fail: err => {
          console.error(err)
          showModal('登录错误', err.message)
        }
      })
    } else {
      // 首次登录
      qcloud.login({
        success: res => {
          showSuccess('登录成功')
        },
        fail: err => {
          console.error(err)
          showModal('登录错误', err.message)
        }
      })
    }
  },
  onShow: function () {
    console.log('App Show')
  },
  onHide: function () {
    console.log('App Hide')
  },
  globalData: {
    hasLogin: false
  }
})